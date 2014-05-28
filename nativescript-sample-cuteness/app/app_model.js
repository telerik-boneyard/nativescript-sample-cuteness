var http = require("http");
var modelModule = require("model");
var ImageSource = require("image-source").ImageSource;

var baseImage = new ImageSource();
baseImage.loadFromResource('logo');

var CollectionChangedAction;
(function (CollectionChangedAction) {
    CollectionChangedAction[CollectionChangedAction["Add"] = 0] = "Add";
    CollectionChangedAction[CollectionChangedAction["Remove"] = 1] = "Remove";
    CollectionChangedAction[CollectionChangedAction["Replace"] = 2] = "Replace";
    CollectionChangedAction[CollectionChangedAction["Move"] = 3] = "Move";
    CollectionChangedAction[CollectionChangedAction["Reset"] = 4] = "Reset";
})(CollectionChangedAction || (CollectionChangedAction = {}));

var CollectionChangedArgs = (function () {
    function CollectionChangedArgs(index, count, action) {
        this._index = index;
        this._count = count;
        this._action = action;
    }
    Object.defineProperty(CollectionChangedArgs.prototype, "index", {
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CollectionChangedArgs.prototype, "count", {
        get: function () {
            return this._count;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(CollectionChangedArgs.prototype, "action", {
        get: function () {
            return this._action;
        },
        enumerable: true,
        configurable: true
    });
    return CollectionChangedArgs;
})();


var appModel = (function () {
    var batchSize = 30;
    var jsonUrl = "http://www.reddit.com/r/aww.json?limit=" + batchSize;

    function appModel() {
        this.items = [];
        this.changedListeners = [];
        this.pendingDownloads = [];
        this.concurrentDownloads = 0;
    }
    
    appModel.prototype.isDefaultImage = function(thumbnail) {
        return thumbnail === 'default' || thumbnail === 'self' || thumbnail === '';
    };

    appModel.prototype.downloadThumbnail = function(item) {
        if(item.downloadingThumbnail) {
            return;
        }

        if(!item.callback) {
            var index = this.pendingDownloads.indexOf(item);
            if (index > -1) {
                this.pendingDownloads.splice(index, 1);
            }
            this.tryDownloadNextRequest();
            return;
        }

        if (item.bitmap || item.downloadRequestCompleted) {
            item.callback(item.bitmap);
            return;
        }

        if (this.isDefaultImage(item.imageUrl)) {
        	this.setBitmap(item, null);
        }
        else {
	        if(this.concurrentDownloads < 4) {
	            this.concurrentDownloads++;
	            item.downloadingThumbnail = true;
	            var that = this;
	
	            http.getImage(item.imageUrl).then(function(image) {
                    that.onImageDownloaded(item, image);
	            }).fail(function(error) {
                    that.onImageDownloaded(item, null);
	                });
	        }
	        else {
	            this.pendingDownloads.push(item);
	        }
        }
    };

    appModel.prototype.onImageDownloaded = function(item, image) {
        this.concurrentDownloads--;
       
        this.setBitmap(item, image);
        this.tryDownloadNextRequest();
    };
    
    appModel.prototype.setBitmap = function(item, image) {
    	 if (!image) {
             image = baseImage;
         }
         
         item.bitmap = image;
         item.downloadingThumbnail = false;
         if (item.callback) {
             item.callback(image);
         }
    };

    appModel.prototype.tryDownloadNextRequest = function() {
        if(this.pendingDownloads.length === 0) {
            return;
        }

        var item = this.pendingDownloads.pop();
        this.downloadThumbnail(item);
    };

    appModel.prototype.addChangedListener = function (listener) {
        if (listener) {
            this.changedListeners.push(listener);
        }
    };

    appModel.prototype.itemAt = function (index) {
        return this.items[index];
    };
    
    appModel.prototype.notifyChanged = function (collectionChangedArgs) {
    	var i, 
    		listener;
    	for(i = 0; i < this.changedListeners.length; i++) {
    		listener = this.changedListeners[i];
            if(listener.onItemsChanged) {
    			listener.onItemsChanged(collectionChangedArgs);
    		}
    	}
    };

    appModel.prototype.requestMoreItems = function () {
        if (this._downloadStarted) {
            return;
        }
        
        this._downloadStarted = true;
        var url = jsonUrl;
        if (this.itemCount > 0) {
        	url += "&after=" + this.items[this.itemCount - 1].fullName;
        }
        
        var that = this;
        http.getJSON(url)
        	.then(function (result) {
            that.onItemsDownloaded(result);
        });
    };

    appModel.prototype.onItemsDownloaded = function (result) {
    	var children = result.data.children;
    	var i,
    		child,
    		model;
    	
        var index = this.items.length;
        var action = index === 0 ? CollectionChangedAction.Reset : CollectionChangedAction.Add;
    	
    	for(i = 0; i < children.length; i++){
    		child = children[i].data;
    		model = new modelModule.model(child.title, child.thumbnail);
    		model.author = child.author;
    		model.fullName = child.name;
            var url = child.url;
            var imgurIndex = url.indexOf("imgur.com");                
            if(imgurIndex >= 0) {
                var invalidUrl = url.indexOf("i.") === -1 || url.lastIndexOf(".gif") !== -1;
                if (invalidUrl) {
                    continue;
                }
            }
    		
       		model.largeImageUrl = url;
    		model.commentsCount = child.num_comments;
    		model.commentsUrl = child.permalink;
    		model.score = child.score;
    		
            var dateCreated = new Date(child.created);
            model.created = dateCreated.toLocaleTimeString();

            this.items.push(model);
        }

        this._downloadStarted = false;
        var args = new CollectionChangedArgs(index, this.items.length - index, action);
        this.notifyChanged(args);
	};

    Object.defineProperty(appModel.prototype, "itemCount", {
        get: function () {
            return this.items.length;
        },
        enumerable: true,
        configurable: false
    });
    
    Object.defineProperty(appModel.prototype, "selectedItem", {
        get: function () {
            return this._selectedItem;
        },
        set: function(value) {
        	this._selectedItem = value;
        },
        enumerable: true,
        configurable: false
    });

    appModel.instance = new appModel();
    return appModel;
})();

exports.CollectionChangedArgs = CollectionChangedArgs;
exports.CollectionChangedAction = CollectionChangedAction;
exports.appModel = appModel;
exports.baseImage = baseImage;
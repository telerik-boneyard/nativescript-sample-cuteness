var model = (function(){
	
	function model(header, imageUrl) {
		this._header = header;
		this._imageUrl = imageUrl;
	}
	
	Object.defineProperty(model.prototype, "header", {
        get: function () {
            return this._header;
        },
        set: function(value) {
        	this._header = value;
        },
        enumerable: true,
        configurable: true
    });
	
	Object.defineProperty(model.prototype, "imageUrl", {
        get: function () {
            return this._imageUrl;
        },
        set: function(value) {
        	this._imageUrl = value;
        },
        enumerable: true,
        configurable: true
    });
	
	Object.defineProperty(model.prototype, "bitmap", {
        get: function () {
            return this._bitmap;
        },
        set: function(value) {
        	this._bitmap = value;
        	this._downloadingImage = false;
        	this._downloadCompleted = true;
        },
        enumerable: true,
        configurable: true
    });
	
	Object.defineProperty(model.prototype, "author", {
        get: function () {
            return this._author;
        },
        set: function(value) {
        	this._author = value;
        },
        enumerable: true,
        configurable: true
    });
	
	Object.defineProperty(model.prototype, "score", {
        get: function () {
            return this._score;
        },
        set: function(value) {
        	this._score = value;
        },
        enumerable: true,
        configurable: true
    });
	
	Object.defineProperty(model.prototype, "created", {
        get: function () {
            return this._created;
        },
        set: function(value) {
        	this._created = value;
        },
        enumerable: true,
        configurable: true
    });
	
	Object.defineProperty(model.prototype, "fullName", {
        get: function () {
            return this._fullName;
        },
        set: function(value) {
        	this._fullName = value;
        },
        enumerable: true,
        configurable: true
    });
	
	Object.defineProperty(model.prototype, "largeImageUrl", {
        get: function () {
            return this._largeImageUrl;
        },
        set: function(value) {
        	this._largeImageUrl = value;
        },
        enumerable: true,
        configurable: true
    });
	
	Object.defineProperty(model.prototype, "commentsCount", {
        get: function () {
            return this._commentsCount;
        },
        set: function(value) {
        	this._commentsCount = value;
        },
        enumerable: true,
        configurable: true
    });
	
	Object.defineProperty(model.prototype, "commentsUrl", {
        get: function () {
            return this._commentsUrl;
        },
        set: function(value) {
        	this._commentsUrl = value;
        },
        enumerable: true,
        configurable: true
    });
	
	Object.defineProperty(model.prototype, "downloadingImage", {
        get: function () {
            return this._downloadingImage;
        },
        set: function(value) {
        	this._downloadingImage = value;
        },
        enumerable: true,
        configurable: true
    });
	
	Object.defineProperty(model.prototype, "downloadRequestCompleted", {
        get: function () {
            return this._downloadCompleted;
        },
        set: function(value) {
        	this._downloadCompleted = value;
        },
        enumerable: true,
        configurable: true
    });
	
	return model;
})();

exports.model = model;
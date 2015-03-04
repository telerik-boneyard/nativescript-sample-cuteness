var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("data/observable");
var imageSource = require("image-source");
var redditAppViewModel = require("./reddit-app-view-model");
var firstThumbnailImageSource = imageSource.fromFile("~/app/res/first-image.png");
var defaultImageSource = imageSource.fromFile("~/app/res/reddit-logo-transparent.png");
var ISLOADING = "isLoading";
var THUMBNAIL_IMAGE_SOURCE = "thumbnailImageSource";
var IMAGE_SOURCE = "imageSource";
var RedditViewModel = (function (_super) {
    __extends(RedditViewModel, _super);
    function RedditViewModel(source) {
        _super.call(this);
        this._isLoading = false;
        this._source = source;
        if (this._source) {
            var property;
            for (property in this._source) {
                this.set(property, this._source[property]);
            }
        }
    }
    Object.defineProperty(RedditViewModel.prototype, "source", {
        get: function () {
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RedditViewModel.prototype, "isLoading", {
        get: function () {
            return this._isLoading;
        },
        set: function (value) {
            if (this._isLoading !== value) {
                this._isLoading = value;
                this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: ISLOADING, value: value });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RedditViewModel.prototype, "thumbnailImageSource", {
        get: function () {
            var _this = this;
            if (this._source) {
                if (this._source.title === "reddit 101") {
                    this._thumbnailImageSource = firstThumbnailImageSource;
                }
                else if (redditAppViewModel.cache) {
                    var url = this._source.thumbnail;
                    var imgSource = redditAppViewModel.cache.get(url);
                    if (imgSource) {
                        this._thumbnailImageSource = imgSource;
                    }
                    else if (_isValidImageUrl(url)) {
                        this.isLoading = true;
                        redditAppViewModel.cache.push({
                            key: url,
                            url: url,
                            completed: function (result, key) {
                                if (url === key) {
                                    _this.isLoading = false;
                                    _this._thumbnailImageSource = result;
                                    _this.notify({ object: _this, eventName: observable.knownEvents.propertyChange, propertyName: THUMBNAIL_IMAGE_SOURCE, value: result });
                                }
                            }
                        });
                    }
                    else {
                        this._thumbnailImageSource = redditAppViewModel.defaultNoThumbnailImageSource;
                    }
                }
            }
            return this._thumbnailImageSource || redditAppViewModel.defaultThumbnailImageSource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RedditViewModel.prototype, "imageSource", {
        get: function () {
            var _this = this;
            if (this._source) {
                var url = this._source.url;
                if (_isValidImageUrl(url)) {
                    this.isLoading = true;
                    imageSource.fromUrl(url).then(function (result) {
                        _this.isLoading = false;
                        _this.notify({ object: _this, eventName: observable.knownEvents.propertyChange, propertyName: IMAGE_SOURCE, value: result });
                    });
                }
            }
            return defaultImageSource;
        },
        enumerable: true,
        configurable: true
    });
    return RedditViewModel;
})(observable.Observable);
exports.RedditViewModel = RedditViewModel;
function _isValidImageUrl(url) {
    return url && (url.indexOf(".png") !== -1 || url.indexOf(".jpg") !== -1);
}

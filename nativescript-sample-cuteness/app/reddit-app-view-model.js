var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var imageSource = require("image-source");
var virtualArray = require("data/virtual-array");
var http = require("http");
var observable = require("data/observable");
var imageCache = require("ui/image-cache");
var redditViewModel = require("./reddit-item-view-model");
var aboutText = "Cuteness is a proof of concept app demonstrating the Telerik's NativeScript for writing native mobile applications using JavaScript.";
exports.defaultThumbnailImageSource = imageSource.fromFile("~/app/res/reddit-logo.png");
exports.defaultNoThumbnailImageSource = imageSource.fromFile("~/app/res/no-image.png");
var redditUrl = "http://www.reddit.com/r/aww.json?limit=";
var after;
var ISSCROLLING = "isLoading";
exports.cache = new imageCache.Cache();
exports.cache.invalid = exports.defaultNoThumbnailImageSource;
exports.cache.placeholder = exports.defaultThumbnailImageSource;
exports.cache.maxRequests = 5;
var AppViewModel = (function (_super) {
    __extends(AppViewModel, _super);
    function AppViewModel() {
        _super.apply(this, arguments);
        this._isScrolling = false;
    }
    Object.defineProperty(AppViewModel.prototype, "redditItems", {
        get: function () {
            var _this = this;
            if (!this._redditItems) {
                this._redditItems = new virtualArray.VirtualArray(1000);
                this._redditItems.loadSize = 50;
                this._redditItems.on(virtualArray.knownEvents.itemsLoading, function (args) {
                    http.getJSON(redditUrl + args.count + (after ? "&after=" + after : "")).then(function (result) {
                        var itemsToLoad = result.data.children.map(function (i) {
                            return new redditViewModel.RedditViewModel(i.data);
                        });
                        _this._redditItems.load(args.index, itemsToLoad);
                        var lastItem = itemsToLoad[itemsToLoad.length - 1];
                        if (lastItem) {
                            after = itemsToLoad[itemsToLoad.length - 1].source.name;
                        }
                    }, function (e) {
                        console.log(e.message);
                    }).catch(function (e) {
                        setTimeout(function () {
                            throw e;
                        });
                    });
                    ;
                });
            }
            return this._redditItems;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "isScrolling", {
        get: function () {
            return this._isScrolling;
        },
        set: function (value) {
            if (this._isScrolling !== value) {
                this._isScrolling = value;
                if (value) {
                    exports.cache.disableDownload();
                }
                else {
                    exports.cache.enableDownload();
                }
                this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: ISSCROLLING, value: value });
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "aboutText", {
        get: function () {
            return aboutText;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "defaultThumbnailImageSource", {
        get: function () {
            return exports.defaultThumbnailImageSource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "defaultNoThumbnailImageSource", {
        get: function () {
            return exports.defaultNoThumbnailImageSource;
        },
        enumerable: true,
        configurable: true
    });
    return AppViewModel;
})(observable.Observable);
exports.AppViewModel = AppViewModel;

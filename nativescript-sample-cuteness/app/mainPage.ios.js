var CutenessUtils = require("cutenessUtils");
var ImageSource = require("image-source").ImageSource;
var DetailViewController = require("detailsPage");

var appModule = require("app_model");
var baseImage = appModule.baseImage;
var appInstance = appModule.appModel.instance;
var CollectionChangedArgs = appModule.CollectionChangedArgs;
var CollectionChangedAction = appModule.CollectionChangedAction;

var imgLogo = new ImageSource();
imgLogo.loadFromResource('logo');

var imgSlide = new ImageSource();
imgSlide.loadFromResource('iconSlide');

var dataChangedListener = function (instance) {
    this.instance = instance;
    this.onItemsChanged = function(collectionChangedArgs) {
		this.instance.onCollectionChanged(collectionChangedArgs);
	}
}

var PostCell = UIKit.UICollectionViewCell.extends({
initWithFrame: function(frame) {
this.super.initWithFrame(frame);

this.backgroundColor = UIKit.UIColor.whiteColor();

this.imgView = UIKit.UIImageView.initWithFrame(CoreGraphics.CGRectMake(8, 8, 72, 72));
this.imgView.contentMode = UIKit.UIViewContentMode.UIViewContentModeScaleAspectFill;

this.imgView.masksToBounds = true;
this.imgView.clipsToBounds = true;

this.imgView.image = baseImage.ios;
this.contentView.addSubview(this.imgView);

this.label = UIKit.UILabel.initWithFrame(CoreGraphics.CGRectMake(88, 5, frame.size.width - 90, frame.size.height - 20));
this.label.font = UIKit.UIFont.fontWithNameSize("HelveticaNeue-Thin", 20); // size must match with sizeLabel in MainViewController
this.label.numberOfLines = 0;
//        this.label.autoresizingMask = UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleWidth | UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleHeight;
this.contentView.addSubview(this.label);

this.detailLabel = UIKit.UILabel.initWithFrame(CoreGraphics.CGRectMake(88, frame.size.height - 22, frame.size.width - 90, 16));
this.detailLabel.font = UIKit.UIFont.fontWithNameSize("HelveticaNeue-Thin", 12);
this.detailLabel.autoresizingMask = UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleWidth | UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleTopMargin
this.contentView.addSubview(this.detailLabel);

// cell delimiter
this.border = UIKit.UIView.initWithFrame(CoreGraphics.CGRectMake(0, frame.size.height - 1, frame.size.width, 1));
this.border.autoresizingMask = UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleWidth | UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleTopMargin;
this.border.backgroundColor = UIKit.UIColor.lightGrayColor();
this.contentView.addSubview(this.border);

// selected background view
var selectedBGView = UIKit.UIView.initWithFrame(this.bounds);
selectedBGView.backgroundColor = UIKit.UIColor.colorWithRedGreenBlueAlpha(0.023529, 0.505882, 0.454902, 1);
this.selectedBackgroundView = selectedBGView;

this.layer.shouldRasterize = true;
this.layer.rasterizationScale = UIKit.UIScreen.mainScreen().scale;

this.orientationIsPortrait = this.isPortrait();
},

isPortrait: function () {
var orientation = UIKit.UIApplication.sharedApplication().statusBarOrientation;
return UIKit.UIInterfaceOrientation.UIInterfaceOrientationPortrait === orientation
|| UIKit.UIInterfaceOrientation.UIInterfaceOrientationPortraitUpsideDown === orientation;
},

prepareForReuse: function () {
this.super.prepareForReuse();
this.imgView.image = baseImage.ios;
},

getImageSize: function () {
var size = UIKit.UIScreen.mainScreen().bounds.size;
var length = this.isPortrait() ? size.width / 2 : size.height / 3;
return CoreGraphics.CGRectMake(0, 0, length, length);
},

updateOrientation: function (isPortrait) {
if(this.thumbView) {
this.imgView.frame = this.getImageSize();
}
else {
this.label.frame = CoreGraphics.CGRectMake(this.label.frame.origin.x, this.label.frame.origin.y, this.frame.size.width - 90, this.label.font.pointSize);
this.label.sizeToFit();
}
},

updateView: function (inThumbView) {
this.updateVisibility(inThumbView);
var imageFrame = inThumbView ? this.getImageSize() : CoreGraphics.CGRectMake(8, 8, 72, 72);
if(this.imgView.frame !== imageFrame) {
this.imgView.frame = imageFrame;
}

if (!inThumbView) {
var size = UIKit.UIScreen.mainScreen().bounds.size;
var length = this.isPortrait() ? size.width : size.height;
this.label.frame = CoreGraphics.CGRectMake(this.label.frame.origin.x, this.label.frame.origin.y, length - 90, this.label.font.pointSize);
this.label.sizeToFit();
}
},

updateVisibility: function (inThumbView) {
if(this.thumbView !== inThumbView) {
this.thumbView = inThumbView;
this.label.hidden = inThumbView;
this.detailLabel.hidden = inThumbView;
this.border.hidden = inThumbView;
this.selectedBackgroundView.hidden = inThumbView;
}
},

setItem: function (item, inThumbView) {
this.label.text = CutenessUtils.decodeHtml(item.header);
this.updateView(inThumbView);

var attributedText = new UIKit.NSMutableAttributedString();
attributedText.replaceCharactersInRangeWithString(Foundation.NSMakeRange(0, 0), 'by ' + item.author + ' | ' + item.commentsCount + ' comments');
attributedText.addAttributeValueRange('NSColor', UIKit.UIColor.colorWithRedGreenBlueAlpha(0.023529, 0.505882, 0.454902, 1), Foundation.NSMakeRange(6 + item.author.length, (item.commentsCount + ' comments').length));
this.detailLabel.attributedText = attributedText;

var that = this;
item.callback = function(image)
{
that.imgView.image = image.ios;
};

appInstance.downloadThumbnail(item);
}
});

var WaitCell = UIKit.UICollectionViewCell.extends({
initWithFrame: function(frame) {
this.super.initWithFrame(frame);

this.backgroundColor = UIKit.UIColor.whiteColor();

this.activity = UIKit.UIActivityIndicatorView.initWithActivityIndicatorStyle(2);
this.activity.center = this.contentView.center;
this.activity.startAnimating();
this.contentView.addSubview(this.activity);
},

layoutSubviews: function() {
this.super.layoutSubviews();
this.activity.center = this.contentView.center;
},

updateOrientation: function (isPortrait) {
},

updateView: function (inThumbView) {
}
}, {
});

var MainViewController = UIKit.UICollectionViewController.extends({
    viewDidLoad: function() {
        this.super.viewDidLoad();
        this.thumbView = false;
        this.imgGrid = new ImageSource();
        this.imgGrid.loadFromResource('nav-grid');
        this.imgMenu = new ImageSource();
        this.imgMenu.loadFromResource('nav-menu');

        var imgView = UIKit.UIImageView.initWithImage(imgLogo.ios);
        this.navigationItem.titleView = imgView;

        // setting up collection view
        // using an instance is currently the only way (i know) to get .class
        this.postCell = new PostCell();
        this.waitCell = new WaitCell();

        this.collectionView.registerClassForCellWithReuseIdentifier(this.postCell.class(), "Cell");
        this.collectionView.registerClassForCellWithReuseIdentifier(this.waitCell.class(), "WaitCell");
        this.collectionView.backgroundColor = UIKit.UIColor.whiteColor();

        // preparing refresh control for our collection view
        this.refreshControl = new UIKit.UIRefreshControl();
        this.refreshControl.addTargetActionForControlEvents(this, 'refresh', UIKit.UIControlEvents.UIControlEventValueChanged);
        this.collectionView.addSubview(this.refreshControl);
        this.refreshControl.beginRefreshing();

        // mode button to switch collection view layouts
        this.modeButton = UIKit.UIBarButtonItem.initWithImageStyleTargetAction(this.imgGrid.ios, UIKit.UIBarButtonItemStyle.UIBarButtonItemStylePlain, this, 'toggleLayout');
        this.navigationItem.rightBarButtonItem = this.modeButton;

        // slide out menu button (hamburger button)
        var slideOutButton = UIKit.UIBarButtonItem.initWithImageStyleTargetAction(imgSlide.ios, UIKit.UIBarButtonItemStyle.UIBarButtonItemStylePlain, this, 'toggleMenu');
        this.navigationItem.leftBarButtonItem = slideOutButton;

        // size label is one of the ways to measure size
        this.sizeLabel = UIKit.UILabel.initWithFrame(CoreGraphics.CGRectMake(0, 0, 300, 200));
        this.sizeLabel.autoresizingMask = UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleWidth | UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleHeight;
        this.sizeLabel.font = UIKit.UIFont.fontWithNameSize("HelveticaNeue-Thin", 20); // size must match with the size of main label in PostCell
        this.sizeLabel.numberOfLines = -1;

        this.thumbView = false;
        this.updateOrientation();
        appInstance.addChangedListener(new dataChangedListener(this));
        this.getData();
    },

    viewDidAppear: function (animated) {
        this.updateOrientation();
        var that = this;
        this.getVisibleCells().forEach(function (cell) {
            cell.updateView(that.thumbView);
            cell.updateOrientation(that.orientationIsPortrait);
        });
        this.collectionView.performBatchUpdatesCompletion(null, null);
    },

    updateOrientation: function () {
        var orientation = UIKit.UIApplication.sharedApplication().statusBarOrientation;
        this.orientationIsPortrait = UIKit.UIInterfaceOrientation.UIInterfaceOrientationPortrait == orientation
                                    || UIKit.UIInterfaceOrientation.UIInterfaceOrientationPortraitUpsideDown == orientation;
    },

    didRotateFromInterfaceOrientation: function (fromInterfaceOrientation) {
        this.updateOrientation();
        var that = this;
        this.getVisibleCells().forEach(function (cell) {
            cell.updateOrientation(that.orientationIsPortrait);
        });
        this.collectionView.performBatchUpdatesCompletion(null, null);
    },

    toggleLayout: function() {
        this.thumbView = !this.thumbView;
        this.navigationItem.rightBarButtonItem.image = (this.thumbView ? this.imgMenu.ios : this.imgGrid.ios);
        var that = this;
        this.getVisibleCells().forEach(function (cell) {
            cell.updateView(that.thumbView);
        });
        this.collectionView.performBatchUpdatesCompletion(null, null);
    },

    getVisibleCells: function() {
        var cells = [];
        var visibleIndexPaths = this.collectionView.indexPathsForVisibleItems();
        var count = visibleIndexPaths.count();
        for(var i = 0; i < count; i++) {
            var index = visibleIndexPaths.objectAtIndex(i);
            var cell = this.collectionView.cellForItemAtIndexPath(index);
            cells.push(cell);
        }
        return cells;
    },

    toggleMenu: function() {
        this.slideOut.toggleMenu();
    },

    refresh: function() {
        this.getData();
    },

    textHeight: function(text) {
        this.sizeLabel.text = text;
        var size = this.sizeLabel.sizeThatFits(CoreGraphics.CGSizeMake(this.view.frame.size.width - 106, 0));
        if (!size.height) {
            return 44;
        }
        return size.height;
    },

    onCollectionChanged: function(collectionChangedArgs) {
        UIKit.UIApplication.sharedApplication().networkActivityIndicatorVisible = false;
        this.refreshControl.endRefreshing();

        var action = collectionChangedArgs.action;
        if(action === CollectionChangedAction.Add) {
            var arrayWithIndexPaths = new Foundation.NSMutableArray();
            var index = collectionChangedArgs.index;
            var count = index + collectionChangedArgs.count;
            while(index < count) {
                var indexPath = Foundation.NSIndexPath.indexPathForRowInSection(index++, 0);
                arrayWithIndexPaths.addObject(indexPath);
            }

            this.collectionView.insertItemsAtIndexPaths(arrayWithIndexPaths);
        }
        else if (action === CollectionChangedAction.Reset) {
            this.collectionView.reloadData();
        }
    },

    getData: function() {
        UIKit.UIApplication.sharedApplication().networkActivityIndicatorVisible = true;
        appInstance.requestMoreItems();
    }

}, {
    exposedMethods: {
        'toggleLayout': 'v@:@',
        'toggleMenu': 'v@:@',
        'refresh': 'v@:@'
    }
}).implements({

        protocol: "UICollectionViewDataSource",

        implementation: {
            collectionViewNumberOfItemsInSection: function(collectionView, section) {
                var length = appInstance.itemCount;
                if (0 === length) {
                    return 0;
                }
                return length + 1;
            },

            collectionViewCellForItemAtIndexPath: function(collectionView, indexPath) {
                var cell = null;
                if (indexPath.row >= appInstance.itemCount) {
                    cell = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath("WaitCell", indexPath);
                    this.getData();
                }
                else {
                    cell = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath("Cell", indexPath);
                    var item = appInstance.itemAt(indexPath.row);
                    cell.parent = this;
                    cell.setItem(item, this.thumbView);
                }

                return cell;
            }
        }
    }
).implements({

        protocol: "UICollectionViewDelegateFlowLayout",

        implementation: {

            collectionViewLayoutMinimumLineSpacingForSectionAtIndex: function(collectionView, collectionViewLayout, section) {
                return 0;
            },

            collectionViewLayoutMinimumInteritemSpacingForSectionAtIndex: function(collectionView, collectionViewLayout, section) {
                return 0;
            },

            collectionViewLayoutInsetForSectionAtIndex: function(collectionView, collectionViewLayout, section) {
                return UIKit.UIEdgeInsetsMake(0, 0, 0, 0);
            },
             
            collectionViewLayoutSizeForItemAtIndexPath: function(collectionView, collectionViewLayout, indexPath) {
                if (indexPath.row >= appInstance.itemCount) {
                    // this is the wait to reload cell
                    return CoreGraphics.CGSizeMake(collectionView.frame.size.width, 44);
                }

                if (this.thumbView) {
                    var size = UIKit.UIScreen.mainScreen().bounds.size;
                    var length = this.orientationIsPortrait ? size.width / 2 : size.height / 3;
                    length = Math.floor(length);
                    return CoreGraphics.CGSizeMake(length, length);
                }

                var item = appInstance.itemAt(indexPath.row);
                var height = Math.max(this.textHeight(CutenessUtils.decodeHtml(item.header)) + 30, 88);
                return CoreGraphics.CGSizeMake(collectionView.frame.size.width, height);
            }
        }
    }
).implements({

        protocol: "UICollectionViewDelegate",

        implementation: {

            collectionViewDidSelectItemAtIndexPath: function(collectionView, indexPath) {
                if (indexPath.row < appInstance.itemCount && (!this.slideOut.menuVisible)) {
                    var item = appInstance.itemAt(indexPath.row);
                    var details = new DetailViewController();
                    details.item = item;
                    this.navigationController.pushViewControllerAnimated(details, true);
                }
            }
        }
    }
);

module.exports = MainViewController;
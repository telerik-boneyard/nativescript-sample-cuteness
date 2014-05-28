var CutenessUtils = require("cutenessUtils");
var http = require("http");
var ImageSource = require("image-source").ImageSource;
//var GifAnimator = require("animatedGIF");
var redditUrl = "http://www.reddit.com";

var imgLogo = new ImageSource();
imgLogo.loadFromResource('logo');

var DetailViewController = UIKit.UIViewController.extends({
    viewDidLoad: function() {
        this.super.viewDidLoad();

        var imgView = UIKit.UIImageView.initWithImage(imgLogo.ios);
        this.navigationItem.titleView = imgView;

        this.view.backgroundColor = UIKit.UIColor.colorWithRedGreenBlueAlpha(0.211765, 0.223529, 0.250980, 1);
        this.activityIndicator = UIKit.UIActivityIndicatorView.initWithActivityIndicatorStyle(UIKit.UIActivityIndicatorViewStyle.UIActivityIndicatorViewStyleWhiteLarge);
        this.activityIndicator.center = this.view.center;
        this.view.addSubview(this.activityIndicator);
        this.activityIndicator.startAnimating();

        this.scrollView = UIKit.UIScrollView.initWithFrame(this.view.frame);
        this.scrollView.autoresizingMask = UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleWidth | UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleHeight;
        this.scrollView.hidden = true;
        this.scrollView.contentInset = UIKit.UIEdgeInsetsMake(this.navigationController.navigationBar.frame.size.height + 20, 0, 0, 0);
        this.view.addSubview(this.scrollView);

        this.imgView = new UIKit.UIImageView();
        this.scrollView.addSubview(this.imgView);

        this.titleLabel = UIKit.UILabel.initWithFrame(this.view.frame);
        this.titleLabel.font = UIKit.UIFont.fontWithNameSize("HelveticaNeue-Thin", 28);
        this.titleLabel.numberOfLines = 0;
        this.titleLabel.textColor = UIKit.UIColor.whiteColor();
        this.titleLabel.text = CutenessUtils.decodeHtml(this.item.header);
        this.scrollView.addSubview(this.titleLabel);

        this.detailLabel = UIKit.UILabel.initWithFrame(this.view.frame);
        this.detailLabel.font = UIKit.UIFont.fontWithNameSize("HelveticaNeue-Thin", 16);
        this.detailLabel.numberOfLines = 0;
        this.detailLabel.userInteractionEnabled = true;

        var tapGestureRecognizer = UIKit.UITapGestureRecognizer.initWithTargetAction(this, 'onTap');
        this.detailLabel.addGestureRecognizer(tapGestureRecognizer);

        var text = 'by ' + this.item.author + ' | ' + this.item.commentsCount + ' comments';
        var attributedText = UIKit.NSMutableAttributedString.initWithString(text);

        attributedText.addAttributeValueRange('NSColor', UIKit.UIColor.whiteColor(), Foundation.NSMakeRange(0, text.length));
        attributedText.addAttributeValueRange('NSColor', UIKit.UIColor.colorWithRedGreenBlueAlpha(0.023529, 0.505882, 0.454902, 1), Foundation.NSMakeRange(6 + this.item.author.toString().length, (9 + this.item.commentsCount.toString().length)));
        this.detailLabel.attributedText = attributedText;
        this.scrollView.addSubview(this.detailLabel);

        this.getData();
    },

    didRotateFromInterfaceOrientation: function (fromInterfaceOrientation) {
        this.scrollView.contentInset = UIKit.UIEdgeInsetsMake(this.navigationController.navigationBar.frame.size.height + 20, 0, 0, 0);
        this.activityIndicator.center = this.view.center;
    },
                                                          
    onTap: function() {
        var url = redditUrl + this.item.commentsUrl;
        UIKit.UIApplication.sharedApplication().openURL(Foundation.NSURL.URLWithString(url));
    },

    getData: function() {
        UIKit.UIApplication.sharedApplication().networkActivityIndicatorVisible = true;
        var url = this.item.largeImageUrl;
        if (url.match(/http:\/\/imgur.com\/.[^\/]/i) || url.match(/http:\/\/imgur.com\/a\//i) || url.match(/http:\/\/imgur.com\/gallery\//i)) {
            var str = Foundation.NSString.stringWithString(url);
            url = 'http://i.imgur.com/' + str.lastPathComponent() + '.jpg';
        }

/*        if (url.match(/\.gif$/i)) {
            var res = GifAnimator.animatedImageWithAnimatedGIFURL(url);
        }
        else {*/
            var that = this;
        http.getImage(url)
            .then(function(image) {
                if (image && image.ios) {
                    that.image = image;
                }
                else
                {
                    that.image = null;
                    that.titleLabel.text = 'Error loading image!';
                    that.detailLabel.text = '';
                }
                that.scrollView.hidden = false;
                that.view.setNeedsLayout();
                that.activityIndicator.stopAnimating();
                UIKit.UIApplication.sharedApplication().networkActivityIndicatorVisible = false;
            })
            .fail(function(error) {
                that.image = null;
                that.titleLabel.text = 'Error loading image!';
                that.detailLabel.text = '';
                that.scrollView.hidden = false;
                that.view.setNeedsLayout();
                that.activityIndicator.stopAnimating();
                UIKit.UIApplication.sharedApplication().networkActivityIndicatorVisible = false;
            });
/*        }*/
    },

    viewDidLayoutSubviews: function() {
        this.super.viewDidLayoutSubviews();
        this.activityIndicator.center = this.view.center;
        if (this.image && this.image.ios) {
            var maxWidth = this.view.frame.size.width;
            var expectedWidth = expectedWidth = maxWidth;
            var expectedHeight = maxWidth * (this.image.height / this.image.width);
                                                                  
            this.imgView.image = this.image.ios;
            this.imgView.frame = CoreGraphics.CGRectMake(0, 0, expectedWidth, expectedHeight);

            this.titleLabel.frame = CoreGraphics.CGRectMake(20, expectedHeight + 15, expectedWidth - 30, 9999);
            this.titleLabel.sizeToFit();

            this.detailLabel.frame = CoreGraphics.CGRectMake(20, expectedHeight + 30 + this.titleLabel.frame.size.height, expectedWidth - 20, 9999);
            this.detailLabel.sizeToFit();

            this.scrollView.contentSize = CoreGraphics.CGSizeMake(this.view.frame.size.width, expectedHeight + this.titleLabel.frame.size.height + this.detailLabel.frame.size.height + 45);
        }
        else {
            this.titleLabel.frame = CoreGraphics.CGRectMake(20, 15, this.view.frame.size.width - 40, 9999);
            this.titleLabel.sizeToFit();
        }
    }
}, {
    exposedMethods: {
        'onTap': 'v@:@'
    }
});

module.exports = DetailViewController;
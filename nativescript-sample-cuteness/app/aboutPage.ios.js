var ImageSource = require("image-source").ImageSource;

var AboutViewController = UIKit.UIViewController.extends({
    viewDidLoad: function() {
        this.super.viewDidLoad();

        this.title = 'About';

        this.view.backgroundColor = UIKit.UIColor.whiteColor();
        
        this.label = UIKit.UILabel.initWithFrame(CoreGraphics.CGRectMake(24, 92, this.view.frame.size.width - 48, this.view.frame.size.height - 92));
        this.label.font = UIKit.UIFont.fontWithNameSize("HelveticaNeue-Thin", 18);
        this.label.numberOfLines = 0;
        this.label.autoresizingMask = UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleWidth | UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleHeight;
        this.label.text = "Cuteness is a proof of concept app demonstrating the Telerik's cross-compile solution for writing native mobile applications using JavaScript.";
        this.label.sizeToFit();
        this.view.addSubview(this.label);

        var imgTelerik = new ImageSource();
        imgTelerik.loadFromResource('telerik-logo');
        this.imgView = UIKit.UIImageView.initWithImage(imgTelerik.ios);
        this.imgView.frame = CoreGraphics.CGRectMake(24, this.label.frame.size.height + 112, imgTelerik.width, imgTelerik.height);
        this.view.addSubview(this.imgView);

        // slide out menu button (hamburger button)
        var imgSlide = new ImageSource();
        imgSlide.loadFromResource('iconSlide');
        var slideOutButton = UIKit.UIBarButtonItem.initWithImageStyleTargetAction(imgSlide.ios, 0, this, 'toggleMenu');
        this.navigationItem.leftBarButtonItem = slideOutButton;
    },

    viewDidLayoutSubviews: function () {
        var orientation = UIKit.UIApplication.sharedApplication().statusBarOrientation
        var orientationIsPortrait = (UIKit.UIInterfaceOrientation.UIInterfaceOrientationPortrait == orientation) || (UIKit.UIInterfaceOrientation.UIInterfaceOrientationPortraitUpsideDown == orientation);

        this.label.frame = CoreGraphics.CGRectMake(24, orientationIsPortrait ? 92 : 80, this.view.frame.size.width - 48, this.view.frame.size.height - 92);
        this.label.sizeToFit();

        var frame = this.imgView.frame;
        frame.origin.y = this.label.frame.size.height + 112;
        this.imgView.frame = frame;
    },

    toggleMenu: function() {
        this.slideOut.toggleMenu();
    }

}, {
    exposedMethods: {
        'toggleMenu': 'v@:@',
    }
});

module.exports = AboutViewController;
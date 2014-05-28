var MENU_WIDTH = 256;

var SlideOutViewController = UIKit.UIViewController.extends({

    setup: function(menuVC, mainVC) {
        this.menuVC = menuVC;
        this.mainVC = mainVC;

        menuVC.setValueForKey(this, 'parentViewController');
        mainVC.setValueForKey(this, 'parentViewController');

        this.addChildViewController(this.menuVC);
        this.menuVC.didMoveToParentViewController(this);

        this.addChildViewController(this.mainVC);
        this.mainVC.didMoveToParentViewController(this);
    },

    toggleMenu: function() {
        this.showMenu(!this.menuVisible);
    },

    viewDidLoad: function() {
        this.super.viewDidLoad();
        this.view.autoresizingMask = UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleWidth | UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleHeight;
    },

    viewDidUnload: function() {
        this.super.viewDidUnload();

        if (this.menuVC) {
            this.menuVC.parentViewController = null;
            this.menuVC = null;
        }

        if (this.mainVC) {
            this.mainVC.parentViewController = null;
            this.mainVC = null;
        }

        this.menuView = null;
        this.mainView = null;
    },

    loadView: function() {
        this.super.loadView();

        this.menuView = UIKit.UIView.initWithFrame(CoreGraphics.CGRectMake(0, 0, MENU_WIDTH, this.view.frame.size.height));
        this.menuView.autoresizingMask = UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleWidth | UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleHeight;

        this.menuVC.viewWillAppear(false);
        this.menuView.addSubview(this.menuVC.view);
        this.menuVC.viewDidAppear(false);

        this.mainView = UIKit.UIView.initWithFrame(CoreGraphics.CGRectMake(0, 0, this.view.frame.size.width, this.view.frame.size.height));
        this.mainView.autoresizingMask = UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleWidth | UIKit.UIViewAutoresizing.UIViewAutoresizingFlexibleHeight;

        this.mainVC.viewWillAppear(false);
        this.mainView.addSubview(this.mainVC.view);
        this.mainVC.viewDidAppear(false);

        this.mainView.layer.shadowOffset = CoreGraphics.CGSizeMake(-1, -1);
        this.mainView.layer.shadowRadius = 5;
        this.mainView.layer.shadowOpacity = 0.5;
        this.mainView.layer.shadowColor = UIKit.UIColor.blackColor().CGColor;
        this.mainView.layer.shadowPath = UIKit.UIBezierPath.bezierPathWithRect(this.mainView.bounds).CGPath;

        var masterFrame = this.menuVC.view.frame;
        masterFrame.size.width = MENU_WIDTH;
        this.menuVC.view.frame = masterFrame;

        this.view.addSubview(this.menuView);
        this.view.addSubview(this.mainView);

        var swipe = UIKit.UISwipeGestureRecognizer.initWithTargetAction(this, 'performSwipe');
        swipe.numberOfTouchesRequired = 1;
        swipe.direction = UIKit.UISwipeGestureRecognizerDirection.UISwipeGestureRecognizerDirectionRight;
        this.mainView.addGestureRecognizer(swipe);

        swipe = UIKit.UISwipeGestureRecognizer.initWithTargetAction(this, 'performSwipe');
        swipe.numberOfTouchesRequired = 1;
        swipe.direction = UIKit.UISwipeGestureRecognizerDirection.UISwipeGestureRecognizerDirectionLeft;
        this.mainView.addGestureRecognizer(swipe);

        swipe = UIKit.UISwipeGestureRecognizer.initWithTargetAction(this, 'performSwipe');
        swipe.numberOfTouchesRequired = 1;
        swipe.direction = UIKit.UISwipeGestureRecognizerDirection.UISwipeGestureRecognizerDirectionLeft;
        this.menuVC.view.addGestureRecognizer(swipe);

        this.menuVisible = false;
    },

    didRotateFromInterfaceOrientation: function (fromInterfaceOrientation) {
        this.mainVC.didRotateFromInterfaceOrientation(fromInterfaceOrientation);
    },

    performSwipe: function(swipe) {
        var direction = swipe.direction;
        if (UIKit.UISwipeGestureRecognizerDirection.UISwipeGestureRecognizerDirectionLeft == direction && this.menuVisible) {
            this.showMenu(false);
        }
        else if (UIKit.UISwipeGestureRecognizerDirection.UISwipeGestureRecognizerDirectionRight == direction && !this.menuVisible) {
            this.showMenu(true);
        }
    },

    showMenu: function(show) {
        if (this.menuVisible)
            this.menuVC.viewWillDisappear(true);
        else
            this.menuVC.viewWillAppear(true);

        var frame = this.mainView.frame;

        if (show)
            frame.origin.x = this.view.frame.size.width - (this.view.frame.size.width - MENU_WIDTH);
        else
            frame.origin.x = 0;

        UIKit.UIView.beginAnimationsContext("master", null);
        UIKit.UIView.setAnimationCurve(UIKit.UIViewAnimationCurve.UIViewAnimationCurveEaseIn);
        UIKit.UIView.setAnimationDuration(0.2);
        UIKit.UIView.setAnimationDelegate(this);
        UIKit.UIView.setAnimationDidStopSelector('masterDidAnimate');

        this.mainView.frame = frame;
        if (!show) {
            this.mainVC.view.frame = frame;
        }

        UIKit.UIView.commitAnimations();

        this.menuVisible = show;
    },

    masterDidAnimate: function(sender) {
        if (this.menuVisible) {
            this.menuVC.viewDidAppear(true);
        }
        else {
            this.menuVC.viewDidDisappear(true);
        }
    },

    changeMain: function(mainVC) {
        if (this.mainVC) {
            this.mainVC.viewWillDisappear(false);
            this.mainVC.view.removeFromSuperview();
            this.mainVC.viewDidDisappear(false);
        }

        this.mainVC = mainVC;

        this.mainVC.viewWillAppear(false);
        this.mainView.addSubview(this.mainVC.view);
        this.mainVC.viewDidAppear(false);

        this.addChildViewController(this.mainVC);
        this.mainVC.didMoveToParentViewController(this);
    }
}, {
    exposedMethods: {
        'performSwipe': 'v@:@',
        'masterDidAnimate': 'v@:@'
    }
});

module.exports = SlideOutViewController;
var m_app = require("application");
m_app.init(null);

var MainViewController = require("mainPage");
var AboutViewController = require("aboutPage");
var CutenessUtils = require("cutenessUtils");
var SlideOutViewController = require("slideOutViewController");
var MenuViewController = require("menuViewController");

m_app.onLaunch = function() {
    
    var slideOut = new SlideOutViewController();
    
    var menuViewController = new MenuViewController();
    menuViewController.slideOut = slideOut;
    
    var mainViewController = new MainViewController(new UIKit.UICollectionViewFlowLayout());
    mainViewController.slideOut = slideOut;
    var mainNavController = new UIKit.UINavigationController(mainViewController);
    
    var aboutViewController = new AboutViewController();
    aboutViewController.slideOut = slideOut;
    var aboutNavController = new UIKit.UINavigationController(aboutViewController);
    
    menuViewController.setViewControllers([mainNavController, aboutNavController]);
    slideOut.setup(menuViewController, mainNavController);
    
    // style
    UIKit.UIApplication.sharedApplication().delegate.window.backgroundColor = UIKit.UIColor.colorWithRedGreenBlueAlpha(0.866667, 0.886275, 0.894118, 1);
    UIKit.UIApplication.sharedApplication().setStatusBarStyleAnimated(UIKit.UIStatusBarStyle.UIStatusBarStyleDarkContent, false);
    mainNavController.navigationBar.titleTextAttributes = CutenessUtils.JSToNSDictionary({ 'NSColor' : UIKit.UIColor.whiteColor() });
    //    mainNavController.navigationBar().setBarTintColor(UIKit.UIColor.colorWithRedGreenBlueAlpha(16/255, 196/255, 178/255, 1));
    mainNavController.navigationBar.barTintColor = UIKit.UIColor.colorWithRedGreenBlueAlpha(0.976471, 0.976471, 0.972549, 1);
    mainNavController.navigationBar.tintColor = UIKit.UIColor.colorWithRedGreenBlueAlpha(0.023529, 0.505882, 0.454902, 1);
    
    aboutNavController.navigationBar.titleTextAttributes = CutenessUtils.JSToNSDictionary({ 'NSColor' : UIKit.UIColor.colorWithRedGreenBlueAlpha(0.023529, 0.505882, 0.454902, 1) });
    aboutNavController.navigationBar.barTintColor = UIKit.UIColor.colorWithRedGreenBlueAlpha(0.976471, 0.976471, 0.972549, 1);
    aboutNavController.navigationBar.tintColor = UIKit.UIColor.colorWithRedGreenBlueAlpha(0.023529, 0.505882, 0.454902, 1);
    
    return slideOut;
};
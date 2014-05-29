var promises = require("promises");
var imageSource = require("image-source");
var types = require("camera/camera-types");

var merger = require("utils/module-merge");

merger.merge(types, exports);

var imagePickerController;

var CameraManager = (function () {
    function CameraManager() {
    }
    CameraManager.prototype.takePicture = function (params, onSuccess, onError) {
    };

    CameraManager.prototype.pictureFromLibrary = function (params, onSuccess, onError) {
    };
    return CameraManager;
})();
exports.CameraManager = CameraManager;

function topViewController() {
    return topViewControllerWithRootViewController(UIKit.UIApplication.sharedApplication().keyWindow.rootViewController);
}

function topViewControllerWithRootViewController(rootViewController) {
    if (rootViewController.isKindOfClass(UIKit.UITabBarController.class())) {
        return topViewControllerWithRootViewController(rootViewController.selectedViewController);
    } else if (rootViewController.isKindOfClass(UIKit.UINavigationController.class())) {
        return topViewControllerWithRootViewController(rootViewController.visibleViewController);
    } else if (rootViewController.presentedViewController) {
        return topViewControllerWithRootViewController(rootViewController.presentedViewController);
    } else {
        return rootViewController;
    }
}

exports.takePicture = function (options) {
    var d = promises.defer();

    var listener;

    var ImagePickerControllerListener = Foundation.NSObject.extends({}, {}).implements({
        protocol: "UIImagePickerControllerDelegate",
        implementation: {
            imagePickerControllerDidFinishPickingMediaWithInfo: function (picker, info) {
                picker.presentingViewController.dismissViewControllerAnimatedCompletion(true, null);
                listener = null;
                var image = imageSource.fromNativeSource(info.valueForKey(UIKit.UIImagePickerControllerOriginalImage));
                d.resolve(image);
            },
            imagePickerControllerDidCancel: function (picker) {
                picker.presentingViewController.dismissViewControllerAnimatedCompletion(true, null);
                listener = null;
                d.reject(new Error('takePicture canceled by user'));
            }
        }
    });

    imagePickerController = new UIKit.UIImagePickerController();
    listener = new ImagePickerControllerListener();
    imagePickerController.delegate = listener;
    imagePickerController.mediaTypes = UIKit.UIImagePickerController.availableMediaTypesForSourceType(1 /* UIImagePickerControllerSourceTypeCamera */);
    imagePickerController.sourceType = 1 /* UIImagePickerControllerSourceTypeCamera */;
    imagePickerController.modalPresentationStyle = 3 /* UIModalPresentationCurrentContext */;

    if (options && ("undefined" !== typeof options.cameraPosition) && (1 /* FRONT */ === options.cameraPosition)) {
        imagePickerController.cameraDevice = 1 /* UIImagePickerControllerCameraDeviceFront */;
    }

    if (options && ("undefined" !== typeof options.flashMode)) {
        if (-1 /* OFF */ === options.flashMode) {
            imagePickerController.cameraFlashMode = -1 /* UIImagePickerControllerCameraFlashModeOff */;
        } else if (1 /* ON */ === options.flashMode) {
            imagePickerController.cameraFlashMode = 1 /* UIImagePickerControllerCameraFlashModeOn */;
        }
    }

    topViewController().presentViewControllerAnimatedCompletion(imagePickerController, true, null);

    return d.promise();
};
//# sourceMappingURL=camera.ios.js.map

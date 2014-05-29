var promises = require("promises");
var imageSource = require("image-source");
var types = require("camera/camera-types");
var appModule = require("application");

var merger = require("utils/module-merge");

merger.merge(types, exports);

var REQUEST_IMAGE_CAPTURE = 2332;
var REQUEST_SELECT_PICTURE = 2;

var CameraManager = (function () {
    function CameraManager() {
    }
    CameraManager.prototype.takePicture = function (params, onSuccess, onError) {
        var takePictureIntent = new android.content.Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
        var androidApp = appModule.android;

        if (takePictureIntent.resolveActivity(androidApp.context.getPackageManager()) !== null) {
            androidApp.currentActivity.startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
        }
    };

    CameraManager.prototype.pictureFromLibrary = function (params, onSuccess, onError) {
        var readPictureIntent = new android.content.Intent();
        var androidApp = appModule.android;

        readPictureIntent.setType('image/*');
        readPictureIntent.setAction(android.content.Intent.ACTION_GET_CONTENT);

        androidApp.currentActivity.startActivityForResult(android.content.Intent.createChooser(readPictureIntent, 'Select Picture'), REQUEST_SELECT_PICTURE);
    };
    return CameraManager;
})();
exports.CameraManager = CameraManager;

function getTempFile() {
    var timeStamp = new java.text.SimpleDateFormat("yyyyMMdd_HHmmss").format(new java.util.Date());
    var imageFileName = "JPEG_" + timeStamp + "_";

    var documents = android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_PICTURES);
    var imagePath = java.io.File.createTempFile(imageFileName, ".jpg", documents);
    imagePath.deleteOnExit();

    return imagePath;
}

exports.takePicture = function (options) {
    var d = promises.defer();

    var takePictureIntent = new android.content.Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
    var androidApp = appModule.android;
    var imageFile;

    if (takePictureIntent.resolveActivity(androidApp.context.getPackageManager()) !== null) {
        var broadcastReceiver;
        var localBroadcast;
        var CameraBroadcastReceiver = android.content.BroadcastReceiver.extends({
            onReceive: function (context, intent) {
                localBroadcast.unregisterReceiver(broadcastReceiver);
                var requestCode = intent.getIntExtra("_requestCode", -1);
                var requestResult = intent.getIntExtra("_resultCode", -1);

                if (requestCode === REQUEST_IMAGE_CAPTURE) {
                    if (requestResult == android.app.Activity.RESULT_OK) {
                        var image = imageSource.fromFile(imageFile.getAbsolutePath());
                        if (image && image.android) {
                            d.resolve(image);
                        } else {
                            d.reject(new Error("invalid image at: " + imageFile));
                        }
                    } else {
                        d.reject(new Error("user cancel"));
                    }
                }
                if (imageFile) {
                    imageFile.delete();
                }
            }
        });
        var broadcastReceiver = new CameraBroadcastReceiver();
        var localBroadcast = android.support.v4.content.LocalBroadcastManager.getInstance(androidApp.currentActivity);
        localBroadcast.registerReceiver(broadcastReceiver, new android.content.IntentFilter("inline-data"));
        imageFile = getTempFile();
        takePictureIntent.putExtra(android.provider.MediaStore.EXTRA_OUTPUT, android.net.Uri.fromFile(imageFile));

        if (options && options.cameraPosition && (1 /* FRONT */ === options.cameraPosition)) {
            takePictureIntent.putExtra("android.intent.extras.CAMERA_FACING", 1);
        }

        androidApp.currentActivity.startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE);
    }

    return d.promise();
};
//# sourceMappingURL=camera.android.js.map

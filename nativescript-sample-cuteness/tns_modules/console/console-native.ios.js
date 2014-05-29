function nslog(prefix, message) {
    Foundation.NSLog("%@: %@", [{ type: PrimitiveType.POINTER, value: prefix }, { type: PrimitiveType.POINTER, value: message }]);
}

exports.helper_log = function (message) {
    nslog('log', message);
};

exports.info = function (message) {
    nslog('info', message);
};

exports.error = function (message) {
    nslog('error', message);
};

exports.warn = function (message) {
    nslog('warning', message);
};

exports.timeMillis = function () {
    return QuartzCore.CACurrentMediaTime() * 1000;
};
//# sourceMappingURL=console-native.ios.js.map

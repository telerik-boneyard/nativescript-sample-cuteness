var frames = require("ui/frame");
var redditAppViewModel = require("./reddit-app-view-model");
var appViewModel = new redditAppViewModel.AppViewModel();
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = appViewModel;
    if (frames.topmost().android) {
        frames.topmost().android.cachePagesOnNavigate = true;
    }
}
exports.pageLoaded = pageLoaded;
function listViewItemTap(args) {
    frames.topmost().navigate({
        moduleName: "app/details-page",
        context: appViewModel.redditItems.getItem(args.index)
    });
}
exports.listViewItemTap = listViewItemTap;
function listViewLoadMoreItems(args) {
    appViewModel.redditItems.length += appViewModel.redditItems.loadSize;
}
exports.listViewLoadMoreItems = listViewLoadMoreItems;

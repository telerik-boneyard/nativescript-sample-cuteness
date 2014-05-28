var appModelModule = require("app_model");
var appInstance = appModelModule.appModel.instance;
var baseImage = appModelModule.baseImage;

var adapterBody = {
	loadMoreItem: {},
	pendingDownloads: [],
	isDownloading: false,
	isScrolling: false,
	isWrapLayout: false,
	layoutChanged: false,
	
	getCount: function () {
		if(appInstance.itemCount === 0) {
			appInstance.requestMoreItems();
		}
		
		var count = appInstance.itemCount;
		if(this.isWrapLayout) {
			return Math.round(count / 2) + 1;
		}
		
		return count + 1;
	},
	
	getItem: function (position) {
		var index = this.isWrapLayout ? position * 2 : position; 
		if(index < appInstance.itemCount) {
			return appInstance.itemAt(index);
		}
		
		appInstance.requestMoreItems();
		return this.loadMoreItem;
	},
	
	getView: function (position, convertView, parent) {
		var item = this.getItem(position);
			
		if(!item) {
			return convertView;
		}
		
		if(item === this.loadMoreItem) {
			// item is LoadMore Item
			if (!this.progressView) {
				this.progressView = this.getLoadMoreView(parent.getContext());
			}
		
			this.progressView.setIndeterminate(true);
			this.progressView.setVisibility(constants.VISIBILITY_VISIBLE);			
			return this.progressView;
		}
		
		var itemLayout;
		var context = parent.getContext();
		
		if(!convertView || !convertView.getTag() || !convertView.getTag().item) {
			var layoutModule = require("item_layout");
			itemLayout = new layoutModule.item(context);
			convertView = itemLayout.rootView;
			
			// we need a java object here, cannot use setTag with a JS object
			var javaObject = new java.lang.Object();
			javaObject.item = itemLayout;
			convertView.setTag(javaObject);
		} 
		else {
			itemLayout = convertView.getTag().item;
		}
		
		itemLayout.item = item;
		this.downloadImage(item, itemLayout.image, position);
		if(this.isWrapLayout) {
			var nextPosition = (position * 2) + 1; 
			if (nextPosition < appInstance.itemCount) {
				var item2 = appInstance.itemAt(nextPosition);
				itemLayout.item2 = item2;
				this.downloadImage(item2, itemLayout.image2, position);
			}
			else {
				appInstance.requestMoreItems();
			}
		}
		else {
			itemLayout.setItem(item);
		}
		itemLayout.updateLayout(this.isWrapLayout);
		
		return convertView;
	},
	
	downloadImage: function(item, imageControl, position) {
		var imageUI = imageControl
		if(!item.bitmap && !item.downloadRequestCompleted) {
			var that = this;
			if(!item.callback) {
				item.callback = function(image) {
					if (that.isInVisibleRange(position)) {
						imageUI.setImageBitmap(image.android);
					}
				};
	
				appInstance.downloadThumbnail(item);
			}
		}
		else {
			imageUI.setImageBitmap(item.bitmap.android);
		}
	},
	
	isInVisibleRange: function(position) {
		var first = this.view.getFirstVisiblePosition();
		var last = this.view.getLastVisiblePosition();
		if(position < first || position > last) {
			console.log("Out Of View.")
			return false;
		}
		
		return true;
	},
	
	getItemId: function (position){
		return long(position);
	},
	
	getLoadMoreView: function(context){
		var progressBar = new android.widget.ProgressBar(context);				
		return progressBar;
	}
};

exports.adapterBody = adapterBody;
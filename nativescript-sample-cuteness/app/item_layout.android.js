var app = require("application");
var appModelModule = require("app_model");
var appModel = appModelModule.appModel.instance;
var baseImage = appModelModule.baseImage;

var item = (function () {
	function item(context) {
		var linearLayout = new android.widget.LinearLayout(context);
		linearLayout.setLayoutParams(new android.widget.AbsListView.LayoutParams(constants.LAYOUT_MATCH_PARENT, constants.LAYOUT_WRAP_CONTENT));
		linearLayout.setOrientation(constants.HORIZONTAL);

		var margin = metrics.toDIP(context, 8);
		var length = metrics.toDIP(context, 72);
		var imageView = getImageView(context, length, margin);
		linearLayout.addView(imageView);
		this.image = imageView;
		
		length = context.getResources().getDisplayMetrics().widthPixels / 2;		
		imageView = getImageView(context, length, 0);
		imageView.setVisibility(constants.VISIBILITY_GONE);
		linearLayout.addView(imageView);
		this.image2 = imageView;
		
		var that = this;		
		var onClickListener = new android.view.View.OnClickListener({
			onClick: function(view) {
				appModel.selectedItem = that.item2;
				var currentActivity = app.android.currentActivity;				
				var intent = new android.content.Intent(currentActivity, com.tns.NativeScriptActivity.class);
				intent.putExtra("details_activity", 0);
				currentActivity.startActivity(intent);
			}
		});		
		imageView.setOnClickListener(onClickListener);

		var linearLayoutDetails = new android.widget.LinearLayout(context);
		linearLayoutDetails.setOrientation(constants.VERTICAL);
		
		var layoutParams = new android.widget.LinearLayout.LayoutParams(constants.LAYOUT_WRAP_CONTENT, constants.LAYOUT_WRAP_CONTENT);
		var margin = metrics.toDIP(context, 8);
		layoutParams.setMargins(margin, margin, margin, margin);
		linearLayoutDetails.setLayoutParams(layoutParams);		
		linearLayout.addView(linearLayoutDetails);
		
		var tvHeader = new android.widget.TextView(context);
		layoutParams = new android.widget.LinearLayout.LayoutParams(constants.LAYOUT_WRAP_CONTENT, constants.LAYOUT_WRAP_CONTENT);
		tvHeader.setLayoutParams(layoutParams);
		tvHeader.setTextSize(20);
		tvHeader.setTextColor(android.graphics.Color.BLACK);
		
		linearLayoutDetails.addView(tvHeader);
		
		var tvAuthor = new android.widget.TextView(context);
		layoutParams = new android.widget.LinearLayout.LayoutParams(constants.LAYOUT_WRAP_CONTENT, constants.LAYOUT_WRAP_CONTENT);
		tvAuthor.setLayoutParams(layoutParams);
		tvAuthor.setTextSize(12);
		
		linearLayoutDetails.addView(tvAuthor);
		
		this.rootView = linearLayout;	
		this.header = tvHeader;
		this.author = tvAuthor;
		this.detailsLayout = linearLayoutDetails;
		
		this.isWrapLayout = false;
	};
	
	function getImageView(context, length, margin) {
		var imageView = new android.widget.ImageView(context);
		layoutParams = new android.widget.LinearLayout.LayoutParams(constants.LAYOUT_WRAP_CONTENT, constants.LAYOUT_WRAP_CONTENT);
		layoutParams.width = length;
		layoutParams.height = length;
		layoutParams.setMargins(margin, margin, margin, margin);
		imageView.setLayoutParams(layoutParams);
		imageView.setScaleType(android.widget.ImageView.ScaleType.FIT_XY);
		imageView.setImageBitmap(baseImage.android);
		
		return imageView;
	};
	
	item.prototype.setItem = function(item) {
		this.header.setText(item.header);
		
		var text = new android.text.SpannableString("by " + item.author + " | " + item.commentsCount + " comments");
		var start = 6 + item.author.length;
		var end = start + (item.commentsCount + ' comments').length;
		text.setSpan(new android.text.style.ForegroundColorSpan(android.graphics.Color.argb(255, 15, 194, 176)), start, end, android.text.Spanned.SPAN_INCLUSIVE_INCLUSIVE);
	 
		this.author.setText(text);
	};
	
	item.prototype.updateLayout = function(wrap) {
		if(this.isWrapLayout === wrap){
			return;
		}
		
		var context = this.rootView.getContext();
		var length;
		var margin;
		if(wrap) {
			margin = 0;
			length = context.getResources().getDisplayMetrics().widthPixels / 2;
			this.detailsLayout.setVisibility(constants.VISIBILITY_GONE);
			this.image2.setVisibility(constants.VISIBILITY_VISIBLE);
		} 
		else {
			margin = 8;
			length = metrics.toDIP(context, 72);
			this.detailsLayout.setVisibility(constants.VISIBILITY_VISIBLE);
			this.image2.setVisibility(constants.VISIBILITY_GONE);
		}
		
		margin = metrics.toDIP(context, margin);
		var layoutParams = this.image.getLayoutParams();
		layoutParams.width = length;
		layoutParams.height = length;		
		layoutParams.setMargins(margin, margin, margin, margin);
		
		this.isWrapLayout = wrap;
	};
	
	return item;
})();

exports.item = item;
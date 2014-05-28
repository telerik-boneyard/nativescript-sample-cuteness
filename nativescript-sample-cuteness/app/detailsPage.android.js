var appModelModule = require("app_model");
var appModel = appModelModule.appModel.instance;
var http = require("http");

var baseActivityModule = require("base_activity");
var activityBody = new baseActivityModule.activityBody();

var redditUrl = "http://www.reddit.com";
var userUrl = "http://www.reddit.com/user/";
var Html = android.text.Html;

activityBody.setupUI = function() {
	var selectedItem = appModel.selectedItem;
	
	var layoutParams;
	var relativeLayout = new android.widget.RelativeLayout(this);
	layoutParams = new android.view.ViewGroup.LayoutParams(constants.LAYOUT_MATCH_PARENT, constants.LAYOUT_MATCH_PARENT);
	relativeLayout.setLayoutParams(layoutParams);
	
	var progressBar = new android.widget.ProgressBar(this);
	layoutParams = new android.widget.RelativeLayout.LayoutParams(android.view.Gravity.CENTER_HORIZONTAL, android.view.Gravity.TOP);
	var length = metrics.toDIP(this, 72);
	layoutParams.width = length;
	layoutParams.height = length;	
	layoutParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_LEFT);
	layoutParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_TOP);
	layoutParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT);
	layoutParams.topMargin = metrics.toDIP(this, 100);
	progressBar.setLayoutParams(layoutParams);
	relativeLayout.addView(progressBar);
	
	progressBar.setIndeterminate(true);
	progressBar.setVisibility(constants.VISIBILITY_VISIBLE);
	this.progressBar = progressBar;
	
	var imageView = new android.widget.ImageView(this);
	layoutParams = new android.widget.RelativeLayout.LayoutParams(constants.LAYOUT_WRAP_CONTENT, constants.LAYOUT_WRAP_CONTENT);
	layoutParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_LEFT);
	layoutParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_TOP);
	layoutParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT);
	layoutParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_BOTTOM);
	layoutParams.bottomMargin = metrics.toDIP(this, 160);
	imageView.setLayoutParams(layoutParams);
	relativeLayout.addView(imageView);
	
	var scrollView = new android.widget.ScrollView(this);
	layoutParams = new android.widget.RelativeLayout.LayoutParams(constants.LAYOUT_MATCH_PARENT, metrics.toDIP(this, 160));
	layoutParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_LEFT);
	layoutParams.addRule(android.widget.RelativeLayout.ALIGN_PARENT_BOTTOM);
	scrollView.setLayoutParams(layoutParams);
	scrollView.setBackgroundColor(android.graphics.Color.parseColor("#363940"));
	
	relativeLayout.addView(scrollView);
	
	var linearLayout = new android.widget.LinearLayout(this);
	var length = metrics.toDIP(this, 6);
	linearLayout.setPadding(metrics.toDIP(this, 16), metrics.toDIP(this, 10), metrics.toDIP(this, 16), metrics.toDIP(this, 10));
	linearLayout.setOrientation(constants.VERTICAL);
	
	scrollView.addView(linearLayout);
	
	var tvTitle = new android.widget.TextView(this);
	tvTitle.setTextColor(android.graphics.Color.WHITE);
	tvTitle.setText(selectedItem.header);
	tvTitle.setLayoutParams(new android.widget.LinearLayout.LayoutParams(constants.LAYOUT_WRAP_CONTENT, constants.LAYOUT_WRAP_CONTENT));
	tvTitle.setTextSize(20);
	
	linearLayout.addView(tvTitle);
		
	// the layout that will store the author and comments links
	var linearLayoutBottom = new android.widget.LinearLayout(this);
	linearLayoutBottom.setOrientation(constants.HORIZONTAL);
	layoutParams = new android.widget.LinearLayout.LayoutParams(constants.LAYOUT_WRAP_CONTENT, constants.LAYOUT_WRAP_CONTENT);
	layoutParams.topMargin = metrics.toDIP(this, 12);
	linearLayoutBottom.setLayoutParams(layoutParams);
	
	var textSize = 16;
	// the "by " text view
	var tvBy = new android.widget.TextView(this);
	tvBy.setTextColor(android.graphics.Color.WHITE);
	tvBy.setText("by ");
	tvBy.setTextSize(textSize);
	
	linearLayoutBottom.addView(tvBy);
	
	var url = userUrl + selectedItem.author;
	var authorUrl = Html.fromHtml("<font color='#3DA799'><a href='" + url + "'>" + selectedItem.author + "</a></font>");
	
	// the author TextView
	var tvAuthor = new android.widget.TextView(this);
	tvAuthor.setText(authorUrl);
	tvAuthor.setMovementMethod(android.text.method.LinkMovementMethod.getInstance());
	tvAuthor.setTextSize(textSize);
	
	linearLayoutBottom.addView(tvAuthor);
	
	// the separator TextView
	var tvSeparator = new android.widget.TextView(this);
	tvSeparator.setTextColor(android.graphics.Color.WHITE);
	tvSeparator.setText(" | ");
	tvSeparator.setTextSize(textSize);
	
	linearLayoutBottom.addView(tvSeparator);
	
	url = redditUrl + selectedItem.commentsUrl;
	var comments = selectedItem.commentsCount + " comments";
	var commentsUrl = Html.fromHtml("<font color='#3DA799'><a href='" + url + "'>" + comments + "</a></font>");
	
    // the comments TextView
	var tvComments = new android.widget.TextView(this);
	tvComments.setText(commentsUrl);
	tvComments.setMovementMethod(android.text.method.LinkMovementMethod.getInstance());
	tvComments.setTextSize(textSize);
	
	linearLayoutBottom.addView(tvComments);	
	linearLayout.addView(linearLayoutBottom);
	this.setContentView(relativeLayout);	
	this.loadPicture(selectedItem, imageView);
};

activityBody.loadPicture = function(item, imageView) {
	var that = this;
	http.getImage(item.largeImageUrl)
		.then(function(image) {
			that.progressBar.setIndeterminate(false);
			that.progressBar.setVisibility(constants.VISIBILITY_GONE);
			
			if(image) {
				imageView.setImageBitmap(image.android);
			}
		});
};

activityBody.setupActionBar = function() {
	var actionBar = this.getActionBar();
	actionBar.setDisplayHomeAsUpEnabled(true);
};

activityBody.onOptionsItemSelected = function(item){
	var id = item.getItemId();
	if(id === constants.ID_HOME) {
		this.finish();
	}
	
	return true;
};

exports.activity = com.tns.NativeScriptActivity.extends(activityBody);
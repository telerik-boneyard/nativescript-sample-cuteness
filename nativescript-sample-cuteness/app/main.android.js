var app = require("application");

app.onLaunch = function() {
	var main_activity_module = require("mainPage");
	return main_activity_module.activity;
};

app.android.getActivity = function (intent){
	if (intent.hasExtra("about_activity")) {
		return require("aboutPage").activity;
	}
	else if (intent.hasExtra("details_activity")) {
		return require("detailsPage").activity;
	}
	else if (intent.getAction() == android.content.Intent.ACTION_MAIN) {
		return app.onLaunch();
	}
	else {
		fail("Can't create activity. Unknown action");
	}
}

constants = {
	LAYOUT_MATCH_PARENT: android.view.ViewGroup.LayoutParams.MATCH_PARENT,
	LAYOUT_WRAP_CONTENT: android.view.ViewGroup.LayoutParams.WRAP_CONTENT,
	HORIZONTAL: 0,
	VERTICAL: 1,
	UNIT_SCALED_PIXEL: 2,
	VISIBILITY_VISIBLE: 0,
	VISIBILITY_INVISIBLE: 4,
	VISIBILITY_GONE: 8,
	ID_HOME: 16908332,
};

metrics = {
	toDIP: function(context, num){
		return android.util.TypedValue.applyDimension(android.util.TypedValue.COMPLEX_UNIT_DIP, num, context.getResources().getDisplayMetrics());
	}
};

helpers = {
	setupActionBar: function(actionBar, layout){
		actionBar.setBackgroundDrawable(new android.graphics.drawable.ColorDrawable(android.graphics.Color.parseColor("#DDDDDD")));
		actionBar.setDisplayShowHomeEnabled(false);
		actionBar.setDisplayHomeAsUpEnabled(false);
	    actionBar.setDisplayShowTitleEnabled(false);
	    
	    actionBar.setDisplayShowCustomEnabled(true);
	    actionBar.setCustomView(layout);
	},
	
	getDrawableId: function(context, name) {
		return this.getResourceId(context, ":drawable/" + name);
	},
	
	getLayoutId: function(context, name){
		return this.getResourceId(context, ":layout/" + name);
	},
	
	getMenuId: function(context, name){
		return this.getResourceId(context, ":menu/" + name);
	},
	
	getStringId: function(context, name){
		return this.getResourceId(context, ":string/" + name);
	},
	
	getId: function(context, name){
		return this.getResourceId(context, ":id/" + name);
	},
	
	getResourceId: function(context, name) {
		var resources = context.getResources();
		var packageName = context.getPackageName();
		var uri = packageName + name;
		var resId = resources.getIdentifier(uri, null, null);
		
		return resId;
	}
}
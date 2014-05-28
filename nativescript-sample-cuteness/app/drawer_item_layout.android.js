var item = (function (){
	function item(context){
		var layoutParams;
		
		var relativeLayout = new android.widget.RelativeLayout(context);
		layoutParams = new android.widget.AbsListView.LayoutParams(constants.LAYOUT_MATCH_PARENT, metrics.toDIP(context, 48));
		relativeLayout.setLayoutParams(layoutParams);
		
		var textView = new android.widget.TextView(context);
		layoutParams = new android.widget.RelativeLayout.LayoutParams(constants.LAYOUT_WRAP_CONTENT, constants.LAYOUT_WRAP_CONTENT);
		layoutParams.leftMargin = metrics.toDIP(context, 16);
		layoutParams.addRule(android.widget.RelativeLayout.CENTER_VERTICAL);
		textView.setLayoutParams(layoutParams);
		textView.setTextSize(20);
		
		relativeLayout.addView(textView);
		
		this.rootView = relativeLayout;
		this.text = textView;
	};
	
	return item;
})();

exports.item = item;
var adapterBody = {
	getCount: function () {
		return 1;
	},
	
	getItem: function (position){
		return "About";
	},
	
	getView: function (position, convertView, parent){
		var item = this.getItem(position);
		
		var itemLayout;
		if(!convertView || !convertView.getTag()){
			var layoutModule = require("drawer_item_layout");
			itemLayout = new layoutModule.item(parent.getContext());
			convertView = itemLayout.rootView;
			
			// we need a java object here, cannot use setTag with a JS object
			var javaObject = new java.lang.Object();
			javaObject.item = itemLayout;
			convertView.setTag(javaObject);
		} else {
			itemLayout = convertView.getTag().item;
		}
		
		itemLayout.text.setText(item);
		
		return convertView;
	},
	
	getItemId: function (position){
		return long(position);
	}
};

exports.adapterBody = adapterBody;
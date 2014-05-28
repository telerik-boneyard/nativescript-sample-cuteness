var appModelModule = require("app_model");
var appModel = appModelModule.appModel.instance;
var baseImage = appModelModule.baseImage;
var itemsAdapterModule = require("items_adapter");
var drawerListAdapterModule = require("drawer_list_adapter");

// TODO: We hit a problem saving app state to local settings, check why later
// var localSettings = require("local-settings");

var ListView = android.widget.ListView;
var LayoutParams = android.view.ViewGroup.LayoutParams;

var dataChangedListener = function (adapter) {
	this.nativeInstance = adapter;
	this.onItemsChanged = function(collectionChangedArgs) {
		this.nativeInstance.notifyDataSetChanged();
	};
};

var baseActivityModule = require("base_activity");
var activityBody = new baseActivityModule.activityBody();

activityBody.drawerToggle = undefined;
activityBody.listView = undefined;
activityBody.drawerList = undefined;
activityBody.drawerLayout = undefined;

activityBody.onCreateOptionsMenu = function(menu){
	var inflater = this.getMenuInflater();
    inflater.inflate(helpers.getMenuId(this, "menu"), menu);
    
    // cache the Layout action button for later use
    var id = helpers.getId(this, "action_layout");
    this.layoutActionButton = menu.findItem(id);
    
    return this.super.onCreateOptionsMenu(menu);
};

activityBody.setupUI = function() {
	this.setContentView(helpers.getLayoutId(this, "main_activity"));
	
	var listView = this.findViewById(helpers.getId(this, "listView"));
	this.listView = listView;
	// TODO: See why commented at top of the file
	// this.userPrefs = userPrefsModule;
	this.drawerList = this.findViewById(helpers.getId(this, "drawer_list"));
	
	this.adapterBody = itemsAdapterModule.adapterBody;
	this.adapterBody.view = listView;
	var adapter = new android.widget.BaseAdapter.extends(this.adapterBody)();
	this.adapter = adapter;
	
	appModel.addChangedListener(new dataChangedListener(adapter));
	listView.setAdapter(adapter);	
	
//	NOTE: Uncomment to enable hardware acceleration.
	
//	listView.setScrollingCacheEnabled(true);
//	listView.setSmoothScrollbarEnabled(true);
//	var window = this.getWindow();
//	window.setFlags(android.view.WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
//			android.view.WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED);
//	
//	listView.setLayerType(android.view.View.LAYER_TYPE_HARDWARE, null);
	
	var recyclerListener = new android.widget.AbsListView.RecyclerListener({
		onMovedToScrapHeap: function(view) {
			var tag = view.getTag();
			if (tag !== null) {
				var itemLayout = tag.item;
				if (itemLayout.item) {
					itemLayout.item.callback = null;
					itemLayout.item = null;
				}
				if (itemLayout.image) {
					itemLayout.image.setImageBitmap(baseImage.android);
				}
				
				if (itemLayout.item2) {
					itemLayout.item2.callback = null;
					itemLayout.item2 = null;
				}
				if (itemLayout.image2) {
					itemLayout.image2.setImageBitmap(baseImage.android);
				}
			}

			if (view.class === android.widget.ProgressBar.class) {
				view.setIndeterminate(false);
				view.setVisibility(constants.VISIBILITY_GONE);
			}
		}
	});
	
	listView.setRecyclerListener(recyclerListener);
	
	var that = this;
	var itemClickListener = new android.widget.AdapterView.OnItemClickListener({
		onItemClick: function(arg0, arg1, arg2, arg3) {
			if (arg2 < appModel.itemCount) {
				var item = adapter.getItem(arg2);
				appModel.selectedItem = item;			
				var intent = new android.content.Intent(that, com.tns.NativeScriptActivity.class);
				intent.putExtra("details_activity", 0);
				that.startActivity(intent);
			}
		}
	});
	
	listView.setOnItemClickListener(itemClickListener);
	
	this.setupDrawerToggle();
	this.setupDrawerList();
};

activityBody.onOptionsItemSelected = function(item){
	var id = item.getItemId();
	if(id === helpers.getId(this, "action_layout")){
		this.changeLayout();
	}
	else if(id === helpers.getId(this, "action_about")){
		this.navigateToAbout();
	}
	else if(this.drawerToggle.onOptionsItemSelected(item)){
		return true;
	}
	
	return true;
};

activityBody.setupDrawerList = function(){
	var that = this;
	var adapter = new android.widget.BaseAdapter.extends(drawerListAdapterModule.adapterBody) ();
	var itemClickListener = new android.widget.AdapterView.OnItemClickListener({
		onItemClick: function(arg0, arg1, arg2, arg3){
			that.drawerLayout.closeDrawer(that.drawerList);
			
			that.navigateToAbout();
		},
	});
	
	this.drawerList.setAdapter(adapter);
	this.drawerList.setOnItemClickListener(itemClickListener);
};

activityBody.setupActionBar = function(){
	var actionBar = this.getActionBar();
	actionBar.setDisplayHomeAsUpEnabled(true);
	actionBar.setHomeButtonEnabled(true);	
};

activityBody.setupDrawerToggle = function(){
	this.drawerLayout = this.findViewById(helpers.getId(this, "drawer_layout"));
	this.drawerToggle = new android.support.v4.app.ActionBarDrawerToggle(
			this, 
			this.drawerLayout, 
			helpers.getDrawableId(this, "ic_drawer"),
			helpers.getStringId(this, "action_open_drawer"),
			helpers.getStringId(this, "action_close_drawer")
		);
	this.drawerLayout.setDrawerListener(this.drawerToggle);
	this.drawerToggle.syncState();
};

activityBody.onStart = function() {
	this.super.onStart();
	
	// TODO: See why commented at top of the file
//	if(this.userPrefs.hasKey("WrapLayout")){
//		this.wrapLayout = this.userPrefs.getBoolean("WrapLayout");
//		this.updateLayout();
//	}
	
//	if(this.userPrefs.hasKey("ScrollPosY")){
//		//this.listView.setScrollY(this.userPrefs.getNumber("ScrollPosY"));
//	}
};

activityBody.onPause = function() {
	this.super.onPause();
	
	// TODO: There is an exception here, check why
	// this.userPrefs.setNumber("ScrollPosY", this.listView.getScrollY());
	// this.userPrefs.setBoolean("WrapLayout", this.wrapLayout);
};

activityBody.updateLayout = function () {
	var layoutIconId;
	if(this.wrapLayout) {
		this.listView.setDividerHeight(0);
		layoutIconId = helpers.getDrawableId(this, "list_layout");
	} 
	else {
		this.listView.setDividerHeight(1);
		layoutIconId = helpers.getDrawableId(this, "wrap_layout");
	}
	
	if(this.layoutActionButton) {
		this.layoutActionButton.setIcon(layoutIconId);
	}
	this.adapterBody.isWrapLayout = this.wrapLayout;
};

activityBody.changeLayout = function() {
	this.wrapLayout = !this.wrapLayout;
	this.adapterBody.layoutChanged = true;
	
	this.updateLayout();	
	this.adapter.notifyDataSetChanged();
};

activityBody.navigateToAbout = function() {
	var intent = new android.content.Intent(this, com.tns.NativeScriptActivity.class);
	intent.putExtra("about_activity", 0);
	this.startActivity(intent);
};

exports.activity = com.tns.NativeScriptActivity.extends(activityBody);

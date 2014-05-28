var baseActivityModule = require("base_activity");
var activityBody = new baseActivityModule.activityBody();

activityBody.setupUI = function() {
	this.setContentView(helpers.getLayoutId(this, "about_activity"));
};

activityBody.updateOptionsMenu = function(menu){
	this.layoutActionButton.setVisible(false);
};

activityBody.setupActionBar = function(){
	var actionBar = this.getActionBar();
	actionBar.setDisplayHomeAsUpEnabled(true);
};

activityBody.onOptionsItemSelected = function(item){
	var id = item.getItemId();
	if(id === constants.ID_HOME){
		this.finish();
	}
	
	return true;
};

exports.activity = com.tns.NativeScriptActivity.extends(activityBody);
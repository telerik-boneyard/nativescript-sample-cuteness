var activityBody = (function(){
	function activity(){
		this.onCreate = function(bundle){
			this.super.onCreate(bundle);
		    
		    // This function is not defined here, inheritors will define it
			if(this.setupUI){
				this.setupUI();
			}
		    
		    if(this.setupActionBar){
		    	this.setupActionBar();
		    }
		};
	}
	
	return activity;
})();

exports.activityBody = activityBody;
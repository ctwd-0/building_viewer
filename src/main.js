import Vue from 'vue'
import Login from './login.vue'
import Viewer from './viewer.vue'

//import './global.js'
global.json_server = "localhost:8000";
//global.json_server = "13.125.98.199:8000";
global.the_fucking_bus = new Vue();
global.bus = global.the_fucking_bus;
global.model_id = 'g_-1';
global.cache_header = [];
global.cache_content = [];
global.cut_data = function(header, content) {
	for(var i in content) {
		content[i].splice(0,1);
	}
	header.splice(0,1);
	header[0] = '构件编号';

	for(var i in header) {
		if(header[i] === '') {
			header[i] = '-';
		}
	}
	for(var i in content) {
		for(var j in content[i]) {
			if(content[i][j] === '') {
				content[i][j] = '-';
			}
		}
	}
};

global.fix_absolute_uri = function(uri) {
	if(uri.charAt(0) === '/' || uri.charAt(0) === '\\' ) {
		return uri.substring(1);
	} else {
		return uri;
	}
};

if(document.getElementById('login')) {
	new Vue({
		el: '#login',
		 template: '<Login/>',
		 components: { Login }
	})
}

if(document.getElementById('viewer')) {
	new Vue({
		el: '#viewer',
		template: '<Viewer/>',
		components: { Viewer }
	})
}
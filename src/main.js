import Vue from 'vue'
import Login from './Login.vue'
import Viewer from './Viewer2.vue'
import Admin from './Admin.vue'

//数据服务器地址
global.json_server = "http://localhost:8000";
//global.json_server = "http://13.125.98.199:80";

//不同vue组件通信用
global.the_fucking_bus = new Vue();
global.bus = global.the_fucking_bus;

//当前显示的模型
global.model_id = 'g_-1';

//应该被弃用了。
global.cache_header = [];
global.cache_content = [];


//已弃用。
global.cut_data = function(header) {
	for(let i = 0 ; i < header.length; i++) {
		if(header[i] === "构件编号（表单中显示）") {
			header[i] = "构件编号"
		} else if (header[i] === "模型编号（rhino中对应编号，表单中表头、值均不显示）") {
			header[i] = "模型编号"
		}
	}
}

//已弃用
global.fix_absolute_uri = function(uri) {
	if(uri.charAt(0) === '/' || uri.charAt(0) === '\\' ) {
		return uri.substring(1);
	} else {
		return uri;
	}
};


//vue绑定dom
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
if(document.getElementById('admin')) {
	new Vue({
		el: '#admin',
		template: '<Admin/>',
		components: { Admin }
	})
}

import Vue from 'vue'
import Login from './login.vue'
import Viewer from './viewer.vue'

if(document.getElementById('login')) {
	new Vue({
		el: '#login',
		render: h => h(Login)
	})
}

if(document.getElementById('viewer')) {
	new Vue({
		el: '#viewer',
 		render: h => h(Viewer)
	})
}
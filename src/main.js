import Vue from 'vue'
import Login from './login.vue'
import Viewer from './viewer.vue'

new Vue({
	el: '#login',
	render: h => h(Login)
})

new Vue({
	el: '#viewer',
 	render: h => h(Viewer)
})
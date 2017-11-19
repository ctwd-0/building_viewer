<template>
	<div id="outer_div">
		<img id="login_back_image" src="./assets/login_back.png"> </img>
		<h1> {{db_name}} </h1>
		<div>
			<div>
				<label>{{label_username}}</label>
				<input v-model="username" type="text"></input>
			</div>
			<div>
				<label>{{label_password}}</label>
				<input v-model="password" type="password"></input>
			</div>
			<div>
				<label>{{label_db_version}}</label>
				<select v-model="selected">
					<option disabled value="">{{please_select}}</option>
					<option v-for= "version in versions">{{version}}</option>
				</select>
			</div>
			<button id="login" @click="login_click">{{button_text}}</button>
		</div>
		<div id="footer">
			<div>{{copyright}}</div>
			<div>{{system_builder}}</div>
		</div>
		<div class="clear"></div>
	</div>
</template>

<script>
export default {
	name: 'app',
	data () {
		return {
			copyright: '版权所有：故宫博物院',
			system_builder: '制作单位：北京大学考古文博学院，北京燕源文博信息技术有限公司',
			db_name: '北京故宫灵沼轩数据库',
			username: '',
			password: '',
			selected: '',
			please_select: '请选择',
			label_username: '用户',
			label_password: '密码',
			label_db_version: '数据年限',
			button_text: '进入',
			versions: [2016, 2017, 2018],
		};
	},
	methods: {
		login_click: function (event) {
			//alert(this.username);
		},
	},
}

</script>

<style scoped>

#outer_div {
	margin-left: auto;
	margin-right: auto;
	border-width: 3px;
	max-width: 1280px;
	border-style: solid;
	border-color: #41719c;
	position: relative;
}

#login_back_image {
	margin-top: 80px;
	float: left;
	width: 640px;
	height: 640px;
}

h1 {
	margin-top: 80px;
	font-size: 50px;
	color: #843c0c;
	border-bottom: 2px solid blue;
}

#footer {
	position: absolute;
	bottom: 10px;
	right: 50px;
	font-size: 15px;
}

.clear {
	clear: both;
}
</style>
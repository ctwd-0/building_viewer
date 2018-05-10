<template>
	<div id="outer_div">
		<img id="login_back_image" src="./assets/login_back.png"> </img>
		<h1> <span>{{db_name}}</span> </h1>
		<div id="login_container">
			<div class="login_blcok_line">
				<label display="block">{{label_username}}</label>
				<input class="login_block_input" v-model="username" type="text"></input>
			</div>
			<div class="login_blcok_line">
				<label>{{label_password}}</label>
				<input class="login_block_input" v-model="password" type="password"></input>
			</div>
			<div class="login_blcok_line">
				<label>{{label_db_version}}</label>
				<select class="login_blcok_select" v-model="selected">
					<option disabled value="">{{please_select}}</option>
					<option v-for= "version in versions">{{version}}</option>
				</select>
			</div class="login_blcok_line">
			<div>
				<button id="login" @click="login_click">{{button_text}}</button>
			</div>
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
	name: 'login',
	data () {
		return {
			copyright: '版权所有：故宫博物院',
			system_builder: '制作单位：北京大学考古文博学院，北京燕源文博信息技术有限公司',
			db_name: '北京故宫灵沼轩数据库',
			username: '',
			password: '',
			selected: '',
			please_select: '请选择',
			label_username: '用户名',
			label_password: '密码',
			label_db_version: '数据年限',
			button_text: '进入',
			versions: [2016, 2017, 2018],
		};
	},
	methods: {
		//登陆按钮。
		login_click: function (event) {
			if (this.username == "" || this.password == "") {
				alert("用户名和密码不能为空");
				return;
			}
			$.ajax({
				type: 'GET',
				url: json_server+"/user/login",
				data :{
					name:this.username,
					password:hex_md5(this.password),
				},
				xhrFields:{
					withCredentials:true
				},
				crossDomain: true,
				success: function( result ) {
					if(result["success"] == false) {
						alert(result["reason"]);
					} else {
						location.href="viewer.html";
					}
				},
			});
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
}
h1 > span {
	position: absolute;
	right: 50px;
	border-bottom: 2px solid #41719c;
}

#footer {
	position: absolute;
	bottom: 10px;
	right: 50px;
	font-size: 15px;
}

div > label {
	display:inline-block;
	height: 30px;
	width: 100px;
	font-size: 20px;
	text-align: center;
	background-color: #deebf7;
	vertical-align: middle;
}

#login_container {
	position: absolute;
	right: 50px;
	top: 300px;
}

.login_blcok_line {
	margin-top: 5px;
	margin-bottom: 5px;
}

.login_block_input {
	height:  24px;
	width: 150px;
	font-size: 18px;
	vertical-align: middle;
}

.login_blcok_select {
	height: 30px;
	width: 154px;
	vertical-align: middle;
}

#login {
	width: 260px;
	height: 30px;
	font-size: 18px;
}
.clear {
	clear: both;
}

</style>
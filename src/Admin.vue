<template>
	<div id="outer_div">
		<center><h1>管理后台</h1></center>
		<hr/>
		<center>
		<div id="user_list">
			<div v-for="(user, index) in users">
				<button>删除用户</button>
				<label>用户名：</label><label>{{user.name}}</label>
				<label>写权限</label><input type="checkbox" v-model="user.write">
				<label>禁用</label><input type="checkbox" v-model="user.banned">
				<input v-model="user.password">
				<button>重设密码</button>
			</div>
		</div>
		<hr/>
		<div v-if="adding">
			<label>新用户名：</label><input v-model="new_username">
			<label>密码：</label><input v-model="new_password">
			<button @click="commit_add_user">提交</button>
			<button @click="cancel_add_user">取消</button>
		</div>
		<div v-if="!adding">
			<button @click="add_user">添加用户</button>
		</div>
		<hr/>
		</center>
	</div>
</template>

<script>

export default {
	name: 'admin',
	data () {
		return {
			users:[
				{name:"名字", write:true, banned: false, password:""}
			],
			adding:false,
			new_username: "",
			new_password: "",
		};
	},
	methods: {
		add_user() {
			this.adding = true;
		},
		cancel_add_user() {
			this.new_username = "";
			this.new_password = "";
			this.adding = false;
		},
		commit_add_user() {
			let name = this.new_username.trim();
			let password = this.new_password.trim();
			if(name == "" || password == "") {
				alert("用户名及密码不能为空");
				return;
			}
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/admin/add_user",
				xhrFields:{
					withCredentials:true
				},
				data :{
					name:name,
					password:hex_md5(password),
				},
				crossDomain: true,
				success: function( result ) {
					if(result["success"] == false) {
						alert(result["reason"]);
					} else {
						alert("添加成功");
					}
				},
			});
		},
	},
	mounted: function() {
		let _this = this;
		$.ajax({
			type: 'GET',
			url: "http://"+json_server+"/admin/init",
			xhrFields:{
				withCredentials:true
			},

			crossDomain: true,
			success: function( result ) {
				if(result["success"] == false) {
					//alert(result["reason"]);
				} else {
					_this.$emit("user_arrive", result.users);
				}
			},
		});
		this.$on("user_arrive", function(users) {
			for(let index in users){
				users[index]["password"] = "";
			}
			_this.users = users;
		})
	},
}

</script>

<style scoped>

</style>

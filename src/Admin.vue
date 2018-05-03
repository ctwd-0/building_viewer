<template>
	<div class="outer_div">
		<div class="top_bar">
			<div class="top_bar_left">控制台</div>
			<div class="top_bar_user" title="管理员用户">{{admin}}</div>
			<button class="btn btn-info top_bar_logout" @click="logout">退出</button>
		</div>
		<div class="content_left">
			<div
				v-for="(category, index) in categories"
				:class="{'category_selected':category_index === index, 'category_not_selected':category_index !== index}"
				@click="change_category(index)"
			>
				{{category}}
			</div>
		</div>
		<div class="content_right">
			<div v-show="category_index === 0" style="">
				<label class="content_title">管理员</label>
				<div class="content_hr"></div>
				<div>
					<label style="margin-left:10px">新密码：</label>
					<input type="text" v-model="admin_password">
					<button class="btn btn-sm btn-danger" @click="update_admin_password">更新管理员密码</button>
				</div>
			</div>
			<div v-show="category_index === 1">
				<label class="content_title">用户列表</label>
				<div class="content_hr"></div>
				<div class="table_outer_div">
					<table id="simple-table" class="table table-bordered table-hover">
						<thead>
							<tr><th>用户名</th><th>写权限</th><th>禁用</th><th>密码</th><th>操作</th></tr>
						</thead>
						<tbody>
						<tr v-for="(user, index) in users">
							<td>{{user.name}}</td>
							<td><input @change="state_change(index)" type="checkbox" v-model="user.write"></td>
							<td><input @change="state_change(index)" type="checkbox" v-model="user.banned"></td>
							<td>
								<input type="text" v-model="user.password" placeholder="新密码">
								<button class="btn btn-sm btn-info" @click="set_password(index)">
									 <i class="ace-icon fa fa-pencil bigger-120"></i>
								</button>
							</td>
							<td>
								<button class="btn btn-sm btn-danger" @click="delete_user(index)">
									<i class="ace-icon fa fa-trash-o bigger-120"></i>
								</button>
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div v-if="adding" style="padding-left:10px">
					<label>新用户名：</label><input type="text" v-model="new_username">
					<label>密码：</label><input type="text" v-model="new_password">
					<button class="btn btn-sm btn-info" @click="commit_add_user">提交</button>
					<button class="btn btn-sm btn-danger" @click="cancel_add_user">取消</button>
				</div>
				<div v-if="!adding" style="padding-left:10px">
					<button class="btn btn-sm btn-info" @click="add_user">添加用户</button>
				</div>
			</div>
			<div v-show="category_index === 2">

			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'admin',
	data () {
		return {
			users:[
				//{name:"名字", write:true, banned: false, password:""}
			],
			adding:false,
			new_username: "",
			new_password: "",
			admin:"Admin",
			admin_password: "",
			categories: ["管理员账户", "一般账户", "浏览日志"],
			category_index: 0,
		};
	},
	methods: {
		update_admin_password() {
			if(this.admin_password === "") {
				alert("管理员密码不能为空");
				return;
			}
			let password = this.admin_password
			this.admin_password = ""
			this.post_password("admin", password)
		},

		change_category(index) {
			this.category_index = index
		},

		logout() {
			$.ajax({
				type: 'GET',
				url: json_server+"/user/logout",
				xhrFields:{
					withCredentials:true
				},
				success: function( result ) {
					//console.log(result)
					location.href = "/"
				},
			});
		},

		add_user() {
			this.adding = true;
		},

		cancel_add_user() {
			this.new_username = "";
			this.new_password = "";
			this.adding = false;
		},

		state_change(index) {
			let name = this.users[index].name.trim();
			let write = this.users[index].write;
			let banned = this.users[index].banned;
			let _this = this;
			$.ajax({
				type: 'GET',
				url: json_server+"/admin/update",
				xhrFields:{
					withCredentials:true
				},
				data :{
					name:name,
					write:write,
					banned:banned
				},
				success: function( result ) {
					if(result["success"] == false) {
						alert(result["reason"]);
					} else {
						if(result.users !== undefined) {
							_this.$emit("user_arrive", result.users);
						}
						alert("更新成功");
					}
				},
			});
		},

		set_password(index) {
			let name = this.users[index].name;
			let password = this.users[index].password;
			this.users[index].password = "";

			this.post_password(name, password)
		},
		
		post_password(name, password) {
			let _this = this;
			if(name === "" || password === "") {
				alert("用户名及密码不能为空");
				return;
			}
			$.ajax({
				type: 'GET',
				url: json_server+"/admin/password",
				xhrFields:{
					withCredentials:true
				},
				data :{
					name:name,
					password:hex_md5(password),
				},
				success: function( result ) {
					if(result["success"] == false) {
						alert(result["reason"]);
					} else {
						alert("密码修改成功");
					}
				},
				error: function(req, status, err) {
					alert("密码修改失败");
				},
			});
		},
		
		delete_user(index) {
			if (!del) {
				return
			}

			let _this = this;
			$.ajax({
				type: 'GET',
				url: json_server+"/admin/remove_user",
				xhrFields:{
					withCredentials:true
				},
				data :{
					name:this.users[index].name,
				},
				success: function( result ) {
					if(result["success"] == false) {
						alert(result["reason"]);
					} else {
						if(result.users !== undefined) {
							_this.$emit("user_arrive", result.users);
						}
						alert("删除成功");
					}
				},
			});
		},

		commit_add_user() {
			let name = this.new_username.trim();
			let password = this.new_password.trim();
			let _this = this;
			if(name == "" || password == "") {
				alert("用户名及密码不能为空");
				return;
			}
			$.ajax({
				type: 'GET',
				url: json_server+"/admin/add_user",
				xhrFields:{
					withCredentials:true
				},
				data :{
					name:name,
					password:hex_md5(password),
				},
				success: function( result ) {
					if(result["success"] == false) {
						alert(result["reason"]);
					} else {
						if(result.users !== undefined) {
							_this.$emit("user_arrive", result.users);
						}
						alert("添加成功");
					}
					_this.adding = false;
				},
			});
		},
	},
	mounted: function() {
		let _this = this;
		$.ajax({
			type: 'GET',
			url: json_server+"/admin/init",
			xhrFields:{
				withCredentials:true
			},
			success: function( result ) {
				if(result["success"] == false) {
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
.outer_div {
	position: fixed;
	left: 0;
	top: 0;
	right: 0;
	margin: 0;
	padding: 0;
}

.top_bar {
	position: relative;
	height: 60px;
	background-color: rgb(65,113,156);
}

.top_bar_left {
	position: absolute;
	color: white;
	font-size: 30px;
	left: 20px;
	top: 10px;
	display: inline-block;
}

.top_bar_user {
	position: absolute;
	padding: 10px;
	right: 88px;
	border-right: 1px solid white;
	font-size: 30px;
	color: white;
	display: inline-block;
}

.top_bar_logout {
	position: absolute;
	right: 0px;
	font-size: 27px;
}

.content_left {
	position: fixed;
	border-right: 1px solid rgb(233,233,233);
	background-color: rgb(242,242,242);
	left:0;
	top: 60px;
	bottom: 0;
	width: 180px;
}

.content_right {
	position: fixed;
	background-color: white;
	right: 0;
	top: 60px;
	bottom: 0;
	left: 181px;
}

.category_selected {
	background-color: rgb(255,255,255);
	border-bottom: 1px solid rgb(233,233,233);
	border-right: 3px solid rgb(15,110,190);
	color: rgb(15,110,190);
	height: 30px;
	font-size: 22px;
	padding-left: 20px;
	padding-top: 6px;
	padding-bottom: 6px;
	box-sizing: content-box;
}

.category_not_selected {
	background-color: rgb(248,248,248);
	border-bottom: 1px solid rgb(233,233,233);
	color: rgb(55,66,77);
	height: 30px;
	font-size: 22px;
	padding-left: 20px;
	padding-top: 6px;
	padding-bottom: 6px;
	box-sizing: content-box;
}

.content_title {
	display: inline-block;
	color: rgb(102,143,194);
	font-size: 40px;
	margin-top: 10px;
	margin-left: 10px;
	font-weight: 100;
}

.content_hr {
	height: 1px;
	background-color: rgb(240,240,240); 
	margin-bottom: 10px;
	margin-top: 10px;
}

.table_outer_div {
	padding-left: 10px;
	padding-right: 10px;
}
</style>

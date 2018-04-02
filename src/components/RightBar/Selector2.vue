<template>
	<div id="selector2">
		<div id="selector_content">
			<textarea id="query_string" v-model="query_string" wrap="off"/>
			<SelectInput
				v-model="current_name"
				:options="options"
				@clickon="click_on($event)"
			/>
			<button @click="search_click">检索</button>
			<button @click="new_query">新建</button>
			<button @click="edit_click">编辑</button>
			<button @click="save_current">保存</button>
			<button @click="delete_current">删除</button>
		</div>
		<div class="clear"></div>
	</div>
</template>

<script>
import SelectInput from '../Common/SelectInput.vue'

export default {
	name: 'selector2',
	components: {
		SelectInput,
	},
	data () {
		return {
			query_string: "",
			current_name: "",
			options: [],
		};
	},
	methods: {
		new_query: function() {
			this.current_name = "新建检索条件";
			this.query_string = "{\n  \"key\": \"\",\n  \"val\": \"\"\n}";
		},
		edit_click: function() {
			bus.$emit("edit_json", this.query_string);
		},
		delete_current: function() {
			if (this.current_name == ""){
				alert("删除名不能为空")
				return
			}
			$.ajax({
				type: 'POST',
				url: "http://"+json_server+"/query/delete",
				data: {
					name:this.current_name,
				},
				crossDomain: true,
				success: function( result ) {
					if(result["success"] == true) {
						if(result["names"] !== undefined && result["names"] instanceof Array) {
							bus.$emit("init:options", result["names"]);
						}
						alert("删除成功")
					} else {
						alert("删除失败：" + result["reason"])
					}
				},
			});
		},
		save_current: function() {
			if (this.current_name == ""){
				alert("保存名不能为空")
				return
			} else if (this.options.indexOf(this.current_name) !== -1) {
				alert("保存名与已有命名重复")
				return
			} else if (!this.query_legal(this.query_string)) {
				alert("检索条件格式不正确")
				return
			}
			$.ajax({
				type: 'POST',
				url: "http://"+json_server+"/query/add",
				data: {
					name:this.current_name,
					query:this.query_string,
				},
				crossDomain: true,
				success: function( result ) {
					if(result["success"] == true) {
						if(result["names"] !== undefined && result["names"] instanceof Array) {
							bus.$emit("init:options", result["names"]);
						}
						alert("保存成功")
					} else {
						alert("保存失败：" + result["reason"])
					}
				},
			});
		},
		search_click: function() {
			$.ajax({
				type: 'POST',
				url: "http://"+json_server+"/search",
				data: {
					query:this.query_string,
				},
				crossDomain: true,
				success: function( result ) {
					let header = result['header'];
					cut_data(header);
					bus.$emit("new_table_content_arrive", {
						header: header,
						content: result.content,
						ids: result.ids,
					});
				},
			});
		},
		check_data : function(obj) {
			if(obj instanceof Object) {
				for(let key in obj) {
					if(key === "key" || key === "val" || key === "op" || key === "exps") {
						continue;
					} else {
						return false;
					}
				}
				if(obj.key !== undefined) {
					if(obj.val !== undefined && obj.op === undefined && obj.exps=== undefined) {
						if(typeof(obj.key) === "string" && typeof(obj.val) === "string") {
							return true;
						}
					}
				} else {
					if(obj.val === undefined && obj.op !== undefined && obj.op !== undefined) {
						if(obj.op === "or" || obj.op === "and") {
							if(obj.exps instanceof Array) {
								for(var index in obj.exps) {
									if(!this.check_data(obj.exps[index])) {
										return false;
									}
								}
								return true;
							}
						}
					}
				}
			}
			return false;
		},
		query_legal(query) {
			try {
				let tempdata = JSON.parse(query);
				if(this.check_data(tempdata)) {
					return true
				}
			} catch (err) {
				return false
			}
			return false
		},
		click_on(val) {
			//console.log(val);
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/query/get",
				data: {
					name: val,
				},
				crossDomain: true,
				success: function( result ) {
					if(result["query"] !== undefined) {
						bus.$emit("query:loaded", result["query"]);
					}
				},
			});
		}
	},
	mounted: function() {
		var _this = this;
		bus.$on("query:finish", function(query) {
			_this.query_string = query;
		});
		bus.$on("init:options", function(options) {
			_this.options = options;
		});
		bus.$on("query:loaded", function(query) {
			_this.query_string = query;
		});
		$.ajax({
			type: 'GET',
			url: "http://"+json_server+"/query/init",
			crossDomain: true,
			success: function( result ) {
				if(result["names"] !== undefined && result["names"] instanceof Array) {
					bus.$emit("init:options", result["names"]);
				}
			},
		});
	},
}
</script>

<style scoped>
#selector2 {
	width: 260px;
	margin: 10px;
	margin-bottom: 2px;
	display: inline-block;
}

#selector_tab_header {
	float: left;
}

#selector_content {
	float: left;
	width: 260px;
	height: 200px;
	background-color: rgb(222,235,247);
	border-bottom: 1px solid rgb(65,113,156);
	border-top: 1px solid rgb(65,113,156);
	border-left: 1px solid rgb(65,113,156);
	border-right: 1px solid rgb(65,113,156);
}

#query_string {
	resize: none;
	width: 250px;
	height: 100px;
	margin: 2px;
}

.selector_line {
	width: 90px;
	margin: 18px auto;
}

.selector_line > label {
	font-size: 20px;
}
</style>
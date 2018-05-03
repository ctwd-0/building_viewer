<template>
	<div class="selector2" :style="{width:width - 20 + 'px'}">
		<div class="selector_content" :style="{width:width - 20 + 'px'}">
			<label class="selector_label" >检索条件：</label>
			<textarea class="query_string" :style="{width:width - 36 + 'px'}" v-model="query_string" wrap="off"/>
			<SelectInput
				class="select_input"
				v-model="current_name"
				:options="options"
				@clickon="click_on($event)"
			/>
			<button class="buttons" @click="search_click">检索</button>
			<button class="buttons" @click="new_query">新建</button>
			<button class="buttons" @click="edit_click">编辑</button>
			<button class="buttons" @click="save_current">保存</button>
			<button class="buttons" @click="delete_current">删除</button>
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
	props:{
		width: Number,
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
				url: json_server+"/query/delete",
				data: {
					name:this.current_name,
				},
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
				url: json_server+"/query/add",
				data: {
					name:this.current_name,
					query:this.query_string,
				},
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
				url: json_server+"/search",
				data: {
					query:this.query_string,
				},
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
				url: json_server+"/query/get",
				data: {
					name: val,
				},
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
			url: json_server+"/query/init",
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
.select_input {
	margin-left: 5px;
	margin-right: 5px;
}
.buttons {
	margin: 5px;
}
.selector2 {
	position: relative;
	margin: 8px;
	display: inline-block;
}

.selector_label {
	display: block;
	margin-left: 5px;
	margin-top: 5px;
	font-size: 17px;
}
.selector_content {
	background-color: rgb(222,235,247);
	border: 1px solid rgb(65,113,156);
}

.query_string {
	resize: none;
	height: 268px;
	margin: 5px;
}

.selector_line {
	width: 90px;
	margin: 18px auto;
}

.selector_line > label {
	font-size: 20px;
}
</style>
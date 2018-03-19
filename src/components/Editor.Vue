<template>
	<div id="editor" v-show="show">
		<div id="editor_content">
			<EditorContent v-model="data"
				@delete:self="delete_self()"
				@upgrade:self="upgrade_self()"
			/>
			<textarea v-model="data_string"></textarea>
			<center>
				<button class="return_button" @click="hide">完成编辑</button>
			</center>
		</div>
	</div>
</template>

<script>
import EditorContent from "./Editor/EditorContent.vue"

export default {
	name: 'editor',
	components: {
		EditorContent
	},
	data () {
		return {
			show:false,
			data:{
				op: "or",
				exps:[
					{key:"1", val:"1"},
					{key:"2", val:"2"},
					{key:"3", val:"3"},
					{key:"4", val:"4"},
					{
						op:"and",
						exps:[
							{key:"1", val:"1"},
							{key:"2", val:"2"},
							{key:"3", val:"3"},
							{key:"4", val:"4"},
						],
					}
				],
			},
		};
	},
	methods: {
		hide() {
			bus.$emit("query:finish", JSON.stringify(this.data, null, "  "));
			this.show = false;
		},
		delete_self() {
			this.data = {
				key:"",
				val:"",
			};
		},
		upgrade_self() {
			this.data = {
				op: "and",
				exps: [
					{
						key: this.data.key,
						val: this.data.val,
					}
				],
			};
		},
		check_data(obj) {
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
		}
	},
	created: function(){
		var _this = this;
		bus.$on("edit_json", function(query) {
			console.log(1);
			_this.show = true;
			try {
				let tempdata = JSON.parse(query);
				if(_this.check_data(tempdata)) {
					_this.data = tempdata;
				} else {
					alert("检索条件有结构错误，已被清空");
					_this.data = {
						key:"",
						val:"",
					};
				}
			} catch (err) {
				console.log(err);
				alert("检索条件有文法错误，已被清空");
				_this.data = {
					key:"",
					val:"",
				};
				return;
			}
		});
	},
	computed: {
		data_string: function() {
			return JSON.stringify(this.data, null, "  ");
		}
	}
}
</script>

<style scoped>
#editor {
	position: fixed;
	top:0;
	bottom:0;
	left:0;
	right:0;
	background-color: rgba(0,0,0,.1);
	z-index: 10001;
}
#editor_content {
	width: 800px;
	max-height: 800px;
	overflow-y: scroll;
	background-color: rgb(222,235,247);
	border: 1px solid rgb(65,113,156);
	margin: 50px auto;
}
.return_button{
}
</style>

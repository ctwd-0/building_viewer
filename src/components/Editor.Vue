<template>
	<div id="editor" v-show="show">
		<div id="editor_content" :style="{maxHeight: height + 'px'}" ref="content">
			<div class="left" ref="left">
				<label>编辑条件：</label>
				<EditorContent 
					v-model="data"
					@delete:self="delete_self()"
					@upgrade:self="upgrade_self()"
				/>
			</div>
			<div class="right" :style="{width:text_width + 5 + 'px'}">
				<label>预览：</label>
				<textarea 
					class="textarea" v-model="data_string" 
					:style="{height:text_height + 'px', width:text_width + 'px'}"
				></textarea>
			</div>
			<div style="clear:both"></div>
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
			show: false,
			text_change: false,
			height: 600,
			text_height: 27,
			text_width: 249,
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
		//计算编辑器高度
		calc_height() {
			this.height = window.innerHeight - 100;
		},

		//完成编辑，返回viewer
		hide() {
			bus.$emit("query:finish", JSON.stringify(this.data, null, "  "));
			this.show = false;
		},

		//删除所有编辑的条件
		delete_self() {
			this.data = {
				key:"",
				val:"",
			};
		},

		//将自身升级为复合条件
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

		//检查检索条件是否有语法错误
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
		}
	},

	mounted: function(){
		var _this = this;
		this.calc_height()

		//响应窗口尺寸改变
		bus.$on("editor_resize", function() {
			_this.calc_height()
		})

		//传入检索json，显示编辑器
		bus.$on("edit_json", function(query) {
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
		//将json结构转换为string
		data_string: function() {
			return JSON.stringify(this.data, null, "  ");
		}
	},

	updated: function() {
		//自适应左右两栏的高度，实质一致。
		if(this.$refs.content.clientHeight === 0) {
			return
		}
		if(!this.text_change) {
			let new_height = this.$refs.left.clientHeight - 41
			if(new_height < 27) {
				new_height = 27
			}
			if(new_height !== this.text_height) {
				this.text_height = new_height
				this.text_change = true
			}
		} else {
			this.text_change = false
		}

	},
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
	position: relative;
	width: 800px;
	overflow-y: auto;
	background-color: rgb(222,235,247);
	border: 1px solid rgb(65,113,156);
	margin: 50px auto;
}
.left {
	margin-top: 5px;
	margin-left: 5px;
	padding: 5px;
	float:left;
	border: 1px solid rgb(65,113,156);
	width: 490px;
}
.textarea{
	resize: none;
}
.right {
	float: left;
	margin-left: 5px;
	margin-top: 5px;
	padding: 5px;
	border: 1px solid rgb(65,113,156);
}
.return_button{
	margin-top: 5px;
	margin-bottom: 5px;
}
</style>

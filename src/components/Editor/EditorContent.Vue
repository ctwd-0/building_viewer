<template>
	<div class="editor_content">
		<div v-if="value.op === undefined" class="single_content">
			<button @click="upgrade_self">升变</button>
			<input type="text" class="input" placeholder="属性" v-model="value.key">
			<label>=</label>
			<input type="text" class="input" placeholder="值" v-model="value.val">
			<button @click="delete_self">删除</button>
		</div>
		<div v-else class="single_content">
			<button @click="change_op">{{value.op}}</button>
			<button @click="add_exp">添加</button>
			<button @click="delete_self">删除</button>
			<div v-for="(obj, index) in value.exps">
				<EditorContent 
					v-model="value.exps[index]"
					@delete:self="delete_child(index)"
					@upgrade:self="upgrade_child(index)"
				/>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'EditorContent',
	components: {
	},
	props:{
		value:Object,
	},
	data () {
		return {

		};
	},
	methods: {
		//自身升级为复合表达式
		upgrade_self() {
			this.$emit("upgrade:self")
		},

		//增加一条表达式
		add_exp() {
			if(this.value.exps !== undefined && this.value.exps.length !==undefined) {
				this.value.exps.push({
					key:"",
					val:"",
				});
			}
		},

		//切换表达式的逻辑运算符
		change_op() {
			if(this.value.op !== undefined) {
				if(this.value.op === "and") {
					this.value.op = "or"
				} else if(this.value.op === "or") {
					this.value.op ="and"
				}
			}
		},

		//通知上一级删除自己
		delete_self() {
			this.$emit("delete:self")
		},

		//删除某个孩子
		delete_child(index) {
			if(this.value.exps !== undefined) {
				this.value.exps.splice(index, 1)
			}
		},

		//将某个孩子变为复合表达式
		upgrade_child(index) {
			let obj = {
				op: "and",
				exps: [
					{key:this.value.exps[index].key, val: this.value.exps[index].val},
				],
			}
			this.value.exps.splice(index, 1, obj)
		}
	},
	mounted: function(){
	},
}
</script>

<style>
.single_content{
	/*margin: 2px;*/
	padding-left: 15px;
	padding-top: 2px;
	padding-bottom: 2px;
	padding-right: 2px;
	border: 1px solid #999;
	background-color: #ffe;
}
.input {
	width: 100px;
}
</style>

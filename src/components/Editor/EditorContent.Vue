<template>
	<div class="editor_content">
		<div v-if="value.op === undefined" class="single_content">
			<button @click="upgrade_self">升变</button>
			<input type="text" class="input" v-model="value.key">
			<input type="text" class="input" v-model="value.val">
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
		upgrade_self() {
			this.$emit("upgrade:self")
		},
		add_exp() {
			if(this.value.exps !== undefined && this.value.exps.length !==undefined) {
				this.value.exps.push({
					key:"",
					val:"",
				});
			}
		},
		change_op() {
			if(this.value.op !== undefined) {
				if(this.value.op === "and") {
					this.value.op = "or"
				} else if(this.value.op === "or") {
					this.value.op ="and"
				}
			}
		},
		delete_self() {
			this.$emit("delete:self")
		},
		delete_child(index) {
			if(this.value.exps !== undefined) {
				this.value.exps.splice(index, 1)
			}
		},
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
	margin: 3px;
	padding-left: 25px;
	padding-top: 3px;
	padding-bottom: 3px;
	border: 1px solid #999;
	background-color: #ffe;
}
.input {
	width: 100px;
}
</style>

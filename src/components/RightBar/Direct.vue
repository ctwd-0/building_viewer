<template>
	<div class="direct" :style="{width:width - 20 + 'px'}">
		<div class="direct_lable">编号入口：</div>
		<div class="direct_input_line">
			<input type="text" v-model="direct_id" :style="{width:width - 82 + 'px'}" >
			<button class="direct_button" @click="direct_click">进入</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'direct',
	components: {
	},
	props:{
		width: Number,
	},
	data () {
		return {
			direct_id: "",
		};
	},
	methods: {
		direct_click() {
			if(current_model !== 'g_-1') {
				alert('请返回顶层');
			} else if(this.direct_id === ''){
				alert('请输入正确的编号');
			} else {
				var name = this.direct_id;
				if(csv_rhino[name] !== undefined) {
					name = csv_rhino[name];
				}
				var object_id = lookup_object_id(name);
				if(object_id == -1) {
					alert('请输入正确的编号');
				} else if(object_id == -2){
					alert('该编号对应重复的构件，请检查');
				} else {
					triger_direct_to_object(object_id);
				}
			}
		},
	},
}
</script>

<style scoped>
.direct {
	position: relative;
	margin: 8px;
	background-color: rgb(222,235,247);
	border: 1px solid rgb(65,113,156);
}

.direct_lable {
	display: inline-block;
	margin: 5px;
	font-size: 18px;
	background-color: rgb(222,235,247);
}

.direct_input_line {
	margin: 5px;
}

.direct > div > input {
	height: 20px;
	vertical-align: middle;
}

.direct_button {
	height: 26px;
	vertical-align: middle;
}
</style>
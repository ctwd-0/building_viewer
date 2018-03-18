<template>
	<div id="right_bar">
		<Selector2/>
		<Direct/>
		<Photos/>
	</div>
</template>

<script>
import Selector2 from './RightBar/Selector2.vue'
import Photos from './RightBar/Photos.vue'
import Direct from './RightBar/Direct.vue'

export default {
	name: 'right_bar',
	components: {
		Selector2,
		Photos,
		Direct
	},
	data () {
		return {
			lable_direct:"编号入口（直接输入编号）",
			direct_button_text:"进入",
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

#right_bar {
	position: absolute;
	width: 22%;
	height: 97%;
	right: 10px;
	top: 10px;
	bottom: 10px;
	background-color: rgb(243,244,247);
}

.selected {
	background-color: rgb(222,235,247);
	width: 25px;
	height: 100px;
	font-size: 20px;
	line-height: 25px;
	text-align: center;
	border-right: 1px solid rgb(65,113,156);
	border-top: 1px solid rgb(65,113,156);
	border-bottom: 1px solid rgb(65,113,156);
	color: rgb(132,60,12);
}

.not_selected {
	background-color: rgb(189,215,238);
	width: 25px;
	height: 100px;
	font-size: 20px;
	line-height: 25px;
	text-align: center;
	border-left: 1px solid rgb(65,113,156);
}
</style>
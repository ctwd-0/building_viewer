<template>
	<div id="direct">
		<div class="direct_lable">{{lable_direct}}</div>
		<div class="direct_input_line">
			<input type="text" v-model="direct_id">
			<button id="direct_button" @click="direct_click">{{direct_button_text}}</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'direct',
	components: {
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
#direct {
	margin: 10px auto;
	width: 270px;
}

.direct_lable {
	margin: 5px;
	font-size: 20px;
	text-align: center;
	background-color: rgb(222,235,247);
}

.direct_input_line {
	margin: 8px auto;
	text-align: center;
}

#direct > div > input {
	height: 20px;
	width: 208px;
	vertical-align: middle;
}

#direct_button {
	height: 26px;
	vertical-align: middle;
}
</style>
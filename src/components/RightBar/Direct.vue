<template>
	<div class="direct" :style="{width:width - 20 + 'px'}">
		<div class="direct_lable">编号入口：</div>
		<div class="direct_input_line">
			<input type="text" v-model="table_id" :style="{width:width - 82 + 'px'}" >
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
			table_id: "",
		};
	},
	methods: {
		direct_click() {
			triger_mv_direct_to_object(this.table_id)
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
<template>
	<div id="selector2">
		<div id="selector_content">
			<textarea id="query_string" wrap="off"/>
			<SelectInput
				v-model="current_name"
				:options="options"
			/>
			<button>新建</button>
			<button @click="edit_click">编辑</button>
			<button>保存</button>
			<button>删除</button>
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
			query:{},
			query_string: "",
			current_name: "",
			options: ["条件1","条件2","条件3","条件4"],
		};
	},
	methods: {
		edit_click:function() {
			bus.$emit("edit_json", query_string);
		}
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
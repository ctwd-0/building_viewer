<template>
	<div id="selector">
		<div id="selector_tab_content">
			<div class="selector_line"
				v-for="(item,index) in sel_types"
				v-bind:item="item"
				v-bind:index="index"
				v-bind:key="item.key"
			>
				<input 
					type="checkbox" 
					v-bind:value="item.value" 
					v-model="checked_types"
					v-on:change="check_changed()"
				>
				<label>{{item.text}}</label>
			</div>
		</div>

		<div class="clear"></div>
	</div>
</template>

<script>
export default {
	name: 'selector',
	components: {
	},
	data () {
		return {
			sel : 0,
			sel_array:[{
				key:0,
				text:"保存状态",
				sel:true,
			},{
				key:1,
				text:"干预情况",
				sel:false,
			}],
			sel_types:[{
				key:0,
				text:"铁构件",
				value:"铁",
				checked:false,
			},{
				key:1,
				text:"石构件",
				value:"石",
				checked:false,
			},{
				key:2,
				text:"砖构件",
				value:"砖",
				checked:false,
			}],
			checked_types:[],
		};
	},
	methods: {

	},
}
</script>

<style scoped>
#selector {
	width: 260px;
	margin: auto;
	margin-top: 8px;
}

#selector_tab_header {
	float: left;
}

#selector_tab_content {
	float: left;
	width: 260px;
	height: 200px;
	background-color: rgb(222,235,247);
	border-bottom: 1px solid rgb(65,113,156);
	border-top: 1px solid rgb(65,113,156);
	border-left: 1px solid rgb(65,113,156);
	border-right: 1px solid rgb(65,113,156);
}
.selector_line {
	width: 90px;
	margin: 18px auto;
}

.selector_line > label {
	font-size: 20px;
}
</style>
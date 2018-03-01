<template>
	<div id="header_selector">
		<div
			id="header_selector_header"
		>
			<div
				class="table_selector_header"
				v-for="(name, index) in table_filter.names"
				v-on:click="on_table_selector_change(index)"
			>
				{{name}}
			</div>
		</div>
		<div
			id="header_selector_content"
		>
			<div
				class="table_selector_header"
				v-for="(name, index) in table_filter.all_headers[table_filter.current_index]"
			>
				<input
					type="checkbox"
					v-bind:disabled="name.disabled"
					v-bind:checked="name.checked"
					v-on:change="on_table_meta_change(index)"
				>
				<label>{{name.name}}</label>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'header_selector',
	components: {
	},
	data () {
		return {
			table_filter:{
				names:["默认","模式1"],
				current_index: 0,
				all_headers:[
					[
						{checked:true, name:"构件编号",disabled:true},
						{checked:true, name:"构件类别"},
						{checked:true, name:"构件类型"},
						{checked:true, name:"方位"},
						{checked:true, name:"所属部件"},
						{checked:true, name:"材质类别"},
						{checked:true, name:"材质类型"},
						{checked:true, name:"保存状态"},
						{checked:true, name:"病害类型"},
						{checked:true, name:"干预情况"},
						{checked:true, name:"备注"},
					],
					[
						{checked:true, name:"构件编号",disabled:true},
						{checked:false, name:"构件类别"},
						{checked:false, name:"构件类型"},
						{checked:false, name:"方位"},
						{checked:false, name:"所属部件"},
						{checked:false, name:"材质类别"},
						{checked:false, name:"材质类型"},
						{checked:false, name:"保存状态"},
						{checked:false, name:"病害类型"},
						{checked:false, name:"干预情况"},
						{checked:false, name:"备注"},
					],
				],
			},
		};
	},
}
</script>

<style scoped>
.table_selector_header{
	display: inline-block;
}

.table_selector_content{
	display: inline-block;
}
</style>
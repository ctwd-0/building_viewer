<template>
	<div id="header_selector">
		<div
			id="header_selector_header"
		>
			<div
				class="table_selector_header"
				v-for="(name, index) in names"
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
				v-for="(name, index) in headers"
			>
				<input
					type="checkbox"
					:disabled="name.disabled"
					:id="'checkbox'+index"
					:value="name.name"
					v-model="model"
				>
				<label>{{name.name}}</label>

			</div>
			<!--
			<span>names: {{ model }}</span>
			<span>current_index: {{ current_index }}</span>
			-->
		</div>
	</div>
</template>

<script>
export default {
	name: 'header_selector',
	components: {
	},
	methods: {
		on_table_selector_change(index) {
			let old_index = this.current_index;
			let new_index = index;
			this.models.splice(old_index, 1, this.model);
			this.model = this.models[new_index];
			this.current_index = index;
		},
		
		// on_table_meta_change(index) {
		// 	var i = this.current_index;
		// 	this.all_headers[i][index].checked = !this.all_headers[i][index].checked;
		// },
	},
	data () {
		return {
			names:["默认","模式1"],
			current_index: 0,
			model:["构件编号"],
			models:[["构件编号"],["构件编号"]],
			headers:[
					{name:"构件编号",disabled:true},
					{name:"构件类别"},
					{name:"构件类型"},
					{name:"方位"},
					{name:"所属部件"},
					{name:"材质类别"},
					{name:"材质类型"},
					{name:"保存状态"},
					{name:"病害类型"},
					{name:"干预情况"},
					{name:"备注"},
			],
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
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

		cut_data() {
			let header = [];
			let content_t = [];
			for(let i = 0; i < this.data_t.header.length; i++) {
				if ($.inArray(this.data_t.header[i], this.model) !== -1) {
					content_t.push(this.data_t.content[i]);
					header.push(this.data_t.header[i]);
				}
			}
			let content = [];
			if(content_t.length > 0) {
				for(let i = 0; i < content_t[0].length; i++) {
					content.push([]);
					for(let j = 0; j < content_t.length; j++) {
						content[i].push(content_t[j][i]);
					}
				}
			}
			bus.$emit("set_up_table_data", header, content);
		}
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
			data_t:{},
		};
	},

	created: function() {
		var _this = this;
		bus.$on("selector_arrive", function(data) {

		});

		bus.$on("new_table_content_arrive", function(data){
			let content = [];
			for(let i = 0; i < data.header.length; i++) {
				content.push([]);
				for(let j = 0 ; j < data.content.length; j++) {
					content[i].push(data.content[j][i]);
				}
			}
			_this.data_t = {
				header:data.header,
				content:content,
			};
			_this.cut_data();
		});

	},
	watch: {
		model(val) {
			this.cut_data();
		}
	}
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
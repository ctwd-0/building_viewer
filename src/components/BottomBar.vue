<template>
	<div id="bottom_bar">
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
		<div 
			id="table_header"
			v-bind:style="{width : tb.sum_tb_wdh + 'px'}"
		>
			<div 
				class="table_header"
				v-bind:style="{width : tb.wdh[index] + 'px'}"
				v-for="(hd, index) in tb.hds"
			>
				<label
					class="table_header_label"
					v-bind:style="{width : tb.wdh[index] - 23 + 'px'}"
				>
					{{hd}}
				</label>
				<button
					class="table_header_button"
					v-on:click="on_table_header_button(index)"
				>
				</button>
			</div>
		</div>
		<div
			id="table_menu"
			v-show="mn.show"
			v-bind:style="{left: mn.left + 'px'}"
		>
			<div
				class="table_menu_button"
				v-for="(text, index) in mn.btns"
				v-on:click="on_table_menu_button(index)"
			>
				{{text}}
			</div>
		</div>
		<div id="table_content">
			<div 
				class="table_line"
				v-bind:style="{width : tb.sum_tb_wdh + 'px'}"
				v-for="(line, line_no) in tb.cts"
			>
				<label 
					class="table_blcok" 
					v-bind:style="{width : tb.wdh[index] + 'px'}"
					v-for="(field, index) in line"
				>
					{{field}}
				</label>
			</div>
		</div>
		<div id="table_comment">
		</div>
	</div>
</template>

<script>
export default {
	name: 'bottom_bar',
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

			tb:{
				wdh:[120,100,100,100,120,100,170,100],
				sum_tb_wdh: 940,
				hds:["编号","构件类别","材质","保存状况","病害类型","材质类别","轴网位置/原图编号","干预情况"],
				cts:[
					["TFK-02-12-01","柱","铸钢","一般","表面锈蚀","钢","D3D4之间","未干预"],
					["TFK-02-12-02","梁","铸钢","病害轻微","断裂","钢","D3D4之间","加固/修补"],
					["TFK-02-12-03","板","轧钢","病害轻微","表面锈蚀、断裂","钢","D4E4之间","除锈"],
					["TFK-01-12-01","梁","铸钢","病害严重","变形、位移","钢","B3B4之间","更换"],
					["DCC-04-12-01","梁","铸钢","病害严重","变形、位移","钢","C3C4之间","更换"],
					["DCC-02-12-01","板","轧钢","病害严重","缺失","钢","C3C4之间","新加"],
				],
				// wdh:[],
				// hds:[],
				// cts:[],
				// sum_tb_wdh: 0,
				// hds:0,
				// cts:0,
			},
			mn: {
				show:false,
				left:0,
				index:0,
				btns:["递增排序", "递减排序", "过滤此列"],
			},
		};
	},
	methods: {

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

#bottom_bar {
	position: absolute;
	width: 75%;
	height: 20%;
	border: 1px solid rgb(65,113,156);
	left: 10px;
	bottom: 10px;
	overflow-y: auto;
	overflow-x: auto;
	padding-top: 2px;
	padding-left: 5px;
}

#table_menu {
	position: absolute;
	background-color: white;
	display: inline-block;
	top: 21px;
	width: 80px;
	box-shadow:2px 2px 3px #aaaaaa
}

.table_menu_button {
	background-color: rgb(222,235,247);
	font-size: 16px;
	top: 21px;
	margin: 3px;
	text-align: center;
}

.table_header {
	background-color: rgb(222,235,247);
	display: inline-block;
	height: 20px;
	margin: 1px;
}
.table_header_label {
	background-color: rgb(222,235,247);
	display: inline-block;
	height: 20px;
}
.table_header_button {
	display: inline-block;
	width: 17px;
	height: 17px;
	background:url(../assets/drop_down.png);
	border:0;
}
.table_blcok {
	background-color: rgb(222,235,247);
	display: inline-block;
	height: 20px;
	margin: 1px;
}
</style>
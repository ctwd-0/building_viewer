<template>
	<div id="outer_div">
		<div id="webgl"></div>
		<div id="bottom_bar">
			<div 
				id="table_header"
				v-bind:style="{width : sum_tb_wdh + 'px'}"
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
					v-bind:style="{width : sum_tb_wdh + 'px'}"
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
		<div id="right_bar">
			<div id="selector">
				<div id="selector_tab_content">
					<div class="selector_line"
						v-for="(item,index) in sel_types"
						v-bind:item="item"
						v-bind:index="index"
						v-bind:key="item.key"
					>
						<label>{{item.text}}</label>
						<input type="checkbox" v-bind:value="item.text" v-model="checked_types">
					</div>
				</div>
				<div id="selector_tab_header">
					<ul>
						<li
							v-for="(item, index) in sel_array"
							v-bind:item="item"
							v-bind:index="index"
							v-bind:key="item.key"
							v-bind:class="{selected:item.sel, not_selected:!item.sel}"
							v-on:click="change_sel(index)"
						>
							{{item.text}}
						</li>
					</ul>
				</div>
				<div class="clear"></div>
			</div>
			<div id="direct">
				<div class="direct_lable">{{lable_direct}}</div>
				<div class="direct_input_line">
					<input type="text" v-model="direct_id">
					<button id="direct_button" @click="direct_click">{{direct_button_text}}</button>
				</div>
			</div>
			<div id="photos">
				<div id="photo_tab_header">
					<ul>
						<li
							v-for="(item, index) in photo_tag_array"
							v-bind:item="item"
							v-bind:index="index"
							v-bind:key="item.key"
							v-bind:class="{photo_selected:item.sel, photo_not_selected:!item.sel}"
							v-on:click="change_photo_sel(index)"
						>{{item.text}}</li>
					</ul>
				</div>
				<div id="photo_tab_content">
					<div id="photo_content">
						<img
							class="single_photo"
							v-for="(item, index) in photo_array"
							v-bind:item="item"
							v-bind:index="index"
							v-bind:key="item.key"
							v-on:click="click_photo(index)"
							v-bind:src="item.src">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'viewer',
	data () {
		return {
			mn: {
				show:false,
				left:0,
				index:0,
				btns:["递增排序", "递减排序", "过滤此列"],
			},
			tb:{
				wdh:[100,100,100,100,120,100,170,100],
				hds:["编号","构件类别","材质","保存状况","病害类型","材质类别","轴网位置/原图编号","干预情况"],
				cts:[
					["TZ01-Z01","柱","铸钢","一般","表面锈蚀","钢","D3D4之间","未干预"],
					["TZ01-L01","梁","铸钢","病害轻微","断裂","钢","D3D4之间","加固/修补"],
					["TZ02-B03","板","轧钢","病害轻微","表面锈蚀、断裂","钢","D4E4之间","除锈"],
					["LJ01-L04","梁","铸钢","病害严重","变形、位移","钢","B3B4之间","更换"],
					["LJ01-L05","梁","铸钢","病害严重","变形、位移","钢","C3C4之间","更换"],
					["LJ01-B03","板","轧钢","病害严重","缺失","钢","C3C4之间","新加"],
				],
			},
			sel : 0,
			sel_array:[{
				key:0,
				text:"保存状况",
				sel:true,
			},{
				key:1,
				text:"干预情况",
				sel:false,
			// },{
			// 	key:2,
			// 	text:"高级选择",
			// 	sel:false,
			}],
			sel_types:[{
				key:0,
				text:"铁构件",
				checked:false,
			},{
				key:1,
				text:"石构件",
				checked:false,
			},{
				key:2,
				text:"钢构件",
				checked:false,
			},{
				key:3,
				text:"锌构件",
				checked:false,
			}],
			checked_types:[],
			lable_direct:"编号入口（直接输入编号）",
			direct_button_text:"进入",
			direct_id: "",
			photo_sel: 0,
			photo_tag_array:[{
				key:0,
				text:"照片",
				sel:true,
			},{
				key:1,
				text:"线图",
				sel:false,
			},{
				key:2,
				text:"点云切片",
				sel:false,
			}],
			photo_array:[{
				key:0,
				src:"/dist/sample.jpg",
			},{
				key:1,
				src:"/dist/sample.jpg",
			},{
				key:2,
				src:"/dist/sample.jpg",
			}],
		};
	},
	methods: {
		change_sel(index) {
			this.sel = index;
			for(var item in this.sel_array) {
				this.sel_array[item].sel = false;
			}
			this.sel_array[index].sel = true;
		},
		change_photo_sel(index) {
			this.photo_sel = index;
			for(var item in this.photo_tag_array) {
				this.photo_tag_array[item].sel = false;
			}
			this.photo_tag_array[index].sel = true;
		},
		click_photo(index) {

		},
		direct_click() {
			alert(this.direct_id);
		},

		on_table_header_button(index) {
			if(this.mn.show === true && this.mn.index === index ) {
				this.mn.show = false;
			} else {
				this.mn.show = true;
				this.mn.index = index;
				this.mn.left = 5;
				for(var i = 0; i <= this.mn.index; i++) {
					this.mn.left += this.tb.wdh[i] + 2;
				}
				this.mn.left -= 2;
				this.mn.left -= 80;
			}
		},

		on_table_menu_button(index) {
			this.mn.show = false;
			if(index === 0) {
				//"递增排序"
				this.tb.cts.sort(this.sort_asc_index);
			} else if(index === 1) {
				//"递减排序"
				this.tb.cts.sort(this.sort_desc_index);
			} else if(index === 2) {
				//"过滤此列"
			}
		},

		sort_asc_index(a, b) {
			var x = a[this.mn.index];
			var y = b[this.mn.index];
			if(x === y) {
				return 0;
			} else if(x > y) {
				return 1;
			} else {
				return -1;
			}
		},

		sort_desc_index(a, b) {
			var x = a[this.mn.index];
			var y = b[this.mn.index];
			if(x === y) {
				return 0;
			} else if(x < y) {
				return 1;
			} else {
				return -1;
			}
		},
	},

	computed: {
		sum_tb_wdh: function() {
			var sum = 0;
			for(var i in this.tb.wdh) {
				sum += this.tb.wdh[i];
			}
			sum += this.tb.wdh * 2;
		},
	},
}

</script>

<style scoped>
#outer_div {
	margin-left: auto;
	margin-right: auto;
	border-width: 3px;
	width: 1280px;
	height: 720px;
	border-style: solid;
	border-color: #41719c;
	position: relative;
}

#webgl {
	position: absolute;
	margin-top: 10px;
	margin-left: 10px;
	margin-right: 10px;
	margin-bottom: 10px;
	width: 75%;
	height: 75%;
	border: 1px solid black;
}

#bottom_bar {
	position: absolute;
	width: 75%;
	height: 20%;
	border: 1px solid blue;
	left: 10px;
	bottom: 10px;
	overflow-y: scroll;
	overflow-x: scroll;
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
	background:url(./assets/drop_down.png);
	border:0;
}
.table_blcok {
	background-color: rgb(222,235,247);
	display: inline-block;
	height: 20px;
	margin: 1px;
}

#right_bar {
	position: absolute;
	width: 22%;
	height: 97%;
	right: 10px;
	top: 10px;
	bottom: 10px;
	background-color: rgb(243,244,247);
}

#selector {
	width: 270px;
	margin: auto;
	margin-top: 8px;
}

#selector_tab_header {
	float: left;
}

#selector_tab_content {
	float: left;
	width: 240px;
	height: 200px;
	background-color: rgb(222,235,247);
	border-bottom: 1px solid rgb(65,113,156);
	border-top: 1px solid rgb(65,113,156);
	border-left: 1px solid rgb(65,113,156);
}

ul {
	list-style: none;
	padding: 0;
	margin: 0;
}

.selector_line {
	width: 90px;
	margin: 18px auto;
}

.selector_line > label {
	font-size: 20px;
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

#photos {

}

#photo_tab_header {
	width: 266px;
	height: 26px;
	margin: auto;
}

#photo_tab_content {
	margin: auto;
	width: 264px;
	height: 376px;
	background-color: rgb(222,235,247);
	border-right: 1px solid rgb(65,113,156);
	border-bottom: 1px solid rgb(65,113,156);
	border-left: 1px solid rgb(65,113,156);
	overflow-y: scroll;
}

#photo_content {

}

.single_photo {
	width: 236px;
	height: 178px;
	margin: 5px;
}

.photo_selected {
	float: left;
	background-color: rgb(222,235,247);
	font-size: 20px;
	width: 88px;
	line-height: 25px;
	text-align: center;
	border-right: 1px solid rgb(65,113,156);
	border-top: 1px solid rgb(65,113,156);
	border-left: 1px solid rgb(65,113,156);
	color: rgb(132,60,12);
}

.photo_not_selected {
	float: left;
	background-color: rgb(189,215,238);
	width: 88px;
	font-size: 20px;
	line-height: 25px;
	text-align: center;
	border-bottom: 1px solid rgb(65,113,156);
}

.clear {
	clear: both;
}

</style>
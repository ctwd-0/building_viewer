<template>
	<div id="outer_div">
		<div id="webgl"></div>
		<div id="bottom_bar">
			<div id="table_title">
				
			</div>
			<div id="table_content">
				
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
						>{{item.text}}</li>
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
		}
	},
	computed: {
	}
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
<template>
	<div id="right_bar">
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
</template>

<script>
export default {
	name: 'right_bar',
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
			// },{
			// 	key:3,
			// 	text:"锌构件",
			// 	checked:false,
			}],
			checked_types:[],
			lable_direct:"编号入口（直接输入编号）",
			direct_button_text:"进入",
			direct_id: "",
			photo_sel: 0,
			photo_tag_array:[{
				key:0,
				text:"图纸",
				sel:true,
			},{
				key:1,
				text:"照片",
				sel:false,
			},{
				key:2,
				text:"正射影像",
				sel:false,
			}],
			photo_array:[{
				key:0,
				src:"dist/images/g_-1/drawings/1.thumbnail.jpg",
			},{
				key:1,
				src:"dist/images/g_-1/drawings/2.thumbnail.jpg",
			}],
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
</style>
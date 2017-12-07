<template>
	<div>
		<div id="outer_div">
			<div id="webgl_wrapper">
				<div id="webgl">
				</div>
				<div 
					id="filter_example"
					v-bind:style="{'width': fe.width + 'px'}"
					v-show="fe.show"
				>
					<div
						id="filter_example_son"
						v-bind:style="{'width': (fe.width + 18) + 'px'}"
					>
						<div 
							class="filter_example_line"
							v-for="(example, index) in fe.cts"
						>
							<label
								class="filter_example_block"
								v-bind:style="{'background-color': example.color}"
							>
							</label>
							<label class="filter_example_name">
								{{example.text}}
							</label>

						</div>
						<div
							id="filter_example_cancel"
							v-on:click="on_cancel_filter()"	
						>
							取消过滤
						</div>
					</div>
				</div>
			</div>
			<div id="bottom_bar">
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
							<input 
								type="checkbox" 
								v-bind:value="item.value" 
								v-model="checked_types"
								v-on:change="check_changed()"
							>
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
		</div>
		<div 
			id="large_image_container"
			v-show="li.show"
		>
			<div 
				id="large_image_scroll"
				v-on:click="on_image_click()"
			>
				<img 
					class="large_image"
					v-bind:src="li.src"
					v-on:click="on_image_click()"
				>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'viewer',
	data () {
		return {
			model_id: 'g_-1',
			header:[],
			content:[],
			li: {
				show:false,
				src:"/dist/images/g_-1/drawings/1.thumbnail.jpg",
			},
			fe: {
				show:false,
				cts:[],
			},
			mn: {
				show:false,
				left:0,
				index:0,
				btns:["递增排序", "递减排序", "过滤此列"],
			},
			tb:{
				// wdh:[120,100,100,100,120,100,170,100],
				// sum_tb_wdh: 940,
				// hds:["编号","构件类别","材质","保存状况","病害类型","材质类别","轴网位置/原图编号","干预情况"],
				// cts:[
				// 	["TFK-02-12-01","柱","铸钢","一般","表面锈蚀","钢","D3D4之间","未干预"],
				// 	["TFK-02-12-02","梁","铸钢","病害轻微","断裂","钢","D3D4之间","加固/修补"],
				// 	["TFK-02-12-03","板","轧钢","病害轻微","表面锈蚀、断裂","钢","D4E4之间","除锈"],
				// 	["TFK-01-12-01","梁","铸钢","病害严重","变形、位移","钢","B3B4之间","更换"],
				// 	["DCC-04-12-01","梁","铸钢","病害严重","变形、位移","钢","C3C4之间","更换"],
				// 	["DCC-02-12-01","板","轧钢","病害严重","缺失","钢","C3C4之间","新加"],
				// ],
				wdh:[],
				sum_tb_wdh: 0,
				hds:0,
				cts:0,
			},
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
				src:"/dist/images/g_-1/drawings/1.thumbnail.jpg",
			},{
				key:1,
				src:"/dist/images/g_-1/drawings/1.thumbnail.jpg",
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
			var idx = -1;
			for(var i= 0; i < this.tb.hds.length; i++) {
				if(this.tb.hds[i] === this.sel_array[index].text) {
					idx = i;
					break;
				}
			}
			if(idx !== -1) {
				this.filter_by(idx);
			}
		},

		change_photo_sel(index) {
			this.photo_sel = index;
			for(var item in this.photo_tag_array) {
				this.photo_tag_array[item].sel = false;
			}
			this.photo_tag_array[index].sel = true;

			var pparent = this;
			$.ajax({
				type: 'POST',
				url: "http://localhost:8000/polls/getImage",
				data: {
					username: "admin",
					password: "gugong",
					"model_id": this.model_id,
					"cat_index": index,
				},
				crossDomain: true,
				success: function( result ) {
					var content_array = []
					for (var i in result['content']) {
						content_array.push({
							key:i,
							src:result['content'][i],
						});
					}
					pparent.photo_array = content_array;
				},
			});
		},

		change_photo(model_id) {
			if(model_id !== 'g_-1' && model_id !== 'g_7' && model_id !== 'o') {
				return;
			}

			if(model_id == this.model_id) {
				return;
			} else {
				this.model_id = model_id;
				var pparent = this;
				$.ajax({
					type: 'POST',
					url: "http://localhost:8000/polls/getImage",
					data: {
						username: "admin",
						password: "gugong",
						"model_id": this.model_id,
						"cat_index": this.photo_sel,
					},
					crossDomain: true,
					success: function( result ) {
						var content_array = []
						for (var i in result['content']) {
							content_array.push({
								key:i,
								src:result['content'][i],
							});
						}
						pparent.photo_array = content_array;
					},
				});
			}
		},

		click_photo(index) {
			this.li.show = true;
			this.li.src = this.photo_array[index].src;
		},
		
		on_image_click() {
			this.li.show = false;
		},

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
				this.filter_by(this.mn.index);
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

		filter_by(index) {
			this.fe.show = false;
			if(current_model !== 'g_-1') {
				alert('暂时只支持在顶层过滤');
				return ;
			}
			var name_index = -1;
			for(var i = 0; i < this.tb.hds.length; i++) {
				if(this.tb.hds[i] === '构件编号') {
					name_index = i;
					break;
				}
			}
			if(name_index === -1) {
				alert('找不到编号列，请检查');
			// } else if(name_index === index) {
			// 	alert('请不要按编号过滤');
			} else{
				var data = {};
				var color_index = 0;
				this.fe.cts.splice(0,this.fe.cts.length);
				for(var i = 0; i < this.tb.cts.length; i++) {
					var type = this.tb.cts[i][index];
					if(data[type] === undefined) {
						data[type] = {};
						data[type].names = [];
						if(color_index < _colors.length) {
							data[type].color = _colors[color_index];
							color_index ++;
						} else {
							data[type].color = random_color();
						}
					}
					data[type].names.push(this.tb.cts[i][name_index]);
				}
				var max_len = 0;
				for(var type in data) {
					var text = type + ': ' + data[type].names.length + "个";
					if(text.length > max_len) {
						max_len = text.length;
					}
					this.fe.cts.push({
						name:type,
						count:data[type].names.length,
						text: text,
						color:color_toc_ss_string(data[type].color ),
					});
				}
				this.fe.width = max_len * 18 + 10;
				triger_filter_objects(data);
				this.fe.show = true;
			}
		},

		on_cancel_filter() {
			this.fe.show = false;
			triger_clear_filter_data();
		},

		check_changed() {
			//alert(this.checked_types);	
			this.filter_and_setup_tb_data(this.header, this.content, '材质类别', this.checked_types);
			if(this.fe.show === true) {
				this.on_cancel_filter();
			}
		},
		
		filter_and_setup_tb_data(header, content, key, values) {
			if(values === undefined 
				|| values === null
				|| values.length === 0) {
				this.set_up_tb_data(header, content);
			} else {
				var index = -1;
				for(var i = 0; i < header.length; i++) {
					if(header[i] === key) {
						index = i;
						break;
					}
				}
				if(index === -1) {
					this.set_up_tb_data(header, content);
				} else {
					var filtered_content = [];
					var dict = {};
					for(var i in values) {
						dict[values[i]] = true;
					}
					for(var i in content) {
						if(dict[content[i][index]] === true) {
							filtered_content.push(content[i]);
						}
					}
					this.set_up_tb_data(header, filtered_content);
				}
			}
		},

		cut_data(header, content) {
			for(var i in content) {
				content[i].splice(0,1);
			}
			header.splice(0,1);
			header[0] = '构件编号';

			for(var i in header) {
				if(header[i] === '') {
					header[i] = '-';
				}
			}
			for(var i in content) {
				for(var j in content[i]) {
					if(content[i][j] === '') {
						content[i][j] = '-';
					}
				}
			}
		},

		set_up_tb_data(header, content) {
			var width = [];
			for(var i = 0; i < header.length; i++) {
				width.push(0);
			}

			for(var i = 0; i < header.length; i++) {
				if(header[i].length + 2 > width[i]) {
					width[i] = header[i].length + 2;
				}
				for(var j in content) {
					if(content[j][i].length > width[i]) {
						width[i] = content[j][i].length;
					}
				}
			}

			for(var i in width) {
				width[i] *= 18;
			}
			width[0] /=18;
			width[0] *= 10;

			this.tb.cts = content;
			this.tb.hds = header;
			this.tb.wdh = width;

			var sum = 0;
			for(var i in this.tb.wdh) {
				sum += this.tb.wdh[i];
			}
			sum += this.tb.wdh.length * 3;
			this.tb.sum_tb_wdh = sum;
		},
	},

	computed: {

	},
	
	mounted() {
		_viewer = this;

		var pparent = this;

		$.ajax({
			type: 'POST',
			url: "http://localhost:8000/polls/init",
			data: {
				username: "admin",
				password: "gugong",
			},
			crossDomain: true,
			success: function( result ) {
				pparent.header = result['header'];
				pparent.content = result['content'];
				pparent.cut_data(result['header'], result['content']);
				pparent.set_up_tb_data(result['header'], result['content']);
				// for (var i in result['content']) {
				// 	result['content'][i].splice(0, 1);
				// }
				// result['header'].splice(0,1);
				// result['header'][0] = '编号'

				// pparent.tb['hds'] = result['header'];
				// pparent.tb['cts'] = result['content'];
			},
		});

		$.ajax({
			type: 'POST',
			url: "http://localhost:8000/polls/getImage",
			data: {
				username: "admin",
				password: "gugong",
				"model_id": this.model_id,
			},
			crossDomain: true,
			success: function( result ) {

				//var header_array = []
				var content_array = []
				// for (var i in result['header']) {
				// 	header_array.push({
				// 		key:i,
				// 		text:result['header'][i],
				// 		sel:i == 0,
				// 	});
				// }

				for (var i in result['content']) {
					content_array.push({
						key:i,
						src:result['content'][i],
					});
				}
				//pparent.photo_tag_array = header_array;
				pparent.photo_array = content_array;
			},
		});
	}
}

</script>

<style scoped>

#large_image_container {
	position: fixed;
	top:0;
	bottom:0;
	left:0;
	right:0;
	background-color: rgba(0,0,0,.1);
	z-index: 10001;
}

#large_image_scroll {
	overflow: auto;
	height: 100%;
	text-align: center;
}
.large_image {
	width: 1024px;
}
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

#webgl_wrapper{
	position: absolute;
	margin-top: 10px;
	margin-left: 10px;
	margin-right: 10px;
	margin-bottom: 10px;
	width: 75%;
	height: 75%;
	border: 1px solid black;
}
#webgl {
	background-color: black;
}
#filter_example {
	position: absolute;
	left: 0;
	bottom: 0;
	background-color: transparent; 
	padding-left: 15px;
	padding-bottom: 15px;
	overflow-y: auto;
	overflow-x: hidden;
}

#filter_example_son {
	max-height: 450px;
	overflow-x: hidden;
}

.filter_example_line {

}
.filter_example_name {
	color: white;
	font-size: 18px;
}

.filter_example_block {
	display: inline-block;
	width: 18px;
	height: 18px;
	border: 1px solid white;
}

#filter_example_cancel {
	color: white;
	margin-left: 24px;
	font-size: 18px;
	text-align: left;
}
#webgl {
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;

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

.clear {
	clear: both;
}

</style>
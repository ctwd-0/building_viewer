<template>
	<div>
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
	</div>
</template>

<script>
export default {
	name: 'table_header',
	components: {
	},
	data () {
		return {
			index : 0,
			tb : {
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
				hds:[],
				cts:[],
				sum_tb_wdh: 0,
			},
		};
	},
	methods: {
		sort_asc_index(a, b) {
			var x = a[this.index];
			var y = b[this.index];
			if(x === y) {
				return 0;
			} else if(x > y) {
				return 1;
			} else {
				return -1;
			}
		},

		sort_desc_index(a, b) {
			var x = a[this.index];
			var y = b[this.index];
			if(x === y) {
				return 0;
			} else if(x < y) {
				return 1;
			} else {
				return -1;
			}
		},

		on_table_header_button(index) {
			var left = 5;
			for(var i = 0; i <= index; i++) {
				left += this.tb.wdh[i] + 2;
			}
			left -= 2;
			left -= 80;
			bus.$emit("open_menu", left,index);
		},
		filter_and_setup_tb_data(header, content, key, values) {
			if(values === undefined 
				|| values === null
				|| values.length === 0) {
				bus.$emit("set_up_tb_data", header, content);
				//this.set_up_tb_data(header, content);
			} else {
				var index = -1;
				for(var i = 0; i < header.length; i++) {
					if(header[i] === key) {
						index = i;
						break;
					}
				}
				if(index === -1) {
					bus.$emit("set_up_tb_data", header, content);
					//this.set_up_tb_data(header, content);
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
					bus.$emit("set_up_tb_data", header, filtered_content);
					//this.set_up_tb_data(header, filtered_content);
				}
			}
		},
	},
	created: function() {
		var _this = this;
		bus.$on("set_up_tb_data", function(header, content){
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
			var sum = 0;
			for(var i in width) {
				sum += width[i];
			}
			sum += width.length * 3;
			//this.tb.cts = content;
			_this.tb.hds = header;
			_this.tb.wdh = width;
			_this.tb.cts = content;
			_this.tb.sum_tb_wdh = sum;
		});

		bus.$on("check_changed", function(checked_types) {
			_this.filter_and_setup_tb_data(cache_header, cache_content, "材质类别",checked_types);
		});

		bus.$on("sort_table_asc", function(index) {
			_this.index = index;
			_this.tb.cts.sort(_this.sort_asc_index);
		});

		bus.$on("sort_table_desc", function(index) {
			_this.index = index;
			_this.tb.cts.sort(_this.sort_desc_index);
		});

		bus.$on("filter_by", function(index) {
			if(current_model !== 'g_-1') {
				alert('暂时只支持在顶层过滤');
				return ;
			}
			var name_index = -1;
			for(var i = 0; i < _this.tb.hds.length; i++) {
				if(_this.tb.hds[i] === '构件编号') {
					name_index = i;
					break;
				}
			}
			if(name_index === -1) {
				alert('找不到编号列，请检查');

			} else {
				var data = {};
				var color_index = 0;
				for(var i = 0; i < _this.tb.cts.length; i++) {
					var type = _this.tb.cts[i][index];
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
					data[type].names.push(_this.tb.cts[i][name_index]);
				}
				var max_len = 0;
				var contents = [];
				for(var type in data) {
					var text = type + ': ' + data[type].names.length + "个";
					if(text.length > max_len) {
						max_len = text.length;
					}
					contents.push({
						name:type,
						count:data[type].names.length,
						text: text,
						color:color_toc_ss_string(data[type].color ),
					});
				}
				triger_filter_objects(data);
				var width = max_len * 18 + 10;
				bus.$emit("show_filter_example", width, contents);
			}
		});
	},
}
</script>

<style scoped>
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
	background:url(../../assets/drop_down.png);
	border:0;
}
.table_blcok {
	background-color: rgb(222,235,247);
	display: inline-block;
	height: 20px;
	margin: 1px;
}
</style>
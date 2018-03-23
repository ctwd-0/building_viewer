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
	},

	mounted: function() {
		var _this = this;
		bus.$on("set_up_table_data", function(header, content){
			var width = [];

			for(var i = 0; i < header.length; i++) {
				width.push( header[i].length + 3);
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
						color:color_to_css_string(data[type].color ),
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
.table_line {
}
.table_blcok {
	background-color: rgb(222,235,247);
	display: inline-block;
	vertical-align: middle;
	height: 20px;
	margin: 1px;
}
</style>
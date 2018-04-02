<template>
	<div>
		<div 
			id="table_header"
			v-bind:style="{width : tb.sum_tb_wdh + 80 + 'px'}"
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
				<label
					class="table_header_label"
					v-bind:style="{width : '50px'}"
					v-on:click="add_column"
				>增加列</label>
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
			all_headers: [],
			tb : {
				wdh:[],
				hds:[],
				cts:[],
				sum_tb_wdh: 0,
			},
		};
	},

	methods: {
		add_column() {
			let new_column = prompt("请输入新列的名称", "")
			if(new_column === null) {
				return
			}
			new_column = new_column.trim()
			if (new_column === "") {
				alert("新列不能为空")
				return
			}
			for (let key in this.all_headers) {
				if (this.all_headers[key] === new_column) {
					alert("已存在该列名")
					return
				}
			}
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/table/add_column",
				data :{
					column:new_column,
				},
				crossDomain: true,
				success: function( result ) {
					if(result["success"]) {
						bus.$emit("new_column_added", new_column)
					}
				},
			});
		},

		rename_column(index) {
			let new_column = prompt("请输入新的列名", "")
			if(new_column === null) {
				return
			}
			new_column = new_column.trim()
			if (new_column === "") {
				alert("新列名不能为空")
				return
			}
			if (new_column === this.tb.hds[index]) {
				alert("新列名与旧列名相同")
				return
			}
			for (let key in this.all_headers) {
				if (this.all_headers[key] === new_column) {
					alert("已存在该列名")
					return
				}
			}
			let _this = this;
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/table/rename_column",
				data :{
					old: this.tb.hds[index],
					new: new_column,
				},
				crossDomain: true,
				success: function( result ) {
					if(result["success"]) {
						bus.$emit("column_renamed", _this.tb.hds[index], new_column);
					}
				},
			});
		},

		remove_column(index) {
			if (this.tb.hds[index] === "构件编号") {
				alert("不能删除构件编号列")
				return
			}
			let del = confirm("确认要删除这列“"+ this.tb.hds[index]+ "”么？删除的列将不能恢复");
			if (!del) {
				return
			}
			let _this= this;
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/table/remove_column",
				data :{
					column: this.tb.hds[index],
				},
				crossDomain: true,
				success: function( result ) {
					if(result["success"]) {
						bus.$emit("column_deleted", _this.tb.hds[index]);
					}
				},
			});
		},

		change_value(row, column) {

		},
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

		filter_by(index) {
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
				return;
			}
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
		},
		
		set_up_table_data(header, content, all_headers){
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
			if(content !== undefined && content.length > 0) {
				width[0] /=18;
				width[0] *= 10;
			}
			var sum = 0;
			for(var i in width) {
				sum += width[i];
			}
			sum += width.length * 3;
			this.tb.hds = header;
			this.tb.wdh = width;
			this.tb.cts = content;
			this.tb.sum_tb_wdh = sum;
			this.all_headers = all_headers;
		}
	},

	mounted: function() {
		var _this = this;
		bus.$on("set_up_table_data", function(header, content, all_headers) {
			_this.set_up_table_data(header, content, all_headers)
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
			_this.filter_by(index);
		});

		bus.$on("rename_column", function(index) {
			_this.rename_column(index);
		});

		bus.$on("remove_column", function(index) {
			_this.remove_column(index);
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
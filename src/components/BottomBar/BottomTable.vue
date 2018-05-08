<template>
	<div class="bottom_table" :style="{height: innerHeigh - 20 + 'px', width: width - 20 + 'px'}">
		<div class="table_header_and_add" v-bind:style="{width : sum_table_width + 20 + 'px'}">
			<div 
				class="table_header"
				v-bind:style="{width : widths[index] + 'px'}"
				v-for="(header, index) in headers"
			>
				<label class="table_header_label" v-bind:style="{width : widths[index] - 23 + 'px'}">
					{{header}}
				</label>
				<button
					class="table_header_button"
					@click.stop="on_table_header_button(index)"
				>
				</button>
			</div>
			<label class="table_header_label" :style="{width : '20px'}" v-on:click="add_column">+</label>
		</div>
		<div class="table_content">
			<div 
				class="table_line"
				v-bind:style="{width : sum_table_width + 'px'}"
				v-for="(line, line_no) in contents"
			>
				<label 
					class="table_blcok" 
					v-bind:style="{width : widths[index] + 'px'}"
					v-for="(field, index) in line"
					v-on:dblclick.prevent="modify_value(line_no, index)"
				>
					{{field}}
				</label>
			</div>
		</div>
		<TableMenu/>
	</div>
</template>

<script>
import TableMenu from './TableMenu.vue'
export default {
	name: 'bottom_table',
	components: {
		TableMenu
	},
	data () {
		return {
			innerHeigh: 200,
			index: 0,
			all_headers: [],
			ids: [],
			widths: [],
			headers: [],
			contents: [],
			sum_table_width: 0,
			table_filter: null,
			original_content: [],
		};
	},

	props: {
		width: Number,
		height: Number,
		topHeight: Number,
		bottomHeight: Number,
	},

	watch: {
		height(val) {
			this.innerHeigh = this.height - this.bottomHeight - this.topHeight
		}
	},
	
	methods: {
		modify_value(line_no, index) {
			let column_name = this.headers[index]
			let id = this.ids[line_no]

			let new_value = prompt("请输入新的值", "")
			if (new_value == null) {
				return
			}
			new_value = new_value.trim()
			var _this = this
			$.ajax({
				type: 'GET',
				url: json_server+"/table/update",
				data :{
					id:id,
					column:column_name,
					value:new_value,
				},
				success: function( result ) {
					if(result["success"]) {
						_this.contents[line_no].splice(index, 1, new_value)
						//_this.contents[line_no][index] = new_value
						bus.$emit("update_single_value", column_name, id, new_value)
					}
				},
			});
		},

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
				url: json_server+"/table/add_column",
				data :{
					column:new_column,
				},
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
			if (new_column === this.headers[index]) {
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
				url: json_server+"/table/rename_column",
				data :{
					old: this.headers[index],
					new: new_column,
				},
				success: function( result ) {
					if(result["success"]) {
						bus.$emit("column_renamed", _this.headers[index], new_column);
					}
				},
			});
		},

		remove_column(index) {
			if (this.headers[index] === "构件编号") {
				alert("不能删除构件编号列")
				return
			}
			let del = confirm("确认要删除这列“"+ this.headers[index]+ "”么？删除的列将不能恢复");
			if (!del) {
				return
			}
			let _this= this;
			$.ajax({
				type: 'GET',
				url: json_server+"/table/remove_column",
				data :{
					column: this.headers[index],
				},
				success: function( result ) {
					if(result["success"]) {
						bus.$emit("column_deleted", _this.headers[index]);
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
				left += this.widths[i] + 2;
			}
			left -= 2;
			left -= 80;
			bus.$emit("open_menu", left,index);
		},

		filter_by(index) {
			var name_index = -1;
			for(var i = 0; i < this.headers.length; i++) {
				if(this.headers[i] === '构件编号') {
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
			for(var i = 0; i < this.contents.length; i++) {
				var type = this.contents[i][index];
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
				data[type].names.push(this.contents[i][name_index]);
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
		
		filter_content(content, row) {
			let filtered_content = []
			if(this.table_filter === null) {
				for(let key in content) {
					filtered_content.push(content[key])
				}
			} else {
				for(let key in content) {
					if(this.table_filter[content[key][0]] !== undefined) {
						filtered_content.push(content[key])
					}
				}
			}
			return filtered_content
		},

		set_up_table_data(header, content, ids, all_headers){
			var widths = [];
			let filtered_content = this.filter_content(content)

			for(var i = 0; i < header.length; i++) {
				widths.push( header[i].length + 3);
				for(var j in filtered_content) {
					if(filtered_content[j][i].length > widths[i]) {
						widths[i] = filtered_content[j][i].length;
					}
				}
			}

			for(var i in widths) {
				widths[i] *= 18;
			}
			if(filtered_content !== undefined && filtered_content.length > 0) {
				widths[0] /=18;
				widths[0] *= 10;
			}
			var sum = 0;
			for(var i in widths) {
				sum += widths[i];
			}
			sum += widths.length * 3;
			this.headers = header;
			this.widths = widths;
			this.contents = filtered_content;
			this.original_content = content;
			this.sum_table_width = sum;
			this.all_headers = all_headers;
			this.ids = ids;
		},

		setup_table_filter(table_filter) {
			this.table_filter = table_filter;
			if(this.all_headers.length !== 0) {
				this.set_up_table_data(this.headers, this.original_content, this.ids, this.all_headers)
			}
		}
	},

	mounted: function() {
		this.innerHeigh = this.height - this.bottomHeight - this.topHeight
		var _this = this;
		bus.$on("set_up_table_data", function(header, content, ids, all_headers) {
			_this.set_up_table_data(header, content, ids, all_headers)
		});

		bus.$on("sort_table_asc", function(index) {
			_this.index = index;
			_this.contents.sort(_this.sort_asc_index);
		});

		bus.$on("sort_table_desc", function(index) {
			_this.index = index;
			_this.contents.sort(_this.sort_desc_index);
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

		bus.$on("table_filter_arrive", function(table_filter) {
			_this.setup_table_filter(table_filter);
		});

	},
}
</script>

<style scoped>

.bottom_table {
	overflow: auto;
	margin-top: 4px;
	margin-left: 4px;
	padding: 4px;
	border: 1px solid rgb(65,113,156);
}

.table_header_and_add {

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
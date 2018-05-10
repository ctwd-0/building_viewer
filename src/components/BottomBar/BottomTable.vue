<template>
	<div class="bottom_table" :style="{height: innerHeigh - 20 + 'px', width: width - 20 + 'px'}" @scroll="table_scroll">
		<div v-show="!object_view" class="table_header_and_add" v-bind:style="{width : sum_table_width + 20 + 'px'}">
			<div 
				class="table_header"
				v-bind:style="{width : widths[index] + 'px'}"
				v-for="(header, index) in headers"
			>
				<label class="table_header_label" :style="{width : widths[index] - 23 + 'px'}" @contextmenu.prevent="show_table_menu($event, index)">
					{{header}}
				</label>
			</div>
			<label v-show="all_headers.length !== 0" class="table_header_label" :style="{width : '20px'}" v-on:click="add_column">+</label>
		</div>
		<div v-show="!object_view" class="table_content">
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
					:title="field"
				>
					{{field}}
				</label>
			</div>
		</div>
		<TableMenu/>
		<div v-show="object_view">
			<div v-show="object_view_values.length === 0">这个构件暂时未绑定数据。</div>
			<div v-show="object_view_values.length !== 0">
				<div v-for="obj, index in object_view_values">
					<label>{{obj.header}}</label>
					<label>{{obj.content}}</label>
				</div>
				<div>备注</div>
				<p>{{object_view_tips}}</p>
			</div>
		</div>
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
			object_view: false,
			innerHeigh: 200,
			index: 0,
			all_headers: [],
			ids: [],
			filtered_ids: [],
			index_in_all: [],
			widths: [],
			headers: [],
			contents: [],
			sum_table_width: 0,
			table_filter: null,
			original_content: [],
			all_data: [],
			object_view_values: [],
			object_view_tips: "",
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
		//表格滚动，隐藏菜单
		table_scroll() {
			bus.$emit("hide_table_menu")
		},

		//修改表格的值
		modify_value(line_no, index) {
			let column_name = this.headers[index]
			let id = this.filtered_ids[line_no]

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
						_this.original_content[_this.index_in_all[line_no]].splice(index, 1, new_value)
						//_this.contents[line_no][index] = new_value
						bus.$emit("update_single_value", column_name, id, new_value)
					}
				},
			});
		},

		//增加列
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

		//重命名列。
		rename_column(index) {
			let old_column = this.headers[index];
			if(old_column === "构件编号") {
				alert("不能重命名“构件编号”列")
				return
			}
			if(old_column === "备注") {
				alert("不能重命名“备注”列")
				return
			}
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
					old: old_column,
					new: new_column,
				},
				success: function( result ) {
					if(result["success"]) {
						bus.$emit("column_renamed", old_column, new_column);
					}
				},
			});
		},

		//删除列。
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

		//有bug。排序之后编辑内容要改。
		//递增排序
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

		//递减排序
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

		//显示菜单
		show_table_menu(event, index) {
			bus.$emit("show_table_menu", event, index);
		},

		//弃用，改用邮件菜单
		on_table_header_button(index) {
			var left = 5;
			for(var i = 0; i <= index; i++) {
				left += this.widths[i] + 2;
			}
			left -= 2;
			left -= 80;
			bus.$emit("open_menu", left,index);
		},

		//按属性过滤
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
		
		//按照当前显示的层级过滤表格
		filter_content(content, ids) {
			let filtered_content = []
			let filtered_ids = []
			let index_in_all = []
			if(this.table_filter === null) {
				for(let key in content) {
					filtered_content.push(content[key])
					filtered_ids.push(ids[key])
					index_in_all.push(key)
				}
			} else {
				for(let key in content) {
					if(this.table_filter[content[key][0]] !== undefined) {
						filtered_content.push(content[key])
						filtered_ids.push(ids[key])
						index_in_all.push(key)
					}
				}
			}
			return {
				filtered_content:filtered_content,
				filtered_ids:filtered_ids,
				index_in_all:index_in_all,
			}
		},

		//设置表格内容
		setup_table_data(header, content, ids, all_headers, all_data){
			var widths = [];
			let obj = this.filter_content(content, ids)
			let filtered_content = obj.filtered_content
			let filtered_ids = obj.filtered_ids
			let index_in_all = obj.index_in_all

			for(var i = 0; i < header.length; i++) {
				widths.push( header[i].length + 3);
				for(var j in filtered_content) {
					if(filtered_content[j][i].length > widths[i]) {
						widths[i] = filtered_content[j][i].length;
					}
				}
				if(header[i] !== "构件编号") {
					if(widths[i] > 12) {
						widths[i] = 12
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
			sum += widths.length * 3
			this.headers = header
			this.widths = widths
			this.contents = filtered_content
			this.original_content = content
			this.sum_table_width = sum
			this.all_headers = all_headers
			this.all_data = all_data
			this.filtered_ids = filtered_ids
			this.index_in_all = index_in_all
			this.ids = ids

			if (this.object_view) {
				this.setup_object_view();
			}
		},

		//设置当前层级的表格过滤器
		setup_table_filter(table_filter) {
			this.table_filter = table_filter;
			let model_id = table_filter["model_id"];
			if (model_id[0] === "g") {
				this.object_view = false
			} else {
				this.object_view = true
			}
			if(this.all_headers.length !== 0) {
				this.setup_table_data(this.headers, this.original_content, this.ids, this.all_headers, this.all_data)
			}
		},

		//设置单个构件视图的数据
		setup_object_view() {
			this.object_view_values = []
			this.object_view_tips = ""
			if (this.index_in_all.length === 1) {
				let headers = this.all_headers
				let contents = this.all_data[this.index_in_all[0]]
				for (let i = 0; i < headers.length; i++) {
					let header = headers[i]
					if(header === "模型编号") {
						continue
					}
					if(header === "备注") {
						this.object_view_tips = contents[i]
						continue
					}
					this.object_view_values.push({
						header: header,
						content: contents[i]
					})
				}
			} else {

			}
		}
	},

	mounted: function() {
		this.innerHeigh = this.height - this.bottomHeight - this.topHeight
		var _this = this;

		//接收数据
		bus.$on("setup_table_data", function(header, content, ids, all_headers, all_data) {
			_this.setup_table_data(header, content, ids, all_headers, all_data)
		});

		//递增排序
		bus.$on("sort_table_asc", function(index) {
			_this.index = index;
			_this.contents.sort(_this.sort_asc_index);
		});

		//递减排序
		bus.$on("sort_table_desc", function(index) {
			_this.index = index;
			_this.contents.sort(_this.sort_desc_index);
		});

		//按属性过滤
		bus.$on("filter_by", function(index) {
			_this.filter_by(index);
		});

		//重命名列
		bus.$on("rename_column", function(index) {
			_this.rename_column(index);
		});

		//删除列
		bus.$on("remove_column", function(index) {
			_this.remove_column(index);
		});

		//接受表格过滤器
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
	overflow: hidden;
	height: 20px;
	margin: 1px;
}
</style>
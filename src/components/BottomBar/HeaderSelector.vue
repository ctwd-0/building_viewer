<template>
	<div class="header_selector">
		<div
			class="header_selector_header"
		>
			<div
				:class="{'header_selected': current_index === index, 'header_not_selected':current_index !== index}"
				v-for="(name, index) in names"
			>
				<label class="header_selected_label" @click="table_selector_change(index)"> {{name}} </label>
				<button @click="delete_selector(index)">删</button>
			</div>
			<label @click="new_selector" class="label_add_header">+</label>
		</div>
		<div
			class="header_selector_content"
		>
			<div
				class="table_selector_header"
				v-for="(name, index) in headers"
			>
				<input
					type="checkbox"
					:disabled="name.disabled"
					:id="'checkbox'+index"
					:value="name.name"
					v-model="model"
				>
				<label>{{name.name}}</label>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'header_selector',
	components: {
	},
	
	data () {
		return {
			from_server: false,
			names:["默认"],
			current_index: 1,
			model:["构件编号"],
			models:[["构件编号"]],
			headers:[
				{name:"构件编号",disabled:true},
				{name:"构件类别"},
				{name:"构件类型"},
				{name:"方位"},
				{name:"所属部件"},
				{name:"材质类别"},
				{name:"材质类型"},
				{name:"保存状态"},
				{name:"病害类型"},
				{name:"干预情况"},
				{name:"备注"},
			],
			data_t: {},
			has_data_t: false,
		};
	},

	methods: {
		delete_selector(index) {
			if (this.names.length === 1) {
				alert("不能删除最后一个选择器。")
				return
			}
			let del = confirm("确认要删除选择器“"+ this.names[index]+ "”么？删除的选择器将不能恢复");
			if (!del) {
				return
			}
			let name = this.names[index];
			let _this = this;
			$.ajax({
				type: 'GET',
				url: json_server+"/filter/delete",
				data :{
					name:name,
				},
				success: function( result ) {
					if(result["success"] == false) {
						alert(result["reason"]);
					} else {
						_this.$emit("selector_arrive", result);
					}
				},
			});
		},
		
		new_selector() {
			let new_selector = prompt("请输入新的选择器名称", "")
			if(new_selector === null) {
				return
			}
			new_selector = new_selector.trim()
			this.commit_new_selector(new_selector);
		},

		commit_new_selector(new_selector_name) {
			if(new_selector_name == "") {
				alert("名称不能为空");
				return;
			}
			if(this.names.indexOf(new_selector_name) !== -1) {
				alert("名称重复");
				return;
			}
			var _this = this;
			$.ajax({
				type: 'GET',
				url: json_server+"/filter/add",
				data :{
					name:new_selector_name,
					model:JSON.stringify(this.model),
				},
				success: function( result ) {
					if(result["reason"] === undefined) {
						_this.$emit("selector_arrive", result);
					}
				},
			});
		},

		table_selector_change(index) {
			let old_index = this.current_index;
			let new_index = index;
			this.models.splice(old_index, 1, this.model);
			this.model = this.models[new_index];
			this.current_index = index;
		},

		cut_data() {
			if(!this.has_data_t) {
				return;
			}
			let header = [];
			let content_t = [];
			for(let i = 0; i < this.data_t.header.length; i++) {
				if ($.inArray(this.data_t.header[i], this.model) !== -1) {
					content_t.push(this.data_t.content[i]);
					header.push(this.data_t.header[i]);
				}
			}
			let content = [];
			let ids = [];
			if(content_t.length > 0) {
				for(let i = 0; i < content_t[0].length; i++) {
					content.push([]);
					ids.push(this.data_t.ids[i])
					for(let j = 0; j < content_t.length; j++) {
						content[i].push(content_t[j][i]);
					}
				}
			}

			bus.$emit("setup_table_data", header, content, ids, this.data_t.header, this.data_t.content_t);
		},

		save_model() {
			$.ajax({
				type: 'GET',
				url: json_server+"/filter/update",
				data :{
					name:this.names[this.current_index],
					model:JSON.stringify(this.model),
				},
				success: function( result ) {
				},
			});
		},
		
		remove_garbage(header, filter) {
			let result = []
			for(let key in filter) {
				if (header.indexOf(filter[key]) !== -1 && result.indexOf(filter[key]) === -1) {
						result.push(filter[key])
				}
			}
			return result
		},

		selector_arrive(data) {
			this.headers = [];
			this.models = [];
			this.model = [];
			this.names = [];
			this.current_index = 0;
			this.from_server = true;

			let current_set = false;
			for(let key in data.header) {
				if(data.header[key] == "构件编号" ) {
					this.headers.push({
						name:data.header[key],
						disabled:true
					});
				} else if (data.header[key] == "模型编号"){
					
				} else {
					this.headers.push({
						name:data.header[key],
					});
				}
			}

			for(var key = 0; key < data.filter.length; key++) {
				let flt = data.filter[key]
				if(flt.default === true && !current_set) {
					this.current_index = key
					current_set = true;
				}
				this.names.push(flt.name);
				this.models.push(this.remove_garbage(data.header, flt.model));
			}

			this.model = this.models[this.current_index];

			if(this.has_data_t) {
				this.cut_data();
			}
		},

		new_table_content_arrive(data) {
			let content = [];
			for(let i = 0; i < data.header.length; i++) {
				content.push([]);
				for(let j = 0 ; j < data.content.length; j++) {
					content[i].push(data.content[j][i]);
				}
			}
			this.data_t = {
				header:data.header,
				content:content,
				content_t: data.content,
				ids:data.ids,
			};
			this.has_data_t = true,
			this.cut_data();
		},

		new_column_added(new_column) {
			if(this.has_data_t) {
				this.data_t.header.push(new_column)
				this.headers.push({name:new_column})
				this.model.push(new_column)
				let blank_array = [];
				for(let i = 0; i < this.data_t.content[0].length; i++) {
					blank_array.push("");
				}
				this.data_t.content.push(blank_array)
				this.cut_data();
			}
		},

		column_renamed(old_column, new_column) {
			if(this.has_data_t) {
				let index = this.data_t.header.indexOf(old_column)
				let index2 = -1
				for(let idx in this.headers) {
					if (this.headers[idx].name == old_column) {
						index2 = idx
						break
					}
				}
				if (index != -1 && index2 != -1) {
					this.data_t.header[index] = new_column
					this.headers[index2].name = new_column
					let index3 = this.model.indexOf(old_column)
					if (index3 !== -1) {
						this.model.splice(index3, 1)
					}
					this.model.push(new_column)
					this.cut_data()
				}
			}
		},

		column_deleted(deleted_column) {
			if(this.has_data_t) {
				let index = this.data_t.header.indexOf(deleted_column)
				let index2 = -1
				for(let idx in this.headers) {
					if (this.headers[idx].name == deleted_column) {
						index2 = idx
						break
					}
				}
				if (index != -1 && index2 != -1) {
					this.data_t.header.splice(index, 1)
					this.data_t.content.splice(index, 1)
					for (let i in this.data_t.content_t) {
						this.data_t.content_t[i].splice(index, 1)
					}
					this.headers.splice(index2, 1)
					let index3 = this.model.indexOf(deleted_column)
					if( index3 != -1) {
						this.model.splice(index3, 1)
						for(let i in this.models) {
							let index4 = this.models[i].indexOf(deleted_column)
							if (index4 !== -1) {
								this.models[i].splice(index4, 1);
							} 
						}
					}
					this.cut_data()
				}
			}
		},

		update_single_value(column_name, row_id, new_value){
			if(this.has_data_t) {
				let column = this.data_t.header.indexOf(column_name)
				let row = this.data_t.ids.indexOf(row_id)
				if (column !== -1 && row !== -1) {
					this.data_t.content[column][row] = new_value
					this.data_t.content_t[row][column] = new_value
				}
			}
		}
	},

	mounted: function() {
		var _this = this;
		$.ajax({
			type: 'GET',
			url: json_server+"/filter/init",
			success: function( result ) {
				if(result["reason"] === undefined) {
					_this.$emit("selector_arrive", result);
				}
			},
		});

		this.$on("selector_arrive", function(data) {
			_this.selector_arrive(data);
		});

		bus.$on("new_table_content_arrive", function(data){
			_this.new_table_content_arrive(data)
		});
		
		bus.$on("new_column_added", function(new_column){
			_this.new_column_added(new_column)
		});

		bus.$on("column_renamed", function(old_column, new_column){
			_this.column_renamed(old_column, new_column)
		});

		bus.$on("column_deleted", function(deleted_column){
			_this.column_deleted(deleted_column)
		});

		bus.$on("update_single_value", function(column_name, row_id, new_value) {
			_this.update_single_value(column_name, row_id, new_value);
		});
	},

	watch: {
		model(val) {
			this.cut_data();
			if(!this.from_server) {
				this.save_model();
			} else {
				this.from_server = false;
			}
		}
	}
}
</script>

<style scoped>
.header_selected{
	position: relative;
	top: 1px;
	display: inline-block;
	border-left: 1px solid rgb(65,113,156);
	border-right: 1px solid rgb(65,113,156);
	border-top: 1px solid rgb(65,113,156);
	background-color: rgb(222,235,247);
	z-index: 1;
	padding: 2px;
}
.header_selected_label {
	display:inline-block;
	min-width:30px;
	text-align: center;
}
.header_not_selected {
	display: inline-block;
	padding: 2px;
}

.label_add_header {
	display: inline-block;
	padding-left: 5px;
	font-size: 18px;
}
.header_selector_content {
	background-color: rgb(222,235,247);
	border: 1px solid rgb(65,113,156);
	z-index: 0;
}

.table_selector_header{
	display: inline-block;
}

.table_selector_content{
	display: inline-block;
}
.header_selector {
	padding: 4px;
	margin: 4px;
	border: 1px solid rgb(65,113,156);
}
</style>

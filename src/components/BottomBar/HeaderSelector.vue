<template>
	<div id="header_selector">
		<div
			id="header_selector_header"
		>
			<div
				class="table_selector_header"
				v-for="(name, index) in names"
			>
				<span @click="table_selector_change(index)"> {{name}} </span>
				<button @click="delete_selector(index)">删</button>
			</div>
			<span v-if="is_newing">
				<input v-model="new_selector_name">
				<button @click="commit_new_selector">确定</button>
				<button @click="cancel_new_selector">取消</button>
			</span>
			<span v-if="!is_newing">
				<button @click="new_selector">新建</button>
			</span>
		</div>
		<div
			id="header_selector_content"
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
			<!--
			<span>names: {{ model }}</span>
			<span>current_index: {{ current_index }}</span>
			-->
		</div>
	</div>
</template>

<script>
export default {
	name: 'header_selector',
	components: {
	},
	methods: {
		delete_selector(index) {
			let name = this.names[index];
			let _this = this;
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/filter/delete",
				data :{
					name:name,
				},
				crossDomain: true,
				success: function( result ) {
					if(result["success"] == false) {
						alert(result["reason"]);
					} else {
						_this.$emit("selector_arrive", result);
						//alert("删除成功");
					}
				},
			});
		},
		new_selector() {
			this.new_selector_name = "";
			this.is_newing = true;
		},
		cancel_new_selector() {
			this.is_newing = false;
		},
		commit_new_selector() {
			if(this.new_selector_name == "") {
				alert("名称不能为空");
				return;
			}
			if(this.names.indexOf(this.new_selector_name) !== -1) {
				alert("名称重复");
				return;
			}
			var _this = this;
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/filter/add",
				data :{
					name:this.new_selector_name,
					model:JSON.stringify(this.model),
				},
				crossDomain: true,
				success: function( result ) {
					if(result["reason"] === undefined) {
						_this.$emit("selector_arrive", result);
					}
				},
			});
			this.is_newing = false;
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

			bus.$emit("set_up_table_data", header, content, ids, this.data_t.header);
		},

		save_model() {
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/filter/update",
				data :{
					name:this.names[this.current_index],
					model:JSON.stringify(this.model),
				},
				crossDomain: true,
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

			for(let key in data.filter) {
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
					this.headers.splice(index2,1)
					let index3 = this.model.indexOf(deleted_column)
					if( index3 != -1) {
						this.model.splice(index3, 1)
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
				}
			}
		}
	},

	data () {
		return {
			from_server: false,
			is_newing:false,
			new_selector_name:"",
			names:["默认"],
			current_index: 0,
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

	mounted: function() {
		var _this = this;
		$.ajax({
			type: 'GET',
			url: "http://"+json_server+"/filter/init",
			crossDomain: true,
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
.table_selector_header{
	display: inline-block;
}

.table_selector_content{
	display: inline-block;
}
</style>
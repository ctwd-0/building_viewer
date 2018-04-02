<template>
	<div id="photos">
		<div id="photo_tab_header"v-bind:style="{overflow:'hidden'}">
			<span v-bind:style="{height:'26px'}" @click="left_click">L</span>
			<div v-bind:style="{display: 'inline-block', width:'235px', overflow: 'hidden'}">
				<ul v-bind:style="{width: '1000px', position: 'relative', left: list_left + 'px'}">
					<li
						v-for="(item, index) in folders"
						v-bind:item="item"
						v-bind:index="index"
						v-bind:class="{photo_selected:item.sel, photo_not_selected:!item.sel}"
						v-on:click="change_photo_sel(index)"
						v-on:dblclick="rename_folder(index)"
						v-on:contextmenu.prevent="remove_folder(index)"
					>{{item.text}}</li>
					<li 
						v-if="!adding_folder" 
						v-bind:class="{photo_not_selected:true}"
						v-on:click="adding_folder=true"
					>+</li>
					<li v-if="adding_folder">
						<label>名：</label>
						<input type="text" v-model="new_folder_name" v-bind:style="{display:'inline', width: '80px'}">
						<button @click="commit_adding_folder">好</button>
						<button @click="cancel_adding_folder">不</button>
					</li>
				</ul>
			</div>
			<span v-bind:style="{height:'26px'}" @click="right_click">R</span>
		</div>
		<div id="photo_tab_content">
			<div id="photo_content">
				<div>
					<input 
						type="file" 
						name="file_input" 
						accept="application/pdf,image/jpeg,image/jpg,image/png" 
						style="max-width:180px"
						ref="file_input">
					<button @click="upload" ref="upload_button" :disabled="uploading">上传</button>
				</div>
				<div v-if="uploading && !waiting">
					<label>{{uploading_progress}}</label>
				</div>
				<div v-if="uploading && waiting">
					<label>{{waiting_info}}</label>
				</div>
				<img
					class="single_photo"
					v-for="(item, index) in photo_array"
					v-on:click="click_photo(index)"
					v-bind:src="item.thumbnail_path">
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'phtots',
	components: {
	},
	methods: {
		rename_folder(index) {
			let new_folder = prompt("请输入新文件夹的名称：", "")
			if(new_folder === null) {
				return
			}
			new_folder = new_folder.trim()
			let old_folder = this.folders[index].text
			if (new_folder === "") {
				alert("新文件夹名不能为空")
				return
			}
			if (new_folder === old_folder) {
				alert("新文件夹名与旧文件夹相同")
				return
			}
			for (let key in this.folders) {
				if (this.folders[key].text === new_folder) {
					alert("已存在该文件夹")
					return
				}
			}

			let _this = this
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/folder/rename",
				data :{
					model_id: model_id,
					new: new_folder,
					old: old_folder,
				},
				crossDomain: true,
				success: function( result ) {
					if(result["success"]) {
						_this.folder_renamed(old_folder, new_folder)
					}
				},
			});
		},

		folder_renamed(old_folder, new_folder) {
			for (let key in this.folders) {
				if (this.folders[key].text === old_folder) {
					this.folders[key].text = new_folder
					return
				}
			}
		},
		
		remove_folder(index) {
			let new_folder = prompt("请输入被删除文件夹将被移动到的文件夹：", "")
			if(new_folder === null) {
				return
			}
			new_folder = new_folder.trim()
			let old_folder = this.folders[index].text
			if (new_folder === "") {
				alert("文件夹不能为空")
				return
			}
			if (new_folder === old_folder) {
				alert("新文件夹名与旧文件夹相同")
				return
			}

			let _this = this
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/folder/remove",
				data :{
					model_id: model_id,
					new: new_folder,
					old: old_folder,
				},
				crossDomain: true,
				success: function( result ) {
					if(result["success"]) {
						_this.folder_removed(old_folder, new_folder)
					}
				},
			});
		},

		folder_removed(old_folder, new_folder) {
			let index1 = -1;
			for (let key in this.folders) {
				if (this.folders[key].text === old_folder) {
					index1 = key
				}
			}
			if (index1 !== -1) {
				this.folders.splice(index1, 1)
				let index2 = -1
				for (let key in this.folders) {
					if (this.folders[key].text === new_folder) {
						index2 = key
					}
				}
				if (index2 === -1) {
					this.folders.push({text:new_folder, sel:true})
					index2 = this.folders.length - 1
				} else {
					this.photo_sel = index2
				}
				this.change_photo_sel(index2)
			}
		},

		show_menu(index) {

		},

		commit_adding_folder() {
			var _this = this;
			if (this.new_folder_name.trim() === "") {
				alert("名称不能为空");
				return
			}
			for(let key in this.folders) {
				if (this.folders[key].text == this.new_folder_name) {
					alert("与已经有的名称重复");
					return
				}
			}
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/folder/add",
				data: {
					model_id: model_id,
					folder_name: this.new_folder_name,
				},
				crossDomain: true,
				success: function( result ) {
					if(result.success) {
						_this.$emit("folders", result.folders);
						_this.$emit("photo_array", result.files);
					}
				},
			});
			this.adding_folder = false;
		},

		cancel_adding_folder() {
			this.new_folder_name = "";
			this.adding_folder = false;
		},

		left_click() {
			this.list_left += 100;
			if (this.list_left > 0) {
				this.list_left = 0;
			}
		},

		right_click() {
			this.list_left -= 100;
		},
		
		upload() {
			let _this = this;
			if (this.$refs.file_input.files.length === 0) {
				alert("请先选择文件")
				return
			}
			this.uploading = true;
			let file = new FormData();
			file.append('file', this.$refs.file_input.files[0]);
			file.append('model_id', model_id);
			file.append('category', this.folders[this.photo_sel].text);
			$.ajax({
				type: 'POST',
				url: "http://"+json_server+"/file/upload",
				data: file,
				crossDomain: true,
				contentType: false,
				processData: false,
				xhr: function(){
					let myXhr = $.ajaxSettings.xhr();
					if(myXhr.upload){
						myXhr.upload.addEventListener('progress', function(e) {
							if(e.lengthComputable) {
								_this.uploading_progress = "文件上传中。进度：" 
									+ e.loaded / e.total * 100 + "%";
							} else {
								_this.uploading_progress = "正在上传服务器，请稍候。";
							}
							//console.log(e.lengthComputable, e.loaded, e.total)
						}, false);
					}
					return myXhr;
				},
				success: function(data) {
					if (data.success) {
						_this.$refs.file_input.value = "";
						//_this.uploading = false;
						//console.log(data);
						_this.waiting = true;
						_this.token = data.token;
						_this.$emit("waiting_image", 0);
					} else {
						_this.uploading = false;
					}
				},
				error: function(err) {
					_this.uploading = false;
				}
			});
		},

		click_photo(index) {
			if (this.photo_array[index].type === "pdf") {
				window.open("dist/pdf/viewer.html?file=" 
					+ this.photo_array[index].original_path)
			} else {
				bus.$emit("click_photo", {index:index, photo_array: this.photo_array});
			}
		},

		change_photo_sel(index) {
			this.photo_sel = index;
			for(var item in this.folders) {
				this.folders[item].sel = false;
			}
			this.folders[index].sel = true;
			this.photo_array = [];

			var _this = this;
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/file/get_files",
				data: {
					model_id: model_id,
					category: this.folders[this.photo_sel].text,
				},
				crossDomain: true,
				success: function( result ) {
					if(result.success) {
						_this.photo_array = result.files;
					}
				},
			});
		},
	},
	
	data () {
		return {
			adding_folder: false,
			new_folder_name: "",
			uploading_progress: "",
			waiting_info: "服务器正在生成缩略图，请稍候。",
			uploading:false,
			waiting: false,
			token:"",
			file: null,
			model_id: 'g_-1',
			photo_sel: 0,
			list_left: 0,
			folders:[{text:"加载中",sel:true}],
			photo_array:[],
		};
	},

	mounted:function() {
		var _this = this;
		$.ajax({
			type: 'GET',
			url: "http://"+json_server+"/folder/init",
			data: {
				model_id: model_id,
			},
			crossDomain: true,
			success: function( result ) {
				if(result.success) {
					_this.$emit("folders", result.folders);
					_this.$emit("photo_array", result.files);
				}
			},
		});

		this.$on("waiting_image", function(val) {
			if(val > 100) {
				_this.waiting = false;
				_this.uploading = false;
				_this.uploading_progress = "";
				_this.token = "";
				return;
			}
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/file/is_ready",
				data: {
					token: _this.token,
					model_id: model_id,
					category: this.folders[this.photo_sel].text,
				},
				crossDomain: true,
				success: function( result ) {
					if(result.success) {
						_this.$emit("waiting_image", Infinity)
						_this.photo_array = result.files;
					} else {
						setTimeout(function(){_this.$emit("waiting_image", val+1)}, 500);
					}
				},
			});
		});

		this.$on("photo_array", function(photo_array) {
			_this.photo_array = photo_array;
		});

		this.$on("folders", function(folders,index) {
			let make_folders = []
			for (let key in folders) {
				make_folders.push({text:folders[key], sel:false});
			}
			make_folders[0].sel = true;
			_this.photo_sel = 0;
			_this.list_left = 0;
			_this.folders = make_folders;
		});

		bus.$on("change_photo", function(m_id){
			if(m_id !== 'g_-1' && m_id !== 'g_7' && m_id !== 'o') {
				return;
			}
			if(m_id == model_id) {
				return;
			} else {
				model_id = m_id;
				$.ajax({
					type: 'GET',
					url: "http://"+json_server+"/file/get_files",
					data: {
						model_id: model_id,
						category: this.folders[this.photo_sel].text,
					},
					crossDomain: true,
					success: function( result ) {
						if(result.success) {
							_this.photo_array = result.files;
						}
					},
				});
			}
		});
	}
}
</script>

<style scoped>
ul {
	list-style: none;
	padding: 0;
	margin: 0;
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
	display: inline;
	background-color: rgb(222,235,247);
	padding-left: 5px;
	padding-right: 5px;
	font-size: 20px;
	/*width: 88px;*/
	line-height: 25px;
	text-align: center;
	border-right: 1px solid rgb(65,113,156);
	border-top: 1px solid rgb(65,113,156);
	border-left: 1px solid rgb(65,113,156);
	color: rgb(132,60,12);
}

.photo_not_selected {
	float: left;
	display: inline;
	background-color: rgb(189,215,238);
	padding-left: 5px;
	padding-right: 5px;
	/*width: 88px;*/
	font-size: 20px;
	line-height: 25px;
	text-align: center;
	border-bottom: 1px solid rgb(65,113,156);
}
</style>
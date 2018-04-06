<template>
	<div class="files" :style="{height:height + 'px', width: (innerWidth) + 'px'}">
		<div class="tab_header" :style="{width:(innerWidth) + 'px'}">
			<a class="arrow_left" @click="left_click"></a>
			<div class="tab_header_content" :style="{width:(innerWidth - 30) + 'px'}">
				<ul :style="{display: 'block', whiteSpace:'nowrap',  position: 'relative', left: list_left + 'px'}">
					<li
						v-for="(item, index) in folders"
						v-bind:item="item"
						v-bind:index="index"
						v-bind:class="{selected:item.sel, not_selected:!item.sel}"
						v-on:click="change_folder_sel(index)"
						v-on:dblclick="rename_folder(index)"
						v-on:contextmenu.prevent="remove_folder(index)"
					>
						{{item.text}}
					</li>
					<li 
						v-bind:class="{not_selected:true}"
						v-on:click="add_folder"
					>+</li>
				</ul>
			</div>
			<a class="arrow_right" @click="right_click"></a>
		</div>
		<div class="file_content" :style="{width:(innerWidth - 3) + 'px', height: (height - 43) + 'px'}">
			<div class="inner_file_content">
				<div style="margin-lft:auto, margin-right:auto">
					<input 
						type="file" 
						name="file_input" 
						accept="application/pdf,image/jpeg,image/jpg,image/png" 
						style="max-width:167px"
						ref="file_input">
					<button @click="upload" ref="upload_button" :disabled="uploading">上传</button>
				</div>
				<div v-if="uploading && !waiting">
					<label>{{uploading_progress}}</label>
				</div>
				<div v-if="uploading && waiting">
					<label>{{waiting_info}}</label>
				</div>
				<PhotoFrame 
					v-for="(item, index) in file_array" 
					:key="index"
					:data="item"
					:index="index"
					:clickPhoto="click_file"
					:width="innerWidth - 22"
					:height="(innerWidth - 22)*.707"
				>
				</PhotoFrame>
			</div>
		</div>
	</div>
</template>
<script>
import PhotoFrame from '../Common/PhotoFrame.vue'
export default {
	name: 'files',
	components: {
		PhotoFrame,
	},
	props:{
		width: Number,
		height: Number,
		rightWidth: Number,
		leftWidth: Number,
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
					this.folder_sel = index2
				}
				this.change_folder_sel(index2)
			}
		},

		show_menu(index) {

		},

		add_folder() {
			var _this = this;
			let new_folder = prompt("请输入新文件夹的名字：", "")
			if(new_folder === null) {
				return
			}
			new_folder = new_folder.trim()
			if (new_folder === "") {
				alert("文件夹不能为空")
				return
			}
			for(let key in this.folders) {
				if (this.folders[key].text == new_folder) {
					alert("与已经有的名称重复");
					return
				}
			}
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/folder/add",
				data: {
					model_id: model_id,
					folder_name: new_folder,
				},
				crossDomain: true,
				success: function( result ) {
					if(result.success) {
						_this.folder_added(new_folder)
					}
				},
			});
		},

		folder_added(new_folder) {
			let index = -1;
			this.folders.push({text:new_folder, sel:false})
			this.change_folder_sel(this.folders.length-1)
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
			file.append('category', this.folders[this.file_sel].text);
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

		click_file(index) {
			bus.$emit("click_photo", {index:index, file_array: this.file_array});
		},

		change_folder_sel(index) {
			this.file_sel = index;
			for(var item in this.folders) {
				this.folders[item].sel = false;
			}
			this.folders[index].sel = true;
			this.file_array = [];

			var _this = this;
			$.ajax({
				type: 'GET',
				url: "http://"+json_server+"/file/get_files",
				data: {
					model_id: model_id,
					category: this.folders[this.file_sel].text,
				},
				crossDomain: true,
				success: function( result ) {
					if(result.success) {
						_this.file_array = result.files;
					}
				},
			});
		},
	},
	
	data () {
		return {
			innerWidth: 300, 
			uploading_progress: "",
			waiting_info: "服务器正在生成缩略图，请稍候。",
			uploading:false,
			waiting: false,
			token:"",
			file: null,
			model_id: 'g_-1',
			file_sel: 0,
			list_left: 0,
			folders:[{text:"加载中",sel:true}],
			file_array:[],
		};
	},

	watch: {
		width(val, old) {
			this.innerWidth = this.width - this.rightWidth - this.leftWidth - 16;
		}
	},

	mounted:function() {
		this.innerWidth = this.width - this.rightWidth - this.leftWidth - 16;
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
					_this.$emit("file_array", result.files);
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
					category: this.folders[this.file_sel].text,
				},
				crossDomain: true,
				success: function( result ) {
					if(result.success) {
						_this.$emit("waiting_image", Infinity)
						_this.file_array = result.files;
					} else {
						setTimeout(function(){_this.$emit("waiting_image", val+1)}, 500);
					}
				},
			});
		});

		this.$on("file_array", function(file_array) {
			_this.file_array = file_array;
		});

		this.$on("folders", function(folders,index) {
			let make_folders = []
			for (let key in folders) {
				make_folders.push({text:folders[key], sel:false});
			}
			make_folders[0].sel = true;
			_this.file_sel = 0;
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
					url: "http://"+json_server+"/folder/init",
					data: {
						model_id: model_id,
					},
					crossDomain: true,
					success: function( result ) {
						if(result.success) {
							_this.$emit("folders", result.folders);
							_this.$emit("file_array", result.files);
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
.files {
	left: 6px;
	top: 8px;
	position: absolute;
}

.tab_header {
	position: relative;
	overflow: hidden;
	height: 26px;
	margin: auto;
}

.tab_header_content {
	display: inline-block;
	margin-left: 15px;
	overflow: hidden;
}

.file_content {
	margin: auto;
	background-color: rgb(222,235,247);
	border-right: 1px solid rgb(65,113,156);
	border-bottom: 1px solid rgb(65,113,156);
	border-left: 1px solid rgb(65,113,156);
	overflow-y: auto;
}

.inner_file_content {

}

.selected {
	list-style: none;
	display: inline-block;
	background-color: rgb(222,235,247);
	padding-left: 5px;
	padding-right: 5px;
	font-size: 20px;
	line-height: 25px;
	text-align: center;
	border-right: 1px solid rgb(65,113,156);
	border-top: 1px solid rgb(65,113,156);
	border-left: 1px solid rgb(65,113,156);
	color: rgb(132,60,12);
}

.not_selected {
	list-style: none;
	display: inline-block;
	background-color: rgb(189,215,238);
	padding-left: 5px;
	padding-right: 5px;
	font-size: 20px;
	line-height: 25px;
	text-align: center;
	border-bottom: 1px solid rgb(65,113,156);
}

.arrow_left {
	position: absolute;
	left:0;
	top:0;
	width: 13px;
	height: 26px;
	background-image: url(/dist/ui/arrows.png);
	background-size: 70px;
	background-position: 0px -39px;
}
.arrow_right {
	position: absolute;
	right:0;
	top:0;
	width: 13px;
	height: 26px;
	background-image: url(/dist/ui/arrows.png);
	background-size: 70px;
	background-position: -12px -39px;
}
</style>

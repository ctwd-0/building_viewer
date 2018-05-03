<template>
	<div id="large_image_container" v-show="show">
		<div v-if="file_array.length" id="main" ref="main_div">
			<p v-bind:style="{paddingTop:p_image_padding_top + 'px', margin: 0}" ref="p_image">
				<img
					ref="image"
					opacity="1"
					v-bind:width="image_width + 'px'"
					v-bind:height="image_height + 'px'"
					v-bind:src="file_array[index].thumbnail_path"
				>
			</p>
			<a 
				href="javascript:;"
				:class="['arrow_button', 'arrow_button_left']"
				@click.prevent="prev_photo()"
				@mouseover="left_arrow = true"
				@mouseleave="left_arrow = false"
			>
				<transition name="ease-out">
					<i v-if="left_arrow" id="prev"></i>
				</transition>
			</a>
			<a
				href="javascript:;"
				:class="['arrow_button', 'arrow_button_right']"
				@click.prevent="next_photo()"
				@mouseover="right_arrow = true"
				@mouseleave="right_arrow = false"
			>
				<transition name="ease-out">
					<i v-if="right_arrow" id="next"></i>
				</transition>
			</a>
		</div>
		<div id="bottom_bar">
			<p :class="['index_left']">
				<strong>{{(index+1)}}</strong>
				{{"/" + file_array.length}}
			</p>
			<p v-if="!editing" class="description_right" >{{text}}</p>
			<textarea 
				v-if="editing"
				class="textarea_right"
				v-model="new_text"
				v-bind:style="{width:text_area_width + 'px'}"
			>
			</textarea>
			<a 
				v-if="file_array.length && !editing && file_array[index].type == 'pdf'" href="javascript:;"
				title="预览" class="preview_button"  @click="preview()" 
			></a>
			<a 
				v-if="!editing" @click="edit()" href="javascript:;"
				title="编辑" class="edit_button"
				:style="{bottom: edit_button_bottom + 'px'}"
			></a>
			<a title="保存" class="save_button" v-if="editing" @click="save()" href="javascript:;"></a>
			<a title="取消" class="cancel_button" v-if="editing" @click="cancel()" href="javascript:;"></a>
		</div>
		<a href="javascript:;" id="quit" title="返回" @click="hide()">
		</a>
	</div>
</template>

<script>
export default {
	name: 'large_image_container',
	components: {
	},
	data () {
		return {
			left_arrow: false,
			right_arrow: false,
			show: false,
			editing: false,
			index: 0,
			file_array: [],
			new_text: "",
			edit_button_bottom: 39,
		};
	},
	methods: {
		compute_edit_button_bottom() {
			this.edit_button_bottom = this.file_array.length && this.file_array[this.index].type == 'pdf' ? 13 : 39
		},
		main_div_width() {
			return window.innerWidth;
		},

		main_div_height() {
			return window.innerHeight - 118;
		},
		preview() {
			if(this.file_array[this.index].type == "pdf") {
				window.open("/dist/pdf/viewer.html?file=" + this.file_array[this.index].original_path)
			}
		},
		cancel() {
			this.editing = false;
			this.new_text = "";
		},
		edit() {
			this.new_text = this.text;
			this.editing = true;
		},
		save() {
			this.editing = false;
			this.file_array[this.index].description = this.new_text;
			$.ajax({
				type: 'POST',
				url: "http://"+json_server+"/file/update_description",
				data: {
					id: this.file_array[this.index]._id,
					description: this.new_text,
				},
				crossDomain: true,
				success: function( result ) {
					if (result.success) {
						alert("保存成功");
					} else {
						alert("保存失败");
					}
				},
				error: function( err ) {
					alert("网络错误");
				},
			});
			this.new_text = "";
		},
		hide() {
			this.cancel();
			this.show = false;
		},
		prev_photo() {
			this.cancel();
			this.index--;
			if(this.index < 0) {
				this.index = 0;
			}
		},
		next_photo() {
			this.cancel();
			this.index++;
			if(this.index >= this.file_array.length) {
				this.index = this.file_array.length -1;
			}
		},
		image_size() {
			let div_width = this.main_div_width()
			let div_height = this.main_div_height()
			let max_height = div_height
			let max_width = div_width - 2*(37 + 20 * 2)
			let ori_width = this.file_array[this.index].thumbnail_width
			let ori_height = this.file_array[this.index].thumbnail_height
			if (ori_width <= max_width && ori_height <= max_height) {
				let try_width = ori_width * max_height / ori_height
				if(try_width <= max_width) {
					return {width: try_width, height: max_height}
				} else {
					return {width: max_width, height: ori_height * max_width / ori_width}
				}
			} else if (ori_height <= max_height) {
				return {width:max_width, height: ori_height * max_width / ori_width}
			} else if (ori_width <= max_width) {
				return {width: ori_width * max_height / ori_height, height: max_height}
			} else {
				let try_width = ori_width * max_height / ori_height
				if(try_width <= max_width) {
					return {width: try_width, height: max_height}
				} else {
					return {width: max_width, height: ori_height * max_width / ori_width}
				}
			}
		},
		func_text_area_width() {
			return this.main_div_width() - 164 - 120 - 50
		}
	},

	mounted: function(){
		var _this = this;
		bus.$on("click_photo", function(data) {
			_this.show = true;
			_this.file_array = data.file_array;
			_this.index = data.index;
		});
		bus.$on("large_image_container_resize", function() {
			if(_this.show) {
				_this.$refs.image.width = _this.image_size().width
				_this.$refs.image.height = _this.image_size().height
				let div_height = _this.main_div_height()
				let image_height = _this.image_size().height
				_this.$refs.p_image.style.paddingTop = ((div_height - image_height) / 2) + 'px'
			}
		})
	},

	computed: {
		text: function() {
			if (this.index < this.file_array.length) {
				return this.file_array[this.index].description;
			} else {
				return "";
			}
		},
		image_width() {
			return this.image_size().width
		},
		image_height() {
			return this.image_size().height
		},
		text_area_width() {
			return this.func_text_area_width()
		},
		p_image_padding_top() {
			let div_height = this.main_div_height()
			let image_height = this.image_height
			return (div_height - image_height) / 2
		}
	},

	watch: {
		index(val) {
			this.compute_edit_button_bottom()
		}
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
	background-color: rgba(0,0,0,.9);
	z-index: 10001;
}

#main {
	top: 0;
	bottom: 118px;
	width: 100%;
	text-align: center;
	position: absolute;
}

#quit {
	position: absolute;
	display: block;
	background-color: #222;
	background-image: url(/dist/ui/arrows.png);
	background-position: -42px -70px;
	background-repeat: no-repeat;
	width: 38px;
	height: 38px;
	right: 30px;
	top: 30px;
	z-index: 1;
}

#prev {
	position: absolute;
	background-image: url(/dist/ui/arrows.png);
	background-position: 0px 0px;
	background-repeat: no-repeat;
	width: 37px;
	height: 69px;
	left: 20px;
	top: 50%;
	margin-top: -19px;
}

#next {
	position: absolute;
	background-image: url(/dist/ui/arrows.png);
	background-position: -37px 0px;
	background-repeat: no-repeat;
	width: 37px;
	height: 69px;
	right: 20px;
	top: 50%;
	margin-top: -19px;
}

.arrow_button {
	width: 50%;
	height: 100%;
	top: 0;
	z-index: 1;
	display: block;
	position: absolute;
	background: 0 0;
}

.arrow_button_left {
	left: 0;
}

.arrow_button_right {
	right: 0;
}

#bottom_bar {
	display: block;
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	color: #fff;
	height: 118px;
}

.ease-out-enter-active {
	transition: all .3s ease;
}

.ease-out-leave-active {
	transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

.ease-out-enter, .ease-out-leave-to {
  opacity: 0;
}
.index_left {
	width: 164px;
	line-height: 118px;
	text-align: center;
	font-size: 28px;
	padding-left: 50px;
	float: left;
	margin: 0;
	color: #666;
}
.index_left strong {
	color: #2be;
	font-style: italic;
}
.description_right {
	min-height: 48px;
	line-height: 24px;
	padding-top: 21px;
	padding-right: 120px;
	margin: 0;
}
.textarea_right {
	resize: none;
	margin-top: 21px;
	width: 1000px;
	height: 76px;
}
.preview_button {
	position: absolute;
	width: 40px;
	height: 40px;
	background-image: url(/dist/ui/btns.png);
	filter: invert(1);
	background-position: -997px -80px;
	background-repeat: no-repeat;
	right: 40px;
	top: 13px;
}
.edit_button {
	position: absolute;
	width: 40px;
	height: 40px;
	background-image: url(/dist/ui/btns.png);
	filter: invert(1);
	background-position: -913px -163px;
	background-repeat: no-repeat;
	right: 40px;
	bottom: 39px;
}
.save_button {
	position: absolute;
	width: 40px;
	height: 40px;
	background-image: url(/dist/ui/btns.png);
	filter: invert(1);
	background-position: -413px -80px;
	background-repeat: no-repeat;
	right: 40px;
	top: 13px;
}
.cancel_button {
	position: absolute;
	width: 40px;
	height: 40px;
	background-image: url(/dist/ui/btns.png);
	filter: invert(1);
	background-position: -497px -80px;
	background-repeat: no-repeat;
	right: 40px;
	bottom: 13px;
}
</style>

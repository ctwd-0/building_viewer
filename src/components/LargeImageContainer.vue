<template>
	<div id="large_image_container" v-show="show">
		<div v-if="photo_array.length" id="main" ref="main_div">
			<p v-bind:style="{paddingTop:p_image_padding_top + 'px', margin: 0}" ref="p_image">
				<img
					ref="image"
					opacity="1"
					v-bind:width="image_width + 'px'"
					v-bind:height="image_height + 'px'"
					v-bind:src="photo_array[index].thumbnail_path"
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
					<i v-if="left_arrow" id="prev" @click="prev_photo()"></i>
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
					<i v-if="right_arrow" id="next" @click="next_photo()"></i>
				</transition>
			</a>
		</div>
		<div id="bottom_bar">
			<label>{{(index+1) + "/" + photo_array.length}}</label>
			<label v-if="!editing">{{text}}</label>
			<textarea v-if="editing" v-model="new_text"></textarea>
			<button v-if="!editing" @click="edit()">修改</button>
			<button v-if="editing" @click="save()">保存</button>
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
			photo_array: [],
			new_text: "",
		};
	},
	methods: {
		main_div_width() {
			return window.innerWidth;
		},

		main_div_height() {
			return window.innerHeight - 118;
		},

		edit() {
			this.new_text = this.text;
			this.editing = true;
		},
		save() {
			this.editing = false;
			this.photo_array[this.index].description = this.new_text;
			$.ajax({
				type: 'POST',
				url: "http://"+json_server+"/file/update_description",
				data: {
					id: this.photo_array[this.index]._id,
					description: this.new_text,
				},
				crossDomain: true,
				success: function( result ) {
					alert("保存成功");
				},
				error: function( err ) {

				},
			});
			this.new_text = "";
		},
		hide() {
			this.show = false;
		},
		prev_photo() {
			this.index--;
			if(this.index < 0) {
				this.index = 0;
			}
		},
		next_photo() {
			this.index++;
			if(this.index >= this.photo_array.length) {
				this.index = this.photo_array.length -1;
			}
		},
		image_size() {
			console.log("image_size")
			let div_width = this.main_div_width()
			let div_height = this.main_div_height()
			let max_height = div_height
			let max_width = div_width - 2*(37 + 20 * 2)
			let ori_width = this.photo_array[this.index].thumbnail_width
			let ori_height = this.photo_array[this.index].thumbnail_height
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
	},

	mounted: function(){
		var _this = this;
		bus.$on("click_photo", function(data) {
			_this.show = true;
			_this.photo_array = data.photo_array;
			_this.index = data.index;
		});
		window.addEventListener("resize", function() {
			bus.$emit("large_image_container_reisize")
		})
		bus.$on("large_image_container_reisize", function() {
			console.log("resize")
			_this.$refs.image.width = _this.image_size().width
			_this.$refs.image.height = _this.image_size().height
			let div_height = _this.main_div_height()
			let image_height = _this.image_size().height
			_this.$refs.p_image.style.paddingTop = ((div_height - image_height) / 2) + 'px'
		})
	},

	computed: {
		text: function() {
			if (this.index < this.photo_array.length) {
				return this.photo_array[this.index].description;
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
		p_image_padding_top() {
			let div_height = this.main_div_height()
			let image_height = this.image_height
			return (div_height - image_height) / 2
		}
	},
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
	background-color: #595959;
	background-image: url(/dist/ui/index_z_394972b.png);
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
	background-image: url(/dist/ui/index_z_394972b.png);
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
	background-image: url(/dist/ui/index_z_394972b.png);
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

</style>

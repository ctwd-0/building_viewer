<template>
	<div class = "outer_div" @drop="drop($event)" @dragover="allow_drop($event)">
		<div class="main_frame" :style="{width:inner_width + 'px', height: inner_height + 'px'}">
			<div class="webgl" :style="{width:webgl_width + 'px', height: webgl_height + 'px'}">
			</div>
			<div class="right" :style="{width:real_right_width + 'px', height: inner_height + 'px'}">
				<div class="right_resize" :style="{height: inner_height + 'px'}" draggable="true" @dragstart="start_drag($event, 'right')">
				</div>
				<div class="right_tab_area" :style="{height: inner_height + 'px'}">
					<label :class="{'right_tab':right_index !== index, 'right_tab_selected': right_index === index}" v-for="(tag, index) in right_tags" @click="right_click(index)">{{tag}}</label>
				</div>
			</div>
			<div class="bottom" :style="{width:webgl_width + 'px', height: real_bottom_height + 'px'}">
				<div class="bottom_resize" :style="{width:webgl_width + 'px'}" draggable="true" @dragstart="start_drag($event, 'bottom')">
				</div>
				<div class="bottom_tab_area" :style="{width:webgl_width + 'px'}">
					<label :class="{'bottom_tab':bottom_index !== index, 'bottom_tab_selected': bottom_index === index}" v-for="(tag, index) in bottom_tags" @click="bottom_click(index)">{{tag}}</label>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import WebglWrapper from './components/WebglWrapper.vue'
import BottomBar from './components/BottomBar.vue'
import RightBar from './components/RightBar.vue'
import LargeImageContainer from './components/LargeImageContainer.vue'
import Editor from './components/Editor.vue'

export default {
	name: 'viewer',
	components: {
		WebglWrapper,
		BottomBar,
		RightBar,
		LargeImageContainer,
		Editor
	},
	data () {
		return {
			inner_width: 1280,
			inner_height: 720,
			right_width: 300,
			real_right_width: 300,
			bottom_height: 240,
			real_bottom_height: 240,
			right_show: true,
			bottom_show: true,
			webgl_width: 980,
			webgl_height: 480,
			button_size: 26,
			last_x: 0,
			last_y: 0,
			dragging: false,
			right_index: 0,
			bottom_index: 0,
			right_tags: ["资料", "工具"],
			bottom_tags: ["数据表", "表头选择"],
		};
	},

	methods: {
		right_click(index) {
			if(this.right_show) {
				if(index === this.right_index) {
					this.right_show = false
					this.right_index = -1
				} else {
					this.right_index = index
				}
			} else {
				this.right_show = true
				this.right_index = index
			}
			this.set_x_according()
		},
		
		bottom_click(index) {
			if(this.bottom_show) {
				if(index === this.bottom_index) {
					this.bottom_show = false
					this.bottom_index = -1
				} else {
					this.bottom_index = index
				}
			} else {
				this.bottom_show = true
				this.bottom_index = index
			}
			this.set_y_according()
		},

		start_drag(event, type) {
			event.dataTransfer.setData("type", type)
			event.dataTransfer.setData("start_X", event.clientX)
			event.dataTransfer.setData("start_Y", event.clientY)
		},

		drop(event) {
			event.preventDefault()
			let type = event.dataTransfer.getData("type")
			let delta = 0
			if (type === "right") {
				delta = event.clientX - event.dataTransfer.getData("start_X")
				this.resize_right(delta)
			} else if(type === "bottom") {
				delta = event.clientY - event.dataTransfer.getData("start_Y")
				this.resize_bottom(delta)
			}
		},

		resize_right(delta) {
			let dest_right_width = this.right_width - delta
			if (dest_right_width > this.inner_width * .5) {
				dest_right_width = this.inner_width * .5
			} else if (dest_right_width < this.inner_width * .1) {
				dest_right_width = this.inner_width * .1
			}
			this.right_width = dest_right_width
			this.set_x_according()
		},

		resize_bottom(delta) {
			let dest_bottom_height = this.bottom_height - delta
			if(dest_bottom_height > this.inner_height * .5) {
				dest_bottom_height = this.inner_height * .5
			} else if (dest_bottom_height < this.inner_height * .1) {
				dest_bottom_height = this.inner_height * .1
			}
			this.bottom_height = dest_bottom_height
			this.set_y_according()
		},

		set_y_according() {
			if (this.bottom_show) {
				this.webgl_height = this.inner_height - this.bottom_height
				this.real_bottom_height = this.bottom_height
			} else {
				this.webgl_height = this.inner_height - this.button_size
				this.real_bottom_height = this.button_size
			}
		},

		set_x_according() {
			if (this.right_show) {
				this.webgl_width = this.inner_width - this.right_width
				this.real_right_width = this.right_width
			} else {
				this.webgl_width = this.inner_width - this.button_size
				this.real_right_width = this.button_size
			}
		},

		allow_drop(event) {
			event.preventDefault()
		},

		calculate_paras_init() {
			this.inner_width = window.innerWidth - 18 < 640 ? 640 : window.innerWidth - 18
			this.inner_height = window.innerHeight - 18 < 480? 480: window.innerHeight - 18
			this.right_width = this.inner_width * .3
			this.bottom_height = this.inner_height * .3
			this.webgl_width = this.inner_width * .7
			this.webgl_height = this.inner_height * .7
			this.set_x_according()
			this.set_y_according()
		},

		calculate_paras() {
			let width_ratio = this.right_width / this.inner_width
			let height_ratio = this.bottom_height / this.inner_height
			this.inner_width = window.innerWidth - 18 < 640 ? 640 : window.innerWidth - 18
			this.inner_height = window.innerHeight - 18 < 480? 480: window.innerHeight - 18
			this.right_width = this.inner_width * width_ratio
			this.bottom_height = this.inner_height * height_ratio
			this.set_x_according()
			this.set_y_according()
		}
	},

	computed: {

	},

	mounted() {
		var _this = this;
		this.calculate_paras_init();
		window.addEventListener("resize", function() {
			bus.$emit("large_image_container_reisize")
			_this.$emit("viewer2_reisize")
		})
		this.$on("viewer2_reisize", function() {
			this.calculate_paras();
		})
	}
}

</script>

<style scoped>

.webgl {
	position: absolute;
	background-color: grey;
	left: 0;
	top: 0;
	margin-left: 3px; 
	margin-top: 3px; 
}
.right_resize {
	position: absolute;
	width: 3px;
	left: 0;
	top: 0;
	background-color: red;
	cursor: e-resize;
}

.bottom_resize {
	position: absolute;
	height: 3px;
	top: 0;
	left: 0;
	background-color: red;
	cursor: s-resize;
}

.right {
	position: absolute;
	background-color: orange;
	right: 0;
	top: 0;
	margin-right: 3px; 
	margin-top: 3px; 
}

.right_tab_area {
	position: absolute;
	background-color: cyan;
	right: 0;
	top: 0;
	width: 26px;
}

.bottom_tab_area {
	position: absolute;
	background-color: green;
	left: 0;
	bottom: 0;
	height: 26px;
}
/*
.right_tab {
	display: inline-block;
	font-size: 17px;
	writing-mode: vertical-lr;
	background-color: black;
	color: white;
	padding: 2px;
}
*/
.right_tab {
	display: inline-block;
	font-size: 17px;
	writing-mode: horizontal-tb;
	background-color: black;
	color: white;
	padding-left: 4px;
	padding-bottom: 2px;
	padding-top: 2px;
}

.bottom_tab {
	display: inline-block;
	font-size: 17px;
	background-color: black;
	writing-mode: horizontal-tb;
	color: white;
	padding: 2px;
}

.right_tab_selected {
	display: inline-block;
	font-size: 17px;
	writing-mode: horizontal-tb;
	background-color: gray;
	color: white;
	padding-left: 4px;
	padding-bottom: 2px;
	padding-top: 2px;
}

.bottom_tab_selected {
	display: inline-block;
	font-size: 17px;
	background-color: gray;
	writing-mode: horizontal-tb;
	color: white;
	padding: 2px;
}
.bottom {
	position: absolute;
	background-color: pink;
	left: 0;
	bottom: 0;
	margin-left: 3px; 
	margin-bottom: 3px;
}

.outer_div {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
}

.main_frame {
	position: relative;
	left: 3px;
	top: 3px;
	padding: 3px;
	border: 3px solid #41719c;
}
</style>

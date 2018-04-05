<template>
	<div class = "outer_div" @drop="drop($event)" @dragover="allow_drop($event)">
		<div class="main_frame" :style="{width:inner_width + 'px', height: inner_height + 'px'}">
			<div class="webgl_reigon" :style="{width:webgl_reigon_width + 'px', height: webgl_reigon_height + 'px'}">
			</div>
			<div class="right_region" :style="{width:right_region_width + 'px', height: inner_height + 'px'}">
				<div class="right_region_resize" :style="{height: inner_height + 'px'}" draggable="true" @dragstart="start_drag($event, 'right')">
				</div>
			</div>
			<div class="bottom_region" :style="{width:webgl_reigon_width + 'px', height: bottom_region_height + 'px'}">
				<div class="bottom_region_resize" :style="{width:webgl_reigon_width + 'px'}" draggable="true" @dragstart="start_drag($event, 'bottom')">
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
			right_region_width: 300,
			bottom_region_height: 240,
			right_reigon_show: true,
			bottom_region_show: true,
			webgl_reigon_width: 980,
			webgl_reigon_height: 480,
			button_size: 20,
			last_x: 0,
			last_y: 0,
			dragging: false,
		};
	},

	methods: {
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
			let dest_right_region_width = this.right_region_width - delta
			if (dest_right_region_width > this.inner_width * .5) {
				dest_right_region_width = this.inner_width * .5
			} else if (dest_right_region_width < this.inner_width * .1) {
				dest_right_region_width = this.inner_width * .1
			}
			this.right_region_width = dest_right_region_width
			this.set_x_according()
		},
		resize_bottom(delta) {
			let dest_bottom_region_height = this.bottom_region_height - delta
			if(dest_bottom_region_height > this.inner_height * .5) {
				dest_bottom_region_height = this.inner_height * .5
			} else if (dest_bottom_region_height < this.inner_height * .1) {
				dest_bottom_region_height = this.inner_height * .1
			}
			this.bottom_region_height = dest_bottom_region_height
			this.set_y_according()
		},
		set_y_according() {
			if (this.bottom_region_show) {
				this.webgl_reigon_height = this.inner_height - this.bottom_region_height
			} else {
				this.webgl_reigon_height = this.inner_height = this.button_size
			}
		},
		set_x_according() {
			if (this.right_reigon_show) {
				this.webgl_reigon_width = this.inner_width - this.right_region_width
			} else {
				this.webgl_reigon_width = this.inner_width - this.button_size
			}
		},
		allow_drop(event) {
			event.preventDefault()
		},
		calculate_paras_init() {
			this.inner_width = window.innerWidth - 18 < 640 ? 640 : window.innerWidth - 18
			this.inner_height = window.innerHeight - 18 < 480? 480: window.innerHeight - 18
			this.right_region_width = this.inner_width * .3
			this.bottom_region_height = this.inner_height * .3
			this.webgl_reigon_width = this.inner_width * .7
			this.webgl_reigon_height = this.inner_height * .7
		},
		calculate_paras() {
			let width_ratio = this.right_region_width / this.inner_width
			let height_ratio = this.bottom_region_height / this.inner_height
			this.inner_width = window.innerWidth - 18 < 640 ? 640 : window.innerWidth - 18
			this.inner_height = window.innerHeight - 18 < 480? 480: window.innerHeight - 18
			this.right_region_width = this.inner_width * width_ratio
			this.bottom_region_height = this.inner_height * height_ratio
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

.webgl_reigon {
	position: absolute;
	background-color: grey;
	left: 0;
	top: 0;
	margin-left: 3px; 
	margin-top: 3px; 
}
.right_region_resize {
	position: absolute;
	width: 3px;
	left: 0;
	top: 0;
	background-color: red;
	cursor: e-resize;
}

.bottom_region_resize {
	position: absolute;
	height: 3px;
	top: 0;
	left: 0;
	background-color: red;
	cursor: s-resize;
}

.right_region {
	position: absolute;
	background-color: orange;
	right: 0;
	top: 0;
	margin-right: 3px; 
	margin-top: 3px; 
}

.bottom_region {
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
	border-style: solid;
	border-color: #41719c;
}
</style>

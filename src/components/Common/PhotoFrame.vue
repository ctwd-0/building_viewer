<template>
	<p class="frame" :style="{width: width + 'px', height: height + 'px'}">
		<img class="image"
			:src="data.thumbnail_path"
			:style="{
				width: image_width() + 'px',
				height: image_height() + 'px', 
				paddingTop: image_padding_top() + 'px',
				paddingLeft: image_padding_left() + 'px'
			}"
			@click="clickPhoto(index)"
		>
		<a 
			v-if="!bar_showing"
			href="javascript:;" class="button_bar" :style="{opacity: 0}"
			@mouseover="bar_showing=true"
		></a>
		<transition name="slide_out">
			<a v-if="bar_showing" href="javascript:;" class="button_bar" @mouseleave="bar_showing=false">
				<a href="javascript:;" class="button_download" title="下载" @click="download_file"></a>
				<a v-if="data.type === 'pdf'" href="javascript:;" class="button_preview" title="预览" @click="preview_pdf"></a>
				<a href="javascript:;" class="button_delete" title="删除" @click="delete_file"></a>
			</a>
		</transition>
	</p>
</template>

<script>
export default {
	name: 'direct',
	components: {
	},
	props: {
		data: Object,
		height: Number,
		width: Number,
		index: Number,
		clickPhoto: Function,
	},
	data () {
		return {
			bar_showing: false,
			bar_opacity: 0,
		};
	},
	methods: {
		//下载文件
		download_file() {
			var url = json_server+"/file/download";
			var form = $("<form></form>").attr("action", url).attr("method", "post");
			form.append($("<input></input>").attr("type", "hidden").attr("name", "id").attr("value", this.data._id));
			form.appendTo('body').submit().remove();
		},
		
		//删除文件
		delete_file() {
			var _this = this;
			$.ajax({
				type: 'POST',
				url: json_server+"/file/remove",
				data: {
					id: this.data._id
				},
				success: function( result ) {
					if(result.success) {
						bus.$emit("single_file_removed", _this.index, _this.data._id)
					} else {
						alert(result.reason)
					}
				},
			});
		},

		//预览pdf
		preview_pdf() {
			if(this.data.type == "pdf") {
				window.open("/dist/pdf/viewer.html?file=" + this.data.original_path)
			}
		},

		//计算图片显示尺寸
		image_size() {
			let max_width = this.width
			let max_height = this.height
			let ori_width = this.data.thumbnail_width
			let ori_height = this.data.thumbnail_height
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

		//计算图片显示宽度
		image_width() {
			return this.image_size().width
		},

		//计算图片显示高度
		image_height() {
			return this.image_size().height
		},

		image_padding() {

		},

		//计算图片左侧偏移量
		image_padding_left() {
			let max_width = this.width
			let image_width = this.image_width()
			if (image_width >= max_width) {
				return 0
			} else {
				return (max_width - image_width) / 2;
			}
		},

		//计算图片顶部偏移量
		image_padding_top() {
			let max_height = this.height
			let image_height = this.image_height()
			if (image_height >= max_height) {
				return 0
			} else {
				return (max_height - image_height) / 2;
			}
		}
	},
}
</script>

<style scoped>
.frame {
	position: relative;
	border: 1px solid white;
	margin-left: auto;
	margin-right: auto;
	margin-top: 4px;
	margin-bottom: 4px;
	overflow: hidden;
}
.image {

}
.button_bar {
	position: absolute;
	display: block;
	width: 46px;
	height: 100%;
	background-color: rgba(0,0,0,.4);
	top: 0;
	right: 0;
}
.button_download {
	display: block;
	margin: auto;
	background-image: url(/dist/ui/btns.png);
	background-position: -497px -162px;
	filter: invert(1);
	width: 40px;
	height: 40px;
}
.button_preview {
	display: block;
	margin: auto;
	background-image: url(/dist/ui/btns.png);
	background-position: -997px -80px;
	filter: invert(1);
	width: 40px;
	height: 40px;
}
.button_delete {
	display: block;
	margin: auto;
	background-image: url(/dist/ui/btns.png);
	background-position: -329px -243px;
	filter: invert(1);
	width: 40px;
	height: 40px;
	/*
	bottom: 40px;
	position: absolute;
	*/
}
.slide_out-enter-active {
	transition: all .2s;
}
.slide_out-leave-active {
	transition: all .2s;
}
.slide_out-enter, .slide_out-leave-to {
	transform: translateX(46px);
}
</style>

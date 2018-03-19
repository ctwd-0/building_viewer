<template>
	<div>
		<div id="outer_div">
			<WebglWrapper/>
			<BottomBar/>
			<RightBar/>
		</div>
		<LargeImageContainer/>
		<Editor/>
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
			
		};
	},

	methods: {
		filter_by(index) {
			this.fe.show = false;
			if(current_model !== 'g_-1') {
				alert('暂时只支持在顶层过滤');
				return ;
			}
			var name_index = -1;
			for(var i = 0; i < this.tb.hds.length; i++) {
				if(this.tb.hds[i] === '构件编号') {
					name_index = i;
					break;
				}
			}
			if(name_index === -1) {
				alert('找不到编号列，请检查');
			// } else if(name_index === index) {
			// 	alert('请不要按编号过滤');
			} else{
				var data = {};
				var color_index = 0;
				this.fe.cts.splice(0,this.fe.cts.length);
				for(var i = 0; i < this.tb.cts.length; i++) {
					var type = this.tb.cts[i][index];
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
					data[type].names.push(this.tb.cts[i][name_index]);
				}
				var max_len = 0;
				for(var type in data) {
					var text = type + ': ' + data[type].names.length + "个";
					if(text.length > max_len) {
						max_len = text.length;
					}
					this.fe.cts.push({
						name:type,
						count:data[type].names.length,
						text: text,
						color:color_toc_ss_string(data[type].color ),
					});
				}
				this.fe.width = max_len * 18 + 10;
				triger_filter_objects(data);
				this.fe.show = true;
			}
		},
	},

	computed: {

	},

	mounted() {
		_viewer = this;
		$.ajax({
			type: 'POST',
			url: "http://"+json_server+"/polls/init",
			data: {
				username: "admin",
				password: "gugong",
			},
			crossDomain: true,
			success: function( result ) {
				cache_header = result['header'];
				cache_content = result['content'];
				cut_data(result['header'], result['content']);
				bus.$emit("set_up_tb_data", result['header'],result['content']);
			},
		});

		$.ajax({
			type: 'POST',
			url: "http://"+json_server+"/polls/getImage",
			data: {
				username: "admin",
				password: "gugong",
				model_id: model_id,
				cat_index: 0,
			},
			crossDomain: true,
			success: function( result ) {

				var content_array = []

				for (var i in result['content']) {
					content_array.push({
						key:i,
						src: fix_absolute_uri(result['content'][i]),
					});
				}
				bus.$emit("photo_array", content_array);
			},
		});
	}
}

</script>

<style scoped>

#outer_div {
	margin-left: auto;
	margin-right: auto;
	border-width: 3px;
	width: 1280px;
	height: 720px;
	border-style: solid;
	border-color: #41719c;
	position: relative;
}

.clear {
	clear: both;
}

</style>
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

	},

	computed: {

	},

	mounted() {
		$.ajax({
			type: 'GET',
			url: "http://"+json_server+"/table/init",
			crossDomain: true,
			success: function( result ) {
				let header = result['header'];
				let content = result['content'];
				cut_data(header, content);
				bus.$emit("new_table_content_arrive", {
					header:header,
					content:content,
				});
			},
		});

		$.ajax({
			type: 'GET',
			url: "http://"+json_server+"/image/get_image",
			data: {
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
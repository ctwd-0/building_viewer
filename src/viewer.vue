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
				cut_data(header);
				bus.$emit("new_table_content_arrive", {
					header: header,
					content: result.content,
					ids: result.ids,
				});
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
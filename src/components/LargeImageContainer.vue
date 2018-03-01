<template>
	<div id="large_image_container" v-show="li.show">
		<div 
			id="large_image_scroll"
			v-on:click="on_image_click()"
		>
			<img 
				class="large_image"
				v-bind:src="li.src"
				v-on:click="on_image_click()"
			>
		</div>
	</div>
</template>

<script>
export default {
	name: 'large_image_container',
	components: {
	},
	data () {
		return {
			li: {
				show:false,
				src:"dist/images/g_-1/drawings/1.thumbnail.jpg",
			},
		};
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
	background-color: rgba(0,0,0,.1);
	z-index: 10001;
}

#large_image_scroll {
	overflow: auto;
	height: 100%;
	text-align: center;
}
.large_image {
	width: 1024px;
}
</style>
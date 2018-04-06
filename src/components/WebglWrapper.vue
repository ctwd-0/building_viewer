<template>
	<div class="webgl_wrapper" :style="{height: height + 'px', width: width+ 'px'}">
		<div id="webgl">
		</div>
		<FilterExample/>
	</div>
</template>
	
<script>
import FilterExample from './WebglWrapper/FilterExample.vue'

export default {
	name: 'webgl_wrapper',
	components: {
		FilterExample,
	},
	props:{
		width:Number,
		height:Number,
	},
	data () {
		return {
		};
	},
	methods: {
	},
}
</script>

<style scoped>
.webgl_wrapper{
	position: absolute;
}

#webgl {
	background-color: black;
	width: 100%;
	height: 100%;
}
</style>

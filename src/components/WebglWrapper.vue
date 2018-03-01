<template>
	<div id="webgl_wrapper">
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
	data () {
		return {
		};
	},
	methods: {
	},
}
</script>

<style scoped>
#webgl_wrapper{
	position: absolute;
	margin-top: 10px;
	margin-left: 10px;
	margin-right: 10px;
	margin-bottom: 10px;
	width: 75%;
	height: 75%;
	border: 1px solid black;
}

#webgl {
	background-color: black;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;

}
</style>
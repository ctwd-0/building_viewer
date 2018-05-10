<template>
	<div class="tools" :style="{height:height + 'px', width: (innerWidth) + 'px'}">
		<Selector2 :width="innerWidth"/>
		<Direct :width="innerWidth"/>
	</div>
</template>

<script>
//右边栏工具栏
import Selector2 from './Selector2.vue'
import Direct from './Direct.vue'

export default {
	name: 'tools',
	components: {
		Selector2,
		Direct,
	},
	props:{
		width: Number,
		height: Number,
		rightWidth: Number,
		leftWidth: Number,
	},
	data () {
		return {
			innerWidth: 300,
		};
	},
	methods: {

	},
	mounted: function() {
		this.innerWidth = this.width - this.rightWidth - this.leftWidth;
	},
	watch: {
		width(val, old) {
			this.innerWidth = this.width - this.rightWidth - this.leftWidth;
		}
	},
}
</script>

<style scoped>
.tools {
	position: absolute;
}
</style>

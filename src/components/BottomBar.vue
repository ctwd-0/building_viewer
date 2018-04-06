<template>
	<div class="bottom_bar">
		<HeaderSelector/>
		<BottomTable/>
		<div id="table_comment">
		</div>
	</div>
</template>

<script>
import HeaderSelector from './BottomBar/HeaderSelector.vue'
import BottomTable from './BottomBar/BottomTable.vue'
import TableMenu from './BottomBar/TableMenu.vue'

export default {
	name: 'bottom_bar',
	components: {
		HeaderSelector,
		BottomTable,
		TableMenu,
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

.bottom_bar {
	position: absolute;
	width: 75%;
	height: 20%;
	border: 1px solid rgb(65,113,156);
	left: 10px;
	bottom: 10px;
	overflow-y: auto;
	overflow-x: auto;
	padding-top: 2px;
	padding-left: 5px;
}
</style>
<template>
	<div
		id="table_menu"
		v-show="mn.show"
		v-bind:style="{left: mn.left + 'px'}"
	>
		<div
			class="table_menu_button"
			v-for="(text, index) in mn.btns"
			v-on:click="on_table_menu_button(index)"
		>
			{{text}}
		</div>
	</div>
</template>

<script>
export default {
	name: 'table_menu',
	components: {
	},
	data () {
		return {
			mn: {
				show:false,
				left:0,
				index:0,
				btns:["递增排序", "递减排序", "过滤此列"],
			},
		};
	},
}
</script>

<style scoped>
#table_menu {
	position: absolute;
	background-color: white;
	display: inline-block;
	top: 21px;
	width: 80px;
	box-shadow:2px 2px 3px #aaaaaa
}

.table_menu_button {
	background-color: rgb(222,235,247);
	font-size: 16px;
	top: 21px;
	margin: 3px;
	text-align: center;
}

</style>
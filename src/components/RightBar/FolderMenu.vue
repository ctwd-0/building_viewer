<template>
	<div
		id="table_menu"
		v-show="show"
		v-bind:style="{left: left + 'px', top: top + 'px'}"
	>
		<div
			class="table_menu_button"
			v-for="(text, idx) in btns"
			v-on:click="on_table_menu_button(idx)"
		>
			{{text}}
		</div>
	</div>
</template>

<script>
export default {
	name: 'folder_menu',
	components: {
	},
	methods: {
		on_table_menu_button(idx) {
			this.show = false;
			if(idx === 0) {
				//"重命名"
				bus.$emit("folder_rename", this.index);
			} else if(idx === 1) {
				//"删除并移动"
				bus.$emit("folder_remove", this.index);
			}
		},
	},
	data () {
		return {
			show: false,
			left: 0,
			top: 0,
			index:0,
			btns:["重命名", "删除并移动"],
		};
	},

	created:function() {
		var _this = this;

		//显示菜单
		bus.$on("show_folder_menu", function(event, index) {
			bus.$emit("hide_table_menu");
			_this.show = true;
			_this.index = index;
			_this.left = event.layerX + 16;
			_this.top = event.layerY;
		});

		//关闭菜单
		bus.$on("hide_folder_menu", function() {
			_this.show = false;
		});
	}
}
</script>

<style scoped>
#table_menu {
	position: absolute;
	background-color: white;
	display: inline-block;
	top: 31px;
	width: 100px;
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
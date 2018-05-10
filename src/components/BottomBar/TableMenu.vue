<template>
	<div
		id="table_menu"
		v-show="show"
		v-bind:style="{left: left + 'px', top : top + 'px'}"
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
	name: 'table_menu',
	components: {
	},
	methods: {
		on_table_menu_button(idx) {
			this.show = false;
			if(idx === 0) {
				//"递增排序"
				bus.$emit("sort_table_asc", this.index);
			} else if(idx === 1) {
				//"递减排序"
				bus.$emit("sort_table_desc", this.index);
			} else if(idx === 2) {
				//"过滤此列"
				//this.filter_by(this.index);
				bus.$emit("filter_by", this.index);
			} else if (idx === 3) {
				//"重命名列"
				bus.$emit("rename_column", this.index);
			} else if (idx === 4) {
				//"删除此列"
				bus.$emit("remove_column", this.index);
			}
		},
	},
	data () {
		return {
			show:false,
			left:0,
			index:0,
			btns:["递增排序", "递减排序", "过滤此列", "重命名列", "删除此列"],
		};
	},

	created:function() {
		var _this = this;

		//打开菜单
		bus.$on("show_table_menu", function(event, index) {
			bus.$emit("hide_folder_menu");
			_this.show = true;
			_this.index = index;
			_this.left = event.layerX + 4;
			_this.top = event.layerY + 4;
		});

		//关闭菜单
		bus.$on("hide_table_menu", function() {
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
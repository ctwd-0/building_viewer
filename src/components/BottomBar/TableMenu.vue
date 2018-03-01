<template>
	<div
		id="table_menu"
		v-show="show"
		v-bind:style="{left: left + 'px'}"
	>
		<div
			class="table_menu_button"
			v-for="(text, index) in btns"
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
	methods: {
		on_table_menu_button(index) {
			this.show = false;
			if(index === 0) {
				//"递增排序"
				bus.$emit("sort_table_asc", this.index);
			} else if(index === 1) {
				//"递减排序"
				bus.$emit("sort_table_desc", this.index);
			} else if(index === 2) {
				//"过滤此列"
				//this.filter_by(this.index);
				bus.$emit("filter_by", this.index);
			}
		},
	},
	data () {
		return {
			show:false,
			left:0,
			index:0,
			btns:["递增排序", "递减排序", "过滤此列"],
		};
	},

	created:function() {
		var _this = this;
		bus.$on("open_menu", function(left, index) {
			if(_this.show === true && _this.index === index ) {
				_this.show = false;
			} else {
				_this.show = true;
				_this.index = index;
				_this.left = left;
			}
		});
	}
}
</script>

<style scoped>
#table_menu {
	position: absolute;
	background-color: white;
	display: inline-block;
	top: 64px;
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
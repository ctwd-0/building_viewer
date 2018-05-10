<template>
	<div 
		id="filter_example"
		v-bind:style="{'width': width + 'px'}"
		v-show="show"
	>
		<div
			id="filter_example_hide_scroll"
			v-bind:style="{'width': (width + 18) + 'px'}"
		>
			<div 
				class="filter_example_line"
				v-for="(example, index) in contents"
			>
				<label
					class="filter_example_block"
					v-bind:style="{'background-color': example.color}"
				>
				</label>
				<label class="filter_example_name">
					{{example.text}}
				</label>

			</div>
			<div
				id="filter_example_cancel"
				v-on:click="on_cancel_filter()"	
			>
				取消过滤
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'filter_example',
	data () {
		return {
			show:false,
			contents:[],
			width:0,
		};
	},
	methods: {
		//取消过滤
		on_cancel_filter(from_mesh) {
			this.show = false;
			if(from_mesh !== true) {
				triger_clear_filter_data();
			}
		},
	},
	created: function() {
		var _this = this;
		//取消过滤
		bus.$on("cancel_filter", function(from_mesh) {
			_this.on_cancel_filter(from_mesh);
		});

		//显示过滤
		bus.$on("show_filter_example", function(width, contents) {
			_this.show = true;
			_this.width = width;
			_this.contents = contents;
		});
	}
}
</script>

<style scoped>
#filter_example {
	position: absolute;
	left: 0;
	bottom: 0;
	background-color: transparent; 
	padding-left: 15px;
	padding-bottom: 15px;
	overflow-y: auto;
	overflow-x: hidden;
}

#filter_example_hide_scroll {
	max-height: 450px;
	overflow-x: hidden;
}

.filter_example_line {

}
.filter_example_name {
	color: white;
	font-size: 18px;
}

.filter_example_block {
	display: inline-block;
	width: 18px;
	height: 18px;
	border: 1px solid white;
}

#filter_example_cancel {
	color: white;
	margin-left: 24px;
	font-size: 18px;
	text-align: left;
}

</style>
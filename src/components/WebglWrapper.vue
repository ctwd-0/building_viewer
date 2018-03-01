<template>
	<div id="webgl_wrapper">
		<div id="webgl">
		</div>
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
	</div>
</template>
	
<script>
export default {
	name: 'webgl_wrapper',
	data () {
		return {
			show:false,
			contents:[],
			width:0,
		};
	},
	methods: {
		on_cancel_filter() {
			this.fe.show = false;
			triger_clear_filter_data();
		},
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

#webgl {
	background-color: black;
	width: 100%;
	height: 100%;
	margin: 0;
	padding: 0;

}

</style>
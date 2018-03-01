<template>
	<div 
		id="table_header"
		v-bind:style="{width : tb.sum_tb_wdh + 'px'}"
	>
		<div 
			class="table_header"
			v-bind:style="{width : tb.wdh[index] + 'px'}"
			v-for="(hd, index) in tb.hds"
		>
			<label
				class="table_header_label"
				v-bind:style="{width : tb.wdh[index] - 23 + 'px'}"
			>
				{{hd}}
			</label>
			<button
				class="table_header_button"
				v-on:click="on_table_header_button(index)"
			>
			</button>
		</div>
	</div>
</template>

<script>
export default {
	name: 'table_header',
	components: {
	},
	data () {
		return {
			tb:{
				wdh:[120,100,100,100,120,100,170,100],
				sum_tb_wdh: 940,
				hds:["编号","构件类别","材质","保存状况","病害类型","材质类别","轴网位置/原图编号","干预情况"],
				// wdh:[],
				// hds:[],
				// cts:[],
				// sum_tb_wdh: 0,
				// hds:0,
				// cts:0,
			},
		};
	},
}
</script>

<style scoped>
.table_header {
	background-color: rgb(222,235,247);
	display: inline-block;
	height: 20px;
	margin: 1px;
}

.table_header_label {
	background-color: rgb(222,235,247);
	display: inline-block;
	height: 20px;
}

.table_header_button {
	display: inline-block;
	width: 17px;
	height: 17px;
	background:url(../../assets/drop_down.png);
	border:0;
}
</style>
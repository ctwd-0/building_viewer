<template>
	<div id="table_content">
		<div 
			class="table_line"
			v-bind:style="{width : tb.sum_tb_wdh + 'px'}"
			v-for="(line, line_no) in tb.cts"
		>
			<label 
				class="table_blcok" 
				v-bind:style="{width : tb.wdh[index] + 'px'}"
				v-for="(field, index) in line"
			>
				{{field}}
			</label>
		</div>
	</div>
</template>

<script>
export default {
	name: 'table_content',
	components: {
	},
	data () {
		return {
			tb:{
				wdh:[120,100,100,100,120,100,170,100],
				cts:[
					["TFK-02-12-01","柱","铸钢","一般","表面锈蚀","钢","D3D4之间","未干预"],
					["TFK-02-12-02","梁","铸钢","病害轻微","断裂","钢","D3D4之间","加固/修补"],
					["TFK-02-12-03","板","轧钢","病害轻微","表面锈蚀、断裂","钢","D4E4之间","除锈"],
					["TFK-01-12-01","梁","铸钢","病害严重","变形、位移","钢","B3B4之间","更换"],
					["DCC-04-12-01","梁","铸钢","病害严重","变形、位移","钢","C3C4之间","更换"],
					["DCC-02-12-01","板","轧钢","病害严重","缺失","钢","C3C4之间","新加"],
				],
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
.table_blcok {
	background-color: rgb(222,235,247);
	display: inline-block;
	height: 20px;
	margin: 1px;
}
</style>
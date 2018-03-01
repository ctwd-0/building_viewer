<template>
	<div id="photos">
		<div id="photo_tab_header">
			<ul>
				<li
					v-for="(item, index) in photo_tag_array"
					v-bind:item="item"
					v-bind:index="index"
					v-bind:key="item.key"
					v-bind:class="{photo_selected:item.sel, photo_not_selected:!item.sel}"
					v-on:click="change_photo_sel(index)"
				>{{item.text}}</li>
			</ul>
		</div>
		<div id="photo_tab_content">
			<div id="photo_content">
				<img
					class="single_photo"
					v-for="(item, index) in photo_array"
					v-bind:item="item"
					v-bind:index="index"
					v-bind:key="item.key"
					v-on:click="click_photo(index)"
					v-bind:src="item.src">
			</div>
		</div>
	</div>
</template>
<script>
export default {
	name: 'phtots',
	components: {
	},
	data () {
		return {
			photo_sel: 0,
			photo_tag_array:[{
				key:0,
				text:"图纸",
				sel:true,
			},{
				key:1,
				text:"照片",
				sel:false,
			},{
				key:2,
				text:"正射影像",
				sel:false,
			}],
			photo_array:[{
				key:0,
				src:"dist/images/g_-1/drawings/1.thumbnail.jpg",
			},{
				key:1,
				src:"dist/images/g_-1/drawings/2.thumbnail.jpg",
			}],
		};
	},
	methods: {

	},
}
</script>

<style scoped>
ul {
	list-style: none;
	padding: 0;
	margin: 0;
}
#photos {

}

#photo_tab_header {
	width: 266px;
	height: 26px;
	margin: auto;
}

#photo_tab_content {
	margin: auto;
	width: 264px;
	height: 376px;
	background-color: rgb(222,235,247);
	border-right: 1px solid rgb(65,113,156);
	border-bottom: 1px solid rgb(65,113,156);
	border-left: 1px solid rgb(65,113,156);
	overflow-y: scroll;
}

#photo_content {

}

.single_photo {
	width: 236px;
	height: 178px;
	margin: 5px;
}

.photo_selected {
	float: left;
	background-color: rgb(222,235,247);
	font-size: 20px;
	width: 88px;
	line-height: 25px;
	text-align: center;
	border-right: 1px solid rgb(65,113,156);
	border-top: 1px solid rgb(65,113,156);
	border-left: 1px solid rgb(65,113,156);
	color: rgb(132,60,12);
}

.photo_not_selected {
	float: left;
	background-color: rgb(189,215,238);
	width: 88px;
	font-size: 20px;
	line-height: 25px;
	text-align: center;
	border-bottom: 1px solid rgb(65,113,156);
}
</style>
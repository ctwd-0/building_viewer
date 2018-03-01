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
			model_id: 'g_-1',
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
		click_photo(index) {
			bus.$emit("click_photo", this.photo_array[index].src);
			//this.li.show = true;
			//this.li.src = this.photo_array[index].src;
		},
		change_photo_sel(index) {
			this.photo_sel = index;
			for(var item in this.photo_tag_array) {
				this.photo_tag_array[item].sel = false;
			}
			this.photo_tag_array[index].sel = true;

			var _this = this;
			$.ajax({
				type: 'POST',
				url: "http://localhost:8000/polls/getImage",
				data: {
					username: "admin",
					password: "gugong",
					model_id: model_id,
					cat_index: index,
				},
				crossDomain: true,
				success: function( result ) {
					var content_array = []
					for (var i in result['content']) {

						content_array.push({
							key:i,
							src: fix_absolute_uri(result['content'][i]),
						});
					}
					_this.photo_array = content_array;
				},
			});
		},
	},
	created:function() {
		var _this = this;
		bus.$on("photo_array", function(photo_array) {
			_this.photo_array = photo_array;
		});

		bus.$on("change_photo", function(m_id){
			if(m_id !== 'g_-1' && m_id !== 'g_7' && m_id !== 'o') {
				return;
			}

			if(m_id == model_id) {
				return;
			} else {
				model_id = m_id;
				$.ajax({
					type: 'POST',
					url: "http://localhost:8000/polls/getImage",
					data: {
						username: "admin",
						password: "gugong",
						model_id: model_id,
						cat_index: this.photo_sel,
					},
					crossDomain: true,
					success: function( result ) {
						var content_array = []
						for (var i in result['content']) {
							content_array.push({
								key:i,
								src: fix_absolute_uri(result['content'][i]),
							});
						}
						_this.photo_array = content_array;
					},
				});
			}
		});
	}
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
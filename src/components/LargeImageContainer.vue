<template>
	<div id="large_image_container" v-show="show">
		<div id="top_bar">
		</div>
		<div v-if="photo_array.length" id="main" v-on:click="change($event)">
			<img
				opacity="1"
				height="720px"
				v-bind:src="photo_array[index].src"
			>
		</div>
		<div id="bottom_bar">
			<label>{{(index+1) + "/" + photo_array.length}}</label>
			<label v-if="!editing">{{text}}</label>
			<textarea v-if="editing" v-model="text"></textarea>
			<button v-if="!editing" @click="edit()">修改</button>
			<button v-if="editing" @click="save()">保存</button>
		</div>
		<div id="quit" @click="hide()">
		</div>
		<div id="prev" @click="prev_photo()">
		</div>
		<div id="next" @click="next_photo()">
		</div>
	</div>
</template>

<script>
export default {
	name: 'large_image_container',
	components: {
	},
	data () {
		return {
			show:false,
			editing:false,
			index: 0,
			photo_array:[],
			text:"这是简介",
		};
	},
	methods: {
		edit() {
			this.editing = true;
		},
		save() {
			this.editing = false;
		},
		change(e) {
			console.log(e);
			let x = e.offsetX;
			console.log(x);
			console.log(e.target.clientWidth);
			if(x > e.target.clientWidth / 2) {
				this.next_photo();
			} else {
				this.prev_photo();
			}
		},
		hide() {
			this.show = false;
		},
		prev_photo() {
			this.index--;
			if(this.index < 0) {
				this.index = 0;
			}
		},
		next_photo() {
			this.index++;
			if(this.index >= this.photo_array.length) {
				this.index = this.photo_array.length -1;
			}
		}
	},
	created: function(){
		var _this = this;
		bus.$on("click_photo", function(data) {
			_this.show = true;
			_this.photo_array = data.photo_array;
			_this.index = data.index;
		});
	},
}
</script>

<style scoped>
#large_image_container {
	position: fixed;
	top:0;
	bottom:0;
	left:0;
	right:0;
	background-color: rgba(0,0,0,.1);
	z-index: 10001;
}

#top_bar{
	height: 8px;
	/*background-color: green;
	opacity: .2;*/
}

#bottom_bar {
	bottom: 0;
	height: 50px;
	width: 1024px;
	margin: 0 auto;
	background-color: #ffe;
	border: 1px solid black;
	opacity: .9;
}

#main {
	margin: 0 auto;
	border: 1px solid black;
	background-color: grey;
	padding: 2px;
	width: 1024px;
}

#quit {
	position: fixed;
	background-color: red;
	width: 80px;
	height: 80px;
	right: 8px;
	top: 8px;
}
#prev {
	position: fixed;
	background-color: green;
	width: 80px;
	height: 80px;
	left: 8px;
	top: 200px;
}

#next {
	position: fixed;
	background-color: blue;
	width: 80px;
	height: 80px;
	right: 8px;
	top: 200px;
}
</style>
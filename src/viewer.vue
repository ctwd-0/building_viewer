<template>
	<div>
		<div id="outer_div">
			<WebglWrapper/>
			<BottomBar/>
			<RightBar/>
		</div>
		<LargeImageContainer/>
	</div>
</template>

<script>

import WebglWrapper from './components/WebglWrapper.vue'
import BottomBar from './components/BottomBar.vue'
import RightBar from './components/RightBar.vue'
import LargeImageContainer from './components/LargeImageContainer.vue'

export default {
	name: 'viewer',
	components: {
		WebglWrapper,
		BottomBar,
		RightBar,
		LargeImageContainer
	},
	data () {
		return {
			model_id: 'g_-1',
			header:[],
			content:[],
		};
	},

	methods: {
		on_table_selector_change(index) {
			this.table_filter.current_index = index;
		},
		
		on_table_meta_change(index) {
			var i = this.table_filter.current_index;
			this.table_filter.all_headers[i][index].checked = !this.table_filter.all_headers[i][index].checked;
		},

		change_sel(index) {
			this.sel = index;
			for(var item in this.sel_array) {
				this.sel_array[item].sel = false;
			}
			this.sel_array[index].sel = true;
			var idx = -1;
			for(var i= 0; i < this.tb.hds.length; i++) {
				if(this.tb.hds[i] === this.sel_array[index].text) {
					idx = i;
					break;
				}
			}
			if(idx !== -1) {
				this.filter_by(idx);
			}
		},

		change_photo_sel(index) {
			this.photo_sel = index;
			for(var item in this.photo_tag_array) {
				this.photo_tag_array[item].sel = false;
			}
			this.photo_tag_array[index].sel = true;

			var pparent = this;
			$.ajax({
				type: 'POST',
				url: "http://localhost:8000/polls/getImage",
				data: {
					username: "admin",
					password: "gugong",
					"model_id": this.model_id,
					"cat_index": index,
				},
				crossDomain: true,
				success: function( result ) {
					var content_array = []
					for (var i in result['content']) {

						content_array.push({
							key:i,
							src: pparent.fix_absolute_uri(result['content'][i]),
						});
					}
					pparent.photo_array = content_array;
				},
			});
		},

		change_photo(model_id) {
			if(model_id !== 'g_-1' && model_id !== 'g_7' && model_id !== 'o') {
				return;
			}

			if(model_id == this.model_id) {
				return;
			} else {
				this.model_id = model_id;
				var pparent = this;
				$.ajax({
					type: 'POST',
					url: "http://localhost:8000/polls/getImage",
					data: {
						username: "admin",
						password: "gugong",
						"model_id": this.model_id,
						"cat_index": this.photo_sel,
					},
					crossDomain: true,
					success: function( result ) {
						var content_array = []
						for (var i in result['content']) {
							content_array.push({
								key:i,
								src: pparent.fix_absolute_uri(result['content'][i]),
							});
						}
						pparent.photo_array = content_array;
					},
				});
			}
		},

		click_photo(index) {
			this.li.show = true;
			this.li.src = this.photo_array[index].src;
		},
		
		on_image_click() {
			this.li.show = false;
		},

		on_table_header_button(index) {
			if(this.mn.show === true && this.mn.index === index ) {
				this.mn.show = false;
			} else {
				this.mn.show = true;
				this.mn.index = index;
				this.mn.left = 5;
				for(var i = 0; i <= this.mn.index; i++) {
					this.mn.left += this.tb.wdh[i] + 2;
				}
				this.mn.left -= 2;
				this.mn.left -= 80;
			}
		},

		on_table_menu_button(index) {
			this.mn.show = false;
			if(index === 0) {
				//"递增排序"
				this.tb.cts.sort(this.sort_asc_index);
			} else if(index === 1) {
				//"递减排序"
				this.tb.cts.sort(this.sort_desc_index);
			} else if(index === 2) {
				//"过滤此列"
				this.filter_by(this.mn.index);
			}
		},

		sort_asc_index(a, b) {
			var x = a[this.mn.index];
			var y = b[this.mn.index];
			if(x === y) {
				return 0;
			} else if(x > y) {
				return 1;
			} else {
				return -1;
			}
		},

		sort_desc_index(a, b) {
			var x = a[this.mn.index];
			var y = b[this.mn.index];
			if(x === y) {
				return 0;
			} else if(x < y) {
				return 1;
			} else {
				return -1;
			}
		},

		filter_by(index) {
			this.fe.show = false;
			if(current_model !== 'g_-1') {
				alert('暂时只支持在顶层过滤');
				return ;
			}
			var name_index = -1;
			for(var i = 0; i < this.tb.hds.length; i++) {
				if(this.tb.hds[i] === '构件编号') {
					name_index = i;
					break;
				}
			}
			if(name_index === -1) {
				alert('找不到编号列，请检查');
			// } else if(name_index === index) {
			// 	alert('请不要按编号过滤');
			} else{
				var data = {};
				var color_index = 0;
				this.fe.cts.splice(0,this.fe.cts.length);
				for(var i = 0; i < this.tb.cts.length; i++) {
					var type = this.tb.cts[i][index];
					if(data[type] === undefined) {
						data[type] = {};
						data[type].names = [];
						if(color_index < _colors.length) {
							data[type].color = _colors[color_index];
							color_index ++;
						} else {
							data[type].color = random_color();
						}
					}
					data[type].names.push(this.tb.cts[i][name_index]);
				}
				var max_len = 0;
				for(var type in data) {
					var text = type + ': ' + data[type].names.length + "个";
					if(text.length > max_len) {
						max_len = text.length;
					}
					this.fe.cts.push({
						name:type,
						count:data[type].names.length,
						text: text,
						color:color_toc_ss_string(data[type].color ),
					});
				}
				this.fe.width = max_len * 18 + 10;
				triger_filter_objects(data);
				this.fe.show = true;
			}
		},

		check_changed() {
			//alert(this.checked_types);	
			this.filter_and_setup_tb_data(this.header, this.content, '材质类别', this.checked_types);
			if(this.fe.show === true) {
				this.on_cancel_filter();
			}
		},
		
		filter_and_setup_tb_data(header, content, key, values) {
			if(values === undefined 
				|| values === null
				|| values.length === 0) {
				this.set_up_tb_data(header, content);
			} else {
				var index = -1;
				for(var i = 0; i < header.length; i++) {
					if(header[i] === key) {
						index = i;
						break;
					}
				}
				if(index === -1) {
					this.set_up_tb_data(header, content);
				} else {
					var filtered_content = [];
					var dict = {};
					for(var i in values) {
						dict[values[i]] = true;
					}
					for(var i in content) {
						if(dict[content[i][index]] === true) {
							filtered_content.push(content[i]);
						}
					}
					this.set_up_tb_data(header, filtered_content);
				}
			}
		},

		cut_data(header, content) {
			for(var i in content) {
				content[i].splice(0,1);
			}
			header.splice(0,1);
			header[0] = '构件编号';

			for(var i in header) {
				if(header[i] === '') {
					header[i] = '-';
				}
			}
			for(var i in content) {
				for(var j in content[i]) {
					if(content[i][j] === '') {
						content[i][j] = '-';
					}
				}
			}
		},

		set_up_tb_data(header, content) {
			var width = [];
			for(var i = 0; i < header.length; i++) {
				width.push(0);
			}

			for(var i = 0; i < header.length; i++) {
				if(header[i].length + 2 > width[i]) {
					width[i] = header[i].length + 2;
				}
				for(var j in content) {
					if(content[j][i].length > width[i]) {
						width[i] = content[j][i].length;
					}
				}
			}

			for(var i in width) {
				width[i] *= 18;
			}
			width[0] /=18;
			width[0] *= 10;

			this.tb.cts = content;
			this.tb.hds = header;
			this.tb.wdh = width;

			var sum = 0;
			for(var i in this.tb.wdh) {
				sum += this.tb.wdh[i];
			}
			sum += this.tb.wdh.length * 3;
			this.tb.sum_tb_wdh = sum;
		},

		fix_absolute_uri(uri) {
			if(uri.charAt(0) === '/' || uri.charAt(0) === '\\' ) {
				return uri.substring(1);
			} else {
				return uri;
			}
		}
	},

	computed: {

	},
	
	mounted() {
		_viewer = this;

		var pparent = this;

		$.ajax({
			type: 'POST',
			url: "http://localhost:8000/polls/init",
			data: {
				username: "admin",
				password: "gugong",
			},
			crossDomain: true,
			success: function( result ) {
				pparent.header = result['header'];
				pparent.content = result['content'];
				pparent.cut_data(result['header'], result['content']);
				pparent.set_up_tb_data(result['header'], result['content']);
				// for (var i in result['content']) {
				// 	result['content'][i].splice(0, 1);
				// }
				// result['header'].splice(0,1);
				// result['header'][0] = '编号'

				// pparent.tb['hds'] = result['header'];
				// pparent.tb['cts'] = result['content'];
			},
		});

		$.ajax({
			type: 'POST',
			url: "http://localhost:8000/polls/getImage",
			data: {
				username: "admin",
				password: "gugong",
				"model_id": this.model_id,
			},
			crossDomain: true,
			success: function( result ) {

				//var header_array = []
				var content_array = []
				// for (var i in result['header']) {
				// 	header_array.push({
				// 		key:i,
				// 		text:result['header'][i],
				// 		sel:i == 0,
				// 	});
				// }

				for (var i in result['content']) {
					content_array.push({
						key:i,
						src: pparent.fix_absolute_uri(result['content'][i]),
					});
				}
				//pparent.photo_tag_array = header_array;
				pparent.photo_array = content_array;
			},
		});
	}
}

</script>

<style scoped>

#outer_div {
	margin-left: auto;
	margin-right: auto;
	border-width: 3px;
	width: 1280px;
	height: 720px;
	border-style: solid;
	border-color: #41719c;
	position: relative;
}

.clear {
	clear: both;
}

</style>
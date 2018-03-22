<template>
	<div>
		<VSelect
			ref="v-select"
			maxHeight="200px"
			:search="value"
			:options="options"
			:clearSearchOnSelect="false"
			@updatesearch="update_search($event)"
			@clickon="click_on($event)"
		>
		</VSelect>
	</div>
</template>

<script>
import VSelect from './VSelect.vue'
export default {
	name: 'select_input',
	components: {
		VSelect,
	},
	props: {
		value: String,
		options: Array,
		width: Number,
		onChange:Function,
	},
	data () {
		return {
		};
	},
	methods: {
		update_search(val) {
			this.$emit('input', val);
		},
		click_on(val) {
			this.$emit("clickon", val);
		}
	},
	
	mounted: function() {

	}
}
</script>

<style>

</style>
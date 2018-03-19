<template>
	<div>
		<VSelect
			ref="v-select"
			maxHeight="200px"
			:search="value"
			:options="options"
			:clearSearchOnSelect="false"
			@updatesearch="update_search($event)"
		>
		</VSelect>
		<input v-model="value">
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
	},
	data () {
		return {
		};
	},
	methods: {
		update_search(val) {
			this.$emit('input', val);
		}
	},
	
	mounted: function() {

	}
}
</script>

<style>

</style>
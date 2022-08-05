<template>
  <input
    class="input-value"
    :checked="this.value"
    @input="(e) => this.handleChange(e.target.checked)"
    type="checkbox"
   />
</template>

<script>
export default {
  name: "prop-check-input",
  props: {
    value: Boolean,
  },
  methods:{
    handleChange(v) {
      this.$emit('propInput', v)
    },
  }
}
</script>

<style scoped>

</style>

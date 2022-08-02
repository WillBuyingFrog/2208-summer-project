<template>
  <div class="grid-input">
    <input :value="this.value[0]" @input="(e) => this.handleChange(e.target.value, 0)" type="number" />
    <input :value="this.value[1]" @input="(e) => this.handleChange(e.target.value, 1)" type="number" />

  </div>
</template>

<script>
export default {
  name: "prop-grid-input",
  props: {
    value: {
      type: Array,
      default: () => [1, 1],
    },
  },
  methods: {
    handleChange(v, index) {
      let value = this.value.slice()
      value[index] = Math.max(1, Math.floor(v))
      this.$emit('input', value)
    },
  }
}
</script>

<style lang="less" scoped>
.grid-input {
  display: inline-flex;
  flex: 1;
  input {
    flex: 1;
    width: 0;
    height: 24px;
    border-radius: 0;
    border: 1px solid #d3d3d3;
    padding-left: 8px;
  }
}
</style>


<template>
  <input class="input-value" :value="this.value" @input="(e) => this.handleChange(e.target.value)" type="number" />

</template>

<script>
export default {
  name: "prop-number-input",
  props: {
    value: Number,
  },
  methods: {
    handleChange(v) {
      console.log("Ready to emit propInput event with " + v)
      this.$emit('propInput', parseInt(v))
    },
  }
}
</script>

<style scoped>

</style>

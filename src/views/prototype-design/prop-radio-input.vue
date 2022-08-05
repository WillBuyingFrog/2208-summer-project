<template>
  <div class="radio-input">
    <label v-for="item in options" :for="this.id + item.value" :key="this.id + item.value">
      <input
          :name="this.id"
          :checked="this.value === item.value"
          @input="(e) => this.handleChange(e.target.value)"
          :id="this.id + item.value"
          type="radio"
          :value="item.value"
      />
      {{item.label}}
    </label>
  </div>
</template>

<script>
export default {
  name: "prop-radio-input",
  props: {
    value: String,
    options: {
      type: Array,
      default: () => [], //{label:string;value:string}
    },
  },
  data() {
    return {
      id:
          'radio-' +
          Math.random()
              .toString()
              .slice(2, 10),
    }
  },
  methods: {
    handleChange(v) {
      this.$emit('propInput', v)
    },
  }
}
</script>

<style lang="less" scoped>
.radio-input {
  display: flex;
  flex: 1;
  justify-content: space-between;
  input {
    vertical-align: middle;
    margin-right: 4px;
  }
}
</style>

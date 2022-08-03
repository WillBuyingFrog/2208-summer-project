<template>
  <div data-plugin="selection" class="plugin-selection">

  </div>
</template>

<script>
export default {
  name: "plugin-selection",
  props: {
    // 从属哪个EditorView（因为可能有container）
    application: Object,
  },
  data() {
    return {
      grid: [1, 1],
      selectedComponents: [],
      selectionTransform: { x: 0, y: 0, width: 0, height: 0, rotation: 0 },
      selectionActive: false,
      selectionHandler: ['tl', 'tr', 'br', 'bl'],
      selectionArea: { x: 0, y: 0, width: 0, height: 0 },
    }
  },
}
</script>

<style scoped>

</style>

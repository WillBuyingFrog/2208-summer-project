<template>
  <div id="editor">

  </div>
</template>

<script>
export default {
  name: "QuillTest2",
  data(){
    return {
      idReady: false,
      quill: null
    }
  },
  mounted(){
    this.$data.quill
  }
}
</script>

<style scoped>

</style>

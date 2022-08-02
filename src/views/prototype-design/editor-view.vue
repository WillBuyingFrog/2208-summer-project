<script>
export default {
  name: "editor-view",
  props:{
    value: Array,
    parentId: String,
    parent: Object
  },
  provide(){
    return {
      // 在子组件中使用inject: ['editorDOM']
      editorDOM: this.$refs.editor
    }
  },
  methods: {

  },

  render(){
    return (
        <div class={`ds-editor ${this.parentId ? 'nest-editor' : 'root-editor'}`}>
          <div class="ds-editor-canvas" ref="editor">
            {
              // TODO: 抄CellWrapperVue
            }
          </div>
        </div>
    )
  }
}
</script>

<style scoped>
.ds-editor{
  color: black;
}
</style>

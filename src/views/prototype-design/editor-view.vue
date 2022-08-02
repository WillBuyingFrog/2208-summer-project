<script>
import {computed} from 'vue'

import PluginDrop from "@/views/prototype-design/plugins/plugin-drop"
import CellWrapper from "@/views/prototype-design/cell-wrapper"

export default {
  name: "editor-view",
  components: {
    PluginDrop
  },
  props:{
    value: Array,
    parentId: String,
    parent: Object
  },
  provide(){
    return {
      // 在子组件中使用inject: ['editorDOM']
      editorDOM: computed(() => this.$refs.editor)
    }
  },
  methods: {

  },

  render(){
    return (
        <div class={`ds-editor ${this.parentId ? 'nest-editor' : 'root-editor'}`}>
          <div class="ds-editor-canvas" ref="editor">
            {
              this.value.map((item) => {
                return <CellWrapper item={item} />
              })
            }
            {/**Inject Plugins here**/}
            {this.$slots.default}
            <PluginDrop parentId={this.parentId} length={this.value.length}/>
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

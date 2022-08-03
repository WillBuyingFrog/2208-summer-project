<template>
  <QuillEditor theme="snow" @ready="(quill) => this.createQuillBinding(quill)" />
</template>

<script>

import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import {handleQuillBinding} from "@/components/scripts/collaborate-text";


export default {
  name: "QuillTest",
  data(){
    return {
      isReady: false
    }
  },
  components: {
    QuillEditor
  },
  methods: {
    createQuillBinding(quill){
      handleQuillBinding(quill)
      this.isReady = true
    }
  }
}
</script>

<style scoped>

</style>

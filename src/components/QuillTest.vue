<template>
  <el-container class="inner-container">
    <el-aside width="100px" class="leftPane">
      <el-button type="primary" @click="() => this.exportQuillDelta()">
        保存文件
      </el-button>
      <p class="online-users">在线成员</p>
      <div>
        <el-avatar :size="50" class="icon"> user </el-avatar>
      </div>
      <div>
        <el-avatar :size="50" class="icon"> user </el-avatar>
      </div>
      <div>
        <el-avatar :size="50" class="icon"> user </el-avatar>
      </div>
    </el-aside>
    <el-main class="rightPane">
      <div class="editor">
        <QuillEditor class="quill-editor"
                     :options="editorOption"
                     v-model:content="this.delta"
                     @ready="(quill) => this.createQuillBinding(quill)"
        >
        </QuillEditor>
      </div>
    </el-main>
  </el-container>
<!--  <div class="out-div">-->
<!--    <div class="inner-div">-->

<!--    </div>-->
<!--  </div>-->
</template>
<script>
import { defineComponent } from 'vue'
import { QuillEditor } from '@vueup/vue-quill'
import QuillCursors from 'quill-cursors'
import {handleQuillBinding} from "@/components/scripts/collaborate-text";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import * as Quill from "quill";

//字体样式
var fonts = [
    "SimSun",
    "SimHei",
    "Microsoft-YaHei",
    "KaiTi",
    "FangSong",
    "Arial",
    "Times-New-Roman",
    "sans-serif"
];
var Font = Quill.import("formats/font");
Font.whitelist = fonts;
Quill.register(Font, true);
// 字号大小
var sizes = ["14px","16px", "18px", "20px", "22px", "26px", "28px", "30px"];
var Size = Quill.import("formats/size");
Size.whitelist = sizes;

const toolbarOptions = [
  ['insertMetric'],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] },{ size:sizes },{ font: fonts }], //标题、字体大小、字体样式
  ['bold', 'italic', 'underline', 'strike'],        // 加粗，斜体，下划线，删除线
  [{ 'script': 'sub' }, { 'script': 'super' }],     // 下角标，上角标
  [{ 'list': 'ordered' }, { 'list': 'bullet' }],    // 有序列表，无序列表
  [{ 'indent': '-1' }, { 'indent': '+1' }],         // 缩进
  [{ 'align': [] }],                                // 对齐方式
  [{ 'color': [] }, { 'background': [] }],          // 颜色选择
  ['blockquote', 'code-block'],                     //引用，代码块
  ['clean'],            // 清除样式
  ['link', 'image']   // 上传图片
]
export default defineComponent( {
  components: {
    QuillEditor,
  },
  data () {
    return {
      isReady: false,
      delta: null,
      editorOption: {
        theme: 'snow',
        modules: {
          toolbar: {
            container: toolbarOptions,
            handlers: {
              insertMetric: this.showHandle
            }
          }
        }
      }
    }
  },
  methods: {
    createQuillBinding(quill){
      console.log(quill.getModule('cursors'))
      handleQuillBinding(quill)
      this.isReady = true
    },
    exportQuillDelta(){
      console.log(this.delta)
      this.delta = {
        ops: [
          {
            insert: "Test two-way binding"
          }
        ]
      }
    }
  },
  setup: () => {
    const modules = {
      name: 'cursors',
      module: QuillCursors,
      options: {cursors: true}
    }
    return {modules}
  }
})
</script>

<style lang='less'>
// 字体样式大小
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimSun"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimSun"]::before {
    content: "宋体";
    font-family: "SimSun";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="SimHei"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="SimHei"]::before {
    content: "黑体";
    font-family: "SimHei";
}
.ql-snow
    .ql-picker.ql-font
    .ql-picker-label[data-value="Microsoft-YaHei"]::before,
.ql-snow
    .ql-picker.ql-font
    .ql-picker-item[data-value="Microsoft-YaHei"]::before {
    content: "微软雅黑";
    font-family: "Microsoft YaHei";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="KaiTi"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="KaiTi"]::before {
    content: "楷体";
    font-family: "KaiTi";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="FangSong"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="FangSong"]::before {
    content: "仿宋";
    font-family: "FangSong";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="Arial"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="Arial"]::before {
    content: "Arial";
    font-family: "Arial";
}
.ql-snow
    .ql-picker.ql-font
    .ql-picker-label[data-value="Times-New-Roman"]::before,
.ql-snow
    .ql-picker.ql-font
    .ql-picker-item[data-value="Times-New-Roman"]::before {
    content: "Times New Roman";
    font-family: "Times New Roman";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="sans-serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="sans-serif"]::before {
    content: "sans-serif";
    font-family: "sans-serif";
}

.ql-font-SimSun {
    font-family: "SimSun";
}
.ql-font-SimHei {
    font-family: "SimHei";
}
.ql-font-Microsoft-YaHei {
    font-family: "Microsoft YaHei";
}
.ql-font-KaiTi {
    font-family: "KaiTi";
}
.ql-font-FangSong {
    font-family: "FangSong";
}
.ql-font-Arial {
    font-family: "Arial";
}
.ql-font-Times-New-Roman {
    font-family: "Times New Roman";
}
.ql-font-sans-serif {
    font-family: "sans-serif";
}
/* 字号设置 */
/* 默认字号 */
.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="14px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="14px"]::before {
    content: "14px";
    font-size: 14px;
}

.ql-size-14px {
    font-size: 14px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="16px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="16px"]::before {
    content: "16px";
    font-size: 16px;
}

.ql-size-16px {
    font-size: 16px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="18px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="18px"]::before {
    content: "18px";
    font-size: 18px;
}

.ql-size-18px {
    font-size: 18px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="20px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="20px"]::before {
    content: "20px";
    font-size: 20px;
}

.ql-size-20px {
    font-size: 20px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="22px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="22px"]::before {
    content: "22px";
    font-size: 22px;
}

.ql-size-22px {
    font-size: 22px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="26px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="26px"]::before {
    content: "26px";
    font-size: 26px;
}

.ql-size-26px {
    font-size: 26px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="28px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="28px"]::before {
    content: "28px";
    font-size: 28px;
}

.ql-size-28px {
    font-size: 28px;
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="30px"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="30px"]::before {
    content: "30px";
    font-size: 30px;
}

.ql-size-30px {
    font-size: 30px;
}
.out-div {
  height: 100%;
}
.inner-div {
  height: 100%;
}
.inner-container {
  height: 100%;
}
.leftPane {
  margin: 20px 0 0 20px;
  background-color: rgba(190, 190, 190, 0.25);
  border-radius: 10px;
  box-shadow: 3px 3px 10px #bebebe;
  height: 100%;
}
.rightPane {
  margin: 20px 20px 0 20px;
  height: 100%;
  padding: 0;

}
.editor {
  height: 93%;
}
.quill-editor {
  height: 100%;
}
</style>

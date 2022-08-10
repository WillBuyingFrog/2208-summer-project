<template>
  <div>
    <input
      type="color"
      @input="editor.chain().focus().setColor($event.target.value).run()"
      :value="editor.getAttributes('textStyle').color"
      title="字体颜色"
      style="width:27px;margin-right:10px"
    >
    <template v-for="(item, index) in items">
      <div class="divider" v-if="item.type === 'divider'" :key="`divider${index}`" />
      <menu-item v-else :key="index" v-bind="item" />
    </template>
    <input v-model.trim="rows" type="number" style="width:30px;margin-right:4px;" placeholder="行">
    <span>x</span>
    <input v-model.trim="cols" type="number" style="width:30px;margin-left:4px;" placeholder="列">
    <template v-for="(item, index) in tables">
      <div class="divider" v-if="item.type === 'divider'" :key="`divider${index}`" />
      <menu-item v-else :key="index" v-bind="item" />
    </template>
  </div>
</template>

<script>
import MenuItem from './TipTapMenuItem.vue'
import FileSaver from 'file-saver'
import htmlDocx from "html-docx-js/dist/html-docx"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
export default {
  components: {
    MenuItem,
  },
  props: {
    editor: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      rows: 3,
      cols: 4,
      cssHTML: 
` 
  ul,
  ol {
    padding: 0 1rem;
  }
  h1
  h2
  h3
  h4
  h5
  h6 {
    line-height: 1.1;
  }
  code {
    background-color: rgba(#616161, 0.1);
    color: #616161;
  }
  pre {
    background: #0D0D0D;
    color: #FFF;
    font-family: 'JetBrainsMono', monospace;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }
  mark {
    background-color: #FAF594;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  hr {
    margin: 1rem 0;
  }
  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }
  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;
    li {
      display: flex;
      align-items: center;
      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }
      > div {
        flex: 1 1 auto;
      }
    }
  }
  table {
        border-right: 2px solid #aeacac;
        border-bottom: 2px solid #aeacac;
        text-align: center;
    }
    
    table th {
        border-left: 2px solid #aeacac;
        border-top: 2px solid #aeacac;
    }
    
    table td {
        border-left: 2px solid #aeacac;
        border-top: 2px solid #aeacac;
    }
  img {
    max-width: 100%;
    height: auto;

    &.ProseMirror-selectednode {
      outline: 3px solid #68CEF8;
    }
  }
  `,
      items: [
        {
          icon: 'bold',
          title: '加粗',
          action: () => this.editor.chain().focus().toggleBold().run(),
          isActive: () => this.editor.isActive('bold'),
        },
        {
          icon: 'italic',
          title: '斜体',
          action: () => this.editor.chain().focus().toggleItalic().run(),
          isActive: () => this.editor.isActive('italic'),
        },
        {
          icon: 'strikethrough',
          title: '划掉',
          action: () => this.editor.chain().focus().toggleStrike().run(),
          isActive: () => this.editor.isActive('strike'),
        },
        {
          icon: 'code-view',
          title: '行内代码',
          action: () => this.editor.chain().focus().toggleCode().run(),
          isActive: () => this.editor.isActive('code'),
        },
        {
          icon: 'mark-pen-line',
          title: '高亮',
          action: () => this.editor.chain().focus().toggleHighlight().run(),
          isActive: () => this.editor.isActive('highlight'),
        },
        {
          type: 'divider',
        },
        {
          icon: 'h-1',
          title: '一级标题',
          action: () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 1 }),
        },{
          icon: 'h-2',
          title: '二级标题',
          action: () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 2 }),
        },{
          icon: 'h-3',
          title: '三级标题',
          action: () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 3 }),
        },{
          icon: 'h-4',
          title: '四级标题',
          action: () => this.editor.chain().focus().toggleHeading({ level: 4 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 4 }),
        },{
          icon: 'h-5',
          title: '五级标题',
          action: () => this.editor.chain().focus().toggleHeading({ level: 5 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 5 }),
        },{
          icon: 'h-6',
          title: '六级标题',
          action: () => this.editor.chain().focus().toggleHeading({ level: 6 }).run(),
          isActive: () => this.editor.isActive('heading', { level: 6 }),
        },
        {
          icon: 'paragraph',
          title: '段落',
          action: () => this.editor.chain().focus().setParagraph().run(),
          isActive: () => this.editor.isActive('paragraph'),
        },
        {
          icon: 'list-unordered',
          title: '无序列表',
          action: () => this.editor.chain().focus().toggleBulletList().run(),
          isActive: () => this.editor.isActive('bulletList'),
        },
        {
          icon: 'list-ordered',
          title: '有序列表',
          action: () => this.editor.chain().focus().toggleOrderedList().run(),
          isActive: () => this.editor.isActive('orderedList'),
        },
        {
          icon: 'list-check-2',
          title: '任务列表',
          action: () => this.editor.chain().focus().toggleTaskList().run(),
          isActive: () => this.editor.isActive('taskList'),
        },
        {
          icon: 'code-box-line',
          title: '代码块',
          action: () => this.editor.chain().focus().toggleCodeBlock().run(),
          isActive: () => this.editor.isActive('codeBlock'),
        },
        {
          type: 'divider',
        },
        {
          icon: 'double-quotes-l',
          title: '引用',
          action: () => this.editor.chain().focus().toggleBlockquote().run(),
          isActive: () => this.editor.isActive('blockquote'),
        },
        {
          icon: 'separator',
          title: '水平分割线',
          action: () => this.editor.chain().focus().setHorizontalRule().run(),
        },
        {
          type: 'divider',
        },
        {
          icon: 'text-wrap',
          title: '换行',
          action: () => this.editor.chain().focus().setHardBreak().run(),
        },
        {
          icon: 'format-clear',
          title: '格式清除',
          action: () => this.editor.chain()
              .focus()
              .clearNodes()
              .unsetAllMarks()
              .run(),
        },
        {
          type: 'divider',
        },
        {
          icon: 'arrow-go-back-line',
          title: '撤销',
          action: () => this.editor.chain().focus().undo().run(),
        },
        {
          icon: 'arrow-go-forward-line',
          title: '重做',
          action: () => this.editor.chain().focus().redo().run(),
        },
        {
          type: 'divider',
        },
        
        {
          icon: 'align-left',
          title: '左对齐',
          action: () => this.editor.chain().focus().setTextAlign('left').run(),
          isActive: () => this.editor.isActive({textAlign: 'left'})
        },{
          icon: 'align-center',
          title: '居中对齐',
          action: () => this.editor.chain().focus().setTextAlign('center').run(),
          isActive: () => this.editor.isActive({textAlign: 'center'})
        },{
          icon: 'align-right',
          title: '右对齐',
          action: () => this.editor.chain().focus().setTextAlign('right').run(),
          isActive: () => this.editor.isActive({textAlign: 'right'})
        },{
          icon: 'align-justify',
          title: '对齐',
          action: () => this.editor.chain().focus().setTextAlign('justify').run(),
          isActive: () => this.editor.isActive({textAlign: 'justify'})
        },{
          type: 'divider',
        },
        {       
          icon: 'table-2',
          title: '插入表格',
          action: () => this.addTable()
        },
      ],
      tables: [
        {
          icon: 'insert-column-left',
          title: '插入列左',
          action: () => this.editor.chain().focus().addColumnBefore().run()
        },
        {
          icon: 'insert-column-right',
          title: '插入列右侧',
          action: () => this.editor.chain().focus().addColumnAfter().run()
        },
        {
          icon: 'insert-row-top',
          title: '插入行顶部',
          action: () => this.editor.chain().focus().addRowBefore().run()
        },
        {
          icon: 'insert-row-bottom',
          title: '插入行底部',
          action: () => this.editor.chain().focus().addRowAfter().run()
        },
        {
          icon: 'delete-column',
          title: '删除列',
          action: () => this.editor.chain().focus().deleteColumn().run()
        },
        {
          icon: 'delete-row',
          title: '删除行',
          action: () => this.editor.chain().focus().deleteRow().run()
        },
        {
          icon: 'delete-bin-6-line',
          title: '删除表',
          action: () => this.editor.chain().focus().deleteTable().run()
        },
        {
          type: 'divider',
        },
        {
          icon: 'image-line',
          title: '插入图片',
          action: () => this.addImage()
        },
        {
          type: 'divider',
        },{
          icon: 'download-2-line',
          title: '保存为word',
           action: () => this.HTMLtoWord(),
        },{
          icon: 'download-2-line',
          title: '保存为pdf',
           action: () => this.HTMLtoPdf(),
        },{
          icon: 'download-2-line',
          title: '保存为md',
           action: () => this.HTMLtoMd(),
        },
      ]
    }
  },
  methods: {
    HTMLtoWord(){
      let html = this.editor.getHTML();
      let content = `<!DOCTYPE html><html>
            <head>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                <style>
                    ${this.cssHTML}
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>`;
      let converted = htmlDocx.asBlob(content);
      FileSaver.saveAs(converted, '文档');
    },
    HTMLtoPdf(){
      // let html = this.editor.getHTML();
      // let content = `<!DOCTYPE html><html>
      //       <head>
      //           <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      //           <style>
      //               ${this.cssHTML}
      //           </style>
      //       </head>
      //       <body>
      //         <div class='main'>
      //           ${html}
      //           </div>
      //       </body>
      //       </html>`;
      let element = document.getElementById('editor');
      console.log(element);
      html2canvas(element, {
        logging: false,
        allowTaint: true,
        taintTest: false,
        useCORS: true,
        async: true,
        scale: 4, // 放大倍数
        dpi: '192', // 精度，清晰度设置
      }).then(function(canvas) {
        var pdf = new jsPDF('p', 'mm', 'a4') // A4纸，纵向
        var ctx = canvas.getContext('2d')
        var a4w = 170
        var a4h = 280 // A4大小，210mm x 297mm，四边各保留20mm的边距，显示区域170x257
        var imgHeight = Math.floor(a4h * canvas.width / a4w) // 按A4显示比例换算一页图像的像素高度
        var renderedHeight = 0

        while (renderedHeight < canvas.height) {
          var page = document.createElement('canvas')
          page.width = canvas.width
          page.height = Math.min(imgHeight, canvas.height - renderedHeight)// 可能内容不足一页

          // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
          page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0)
          pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4w, Math.min(a4h, a4w * page.height / page.width)) // 添加图像到页面，保留10mm边距

          renderedHeight += imgHeight
          if (renderedHeight < canvas.height) {
            pdf.addPage()
          }// 如果后面还有内容，添加一个空页
          // delete page;
        }
        pdf.save("文档");
      })
      
    },
    HTMLtoMd(){

    },
    addImage() {
      const url = window.prompt('请输入要插入图片的url')

      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run()
      }
    },
    addTable(){
      console.log(this.cols);
      this.editor.chain().focus().insertTable({ rows: parseInt(this.rows), cols: parseInt(this.cols), withHeaderRow: true }).run();
    }
  }
}
</script>

<style lang="scss">
.divider {
  width: 2px;
  height: 1.25rem;
  background-color: rgba(#000, 0.1);
  margin-left: 0.5rem;
  margin-right: 0.75rem;
}

</style>
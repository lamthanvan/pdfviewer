<template>
  <div id="app">
  {{name}}
    <ul>
      <li v-for="(file, index) in files" :key="index" @click="setName(index)">{{file}}</li>
    </ul>
    <PDFJSThumbnail
            :path="`${thumbPath}`"
            :fileName="`${name}`"
    />
    <button v-on:click="showPdf()" v-if="!pdfShow">show pdf</button>

    <template v-if="!pdfShow">
    <div class="control-panel">
      <div class="el-image-viewer__btn el-image-viewer__actions visible">
        <div class="el-image-viewer__actions__inner">         
          <button v-on:click="nextFile">next</button>
          <i class="el-icon-caret-top" v-on:click="pageUp" style="font-size: 16px">up</i>
          <input type="text" class="box-pages" v-model="pageIndex" @change="setPage()">/
          <span style="font-size: 13px">{{totalPages}}</span>
          <i class="el-icon-caret-bottom" v-on:click="pageDown"  style="font-size: 16px">down</i>
          <i class="el-icon-zoom-out" v-on:click="rotate('left')">L</i>
          <i class="el-icon-zoom-out" v-on:click="rotate('right')">R</i>
          <i class="el-image-viewer__actions__divider"></i>
          <i class="el-icon-zoom-out" v-on:click="zoomOut">-</i>
          <i class="el-image-viewer__actions__divider"></i>
          <i class="el-icon-zoom-in" v-on:click="zoomIn">+</i>
          <i class="el-image-viewer__actions__divider"></i
          ><i class="el-icon-circle-close" v-on:click="hidePdf()">x</i>
        </div>
      </div>
    </div>
    <div class="iframe">
      <PDFJSViewer :path="`${path}`" 
                   :fileName="`${name}`" 
                   :total-pages.sync="totalPages"
                   :page-index.sync="pageIndex"

      />
    </div>
    </template>
  </div>
</template>

<script>
import PDFJSViewer from "./components/PDFJSViewer";
import PDFJSThumbnail from "./components/PDFJSThumbnail";

export default {
  name: "app",
  components: {
    PDFJSViewer,
    PDFJSThumbnail
  },
  data() {
    return {
      pageIndex: 1,
      totalPages: 1,
      path: "lib/web/viewer.html", //path of the PDF.js viewer.html
      thumbPath: "lib/web/thumbnail.html",
      files: [        
        "SO-41B_J_syousai_11.pdf",
        "medium.pdf",
        "https://file-examples-com.github.io/uploads/2017/10/file-example_PDF_500_kB.pdf",
        "https://file-examples-com.github.io/uploads/2017/10/file-example_PDF_1MB.pdf",
      ],
      index: 0,
      pdfShow: false
    };
  },
  created() {
    this.pageIndex = 0
  },
  computed: {
    name() {
      return this.files[this.index];
    },
    pdfFrame(){
      return document.getElementById("main_iframe").contentWindow;
    }    
  },
  methods: {
    setName(index){
      this.index =  index
    },
    showPdf(){
      this.pdfShow = true
    },
    hidePdf(){
      this.pdfShow = false
    },
    initValue(){
      this.pageIndex = 0
      this.totalPages = 1
    },
    nextFile() {
      this.initValue();
      this.index++;
      if (this.index > this.files.length - 1) this.index = 0;
    },
    setPage(){
      if(this.pageIndex > this.totalPages || this.pageIndex < 1) return;
        this.pdfFrame.document.getElementById("pageNumber").value = this.pageIndex;
        this.pdfFrame.document.getElementById("pageNumber").dispatchEvent(new Event("change"))
    },
    rotate(clock) {    
      switch (clock) {
        case "left":
          this.pdfFrame.document.getElementById("pageRotateCcw").click();
          break;
        case "right":
          this.pdfFrame.document.getElementById("pageRotateCw").click();
          break;
      }
    },
     zoomIn() {
      this.pdfFrame.document.getElementById("zoomIn").click();
    },
     zoomOut() {
      this.pdfFrame.document.getElementById("zoomOut").click();
    },
    pageUp(){
      // if(this.pageIndex <= 1 ){
      //   if(this.pageIndex === 0) this.pageIndex = 1;
      //   return;
      // }
      this.pdfFrame.document.getElementById("previous").click();
      // this.setPage()
    },
    pageDown(){
      // if(this.pageIndex >= this.totalPages){
      //   this.pageIndex = this.totalPages
      //   return;
      // }
      this.pdfFrame.document.getElementById("next").click();
      // this.setPage()
    }
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.iframe {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vw;
  background: transparent;
  z-index: 9;
}
.control-panel {
  z-index: 999;
  position: fixed;
  bottom: 80px;
  left: 0;
  width: 100vw;
  color: #fff;
  background-color: #555;
  opacity: 0.96;
}
.control-panel i {
  padding: 10px;
  background: #2c3e50;
  border: 1px solid #000;
  margin-left: 5px;
  margin-right: 5px;
}
</style>

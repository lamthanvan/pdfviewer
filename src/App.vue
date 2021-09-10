<template>
  <div id="app">
    <div class="control-panel">
      <button v-on:click="next()">Change</button>
      <button v-on:click="rotate('left')">Left</button>
      <button v-on:click="rotate('right')">Right</button>
    </div>
    <div class="iframe">
      <PDFJSViewer :path="`${path}`" :fileName="`${name}`"/>
    </div>
  </div>
</template>

<script>
import PDFJSViewer from './components/PDFJSViewer'

export default {
  name: 'app',
  components: {
    PDFJSViewer
  },
  data () {
    return {
      name: 'demo.pdf', //change which pdf file loads
      path: 'lib/web/viewer.html' //path of the PDF.js viewer.html
    }
  },
  methods:{
    next(){
      this.name = "https://file-examples-com.github.io/uploads/2017/10/file-sample_150kB.pdf"
    },
    rotate(clock){
      const iframeEl = document.getElementById('main_iframe').contentWindow;
      switch (clock) {
        case 'left':
          iframeEl.document.getElementById('pageRotateCcw').click();
          break;
        case 'right':
          iframeEl.document.getElementById('pageRotateCw').click();
          break;
      }

    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
  .iframe{
    position: fixed;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vw;
  }
  .control-panel{
    z-index: 999;
    position: fixed;
    bottom: 30px;
    left: 0;
    width: 100vw;
  }
</style>

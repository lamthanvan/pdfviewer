<template>
<div>
  <iframe height="100%" width=100% :src="`${getFilePath}`" sandbox="allow-same-origin allow-scripts allow-popups allow-forms" id="main_iframe"></iframe>
</div>
</template>

<script>
export default {
  name: 'PDFJSViewer',
  props: {
    fileName: String,
    path:String
  },
  computed:{ 
    getFilePath: function () {
      if(this.fileName!==''){
          return this.path +'?file=' + this.fileName
      }
      return this.path 
    }
  },
}
</script>
<style scoped>
  div{
    height: 100%;
    width: 100%;
  }
iframe{
  height: 100vh;
  max-height: 100vh;
  width: 100%;
}
</style>
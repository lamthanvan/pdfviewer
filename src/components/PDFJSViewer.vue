<template>
<div>  
  <input type="hidden" v-model="localNumberOfPages" id="currentPage" name="currentPage" v-on:change="currentPageChanged" />
  <input type="hidden" v-model="localNumberOfPages" id="numberOfPages" name="numberOfPages" v-on:change="numberOfPagesChanged" />
  <iframe height="100%" width=100% :src="`${getFilePath}`" sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals allow-downloads allow-orientation-lock" id="main_iframe"></iframe>
</div>
</template>

<script>
export default {
  name: 'PDFJSViewer',
  props: {
    fileName: String,
    path:String,
    numberOfPages: Number,    
  },
  updated(){     
    const numberOfPagesElm = document.getElementById('numberOfPages')
    numberOfPagesElm.addEventListener('change',function(){    
      this.localNumberOfPages = numberOfPagesElm.value
    })
  },
  data(){
    return{
      localNumberOfPages: 1
    }
  },
  computed:{ 
    getFilePath: function () {
      if(this.fileName!==''){
          return this.path +'?file=' + this.fileName
      }
      return this.path 
    }
  }, 
  methods: {
    numberOfPagesChanged: function () { 
      const numberOfPagesElm = document.getElementById('numberOfPages')
      if(numberOfPagesElm){
        this.$emit('update:total-pages', Number(numberOfPagesElm.value))   
      }               
    },
     currentPageChanged: function () { 
      const currentPageElm = document.getElementById('currentPage')
      if(currentPageElm){
        this.$emit('update:page-index', Number(currentPageElm.value))   
      }               
    },
  }
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
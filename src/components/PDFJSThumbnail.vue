<template>
	<div>
<!--		<iframe height="300" width=100% :src="`${getFilePath}`" oncontextmenu="return false;"></iframe>-->
	</div>
</template>
<script>
export default {
	name: 'PDFJSThumbnail',
	props: {
		fileName: String,
		path:String,
		numberOfPages: Number,
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
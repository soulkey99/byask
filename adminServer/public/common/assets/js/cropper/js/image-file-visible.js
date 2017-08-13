//图片显示插件
(function($) {       
    $.imageFileVisible = function(options) {
        // 默认选项
        var defaults = {
        //包裹图片的元素
            wrapSelector: null,
            //<input type=file />元素
            fileSelector:  null ,
            width : '100%',
            height: 'auto',
            errorMessage: "不是图片"
         };
         // Extend our default options with those provided.
         var opts = $.extend(defaults, options);
         $(opts.fileSelector).on("change",function(){
             var file = this.files[0];
             var imageType = /image.*/;
             if (file.type.match(imageType)) {
                 var reader = new FileReader();
                 reader.onload = function () {
                     var img = new Image();
                     //img.src = reader.result;
                     //$(img).width( opts.width);
                     //$(img).height( opts.height);
                     //$( opts.wrapSelector ).append(img);
                     //vm.avatar(reader.result);
                     alert(reader.result)
                     $('.cropper-example-1 > img').cropper('replace', reader.result);
                     reader.readAsDataURL(file);
                 }
             }else{
                     alert(opts.errorMessage);
             }
         });
    };
})(jQuery); 
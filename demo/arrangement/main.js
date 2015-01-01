require.config({
    baseUrl: "",
    paths: {
        wf: "http://shy2850.github.io/wfQuery/js/wfQuery"
        //wf: "http://webfuture.cn/js/wfQuery"
    }
});
require(["wf"],function($){
    var main = $("#main-screen"), files = $("#files"), form = document.createElement("form");

    $(document).on("dragenter dragover drop dragleave", function(e){  
        e.preventDefault();
    });

    main.on("drop",function(e){
        e.preventDefault(); //取消默认浏览器拖拽效果
        var fileList = e.dataTransfer.files; //获取文件对象

        //检测是否是拖拽文件到页面的操作
        if(fileList.length == 0){
            return false;
        }
        doShowImg( fileList );
    });

    files.on("change",function(e){
        doShowImg( this.files );
    });

    function doShowImg(files){
        for (var i = 0; i < files.length; i++) {
            if( !/\bimage\b/.test( files[i].type ) ){
                alert( "文件必须为图片" );
                return false;
            }
        };
        $.ajax({
            url: "/upload?target=demo/arrangement/upload.json&uploadUrl=demo/arrangement/images/",
            type: "post",
            data: {
                files: files
            },
            form: form,
            success:function(res){
                res.forEach(function(t){
                   main.append( $('<li><img src="images/'+t.file.name+'" alt="'+t.file.name+'" /></li>') ); 
                });
            }
        });
    }
});
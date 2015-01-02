(function($){
    var main = $("#main-screen"), 
        files = $("#files"), 
        form = document.createElement("form"),
        holder = $('<div class="edit-holder" style="display:none" tabindex="2" title="1.拖拽改变图片位置;\n2.滚轮改变图片大小;\n3.del/backspace键删除;\n4.点击select调整大小。"></div>');

    holder.html( ''
        +'<select>'
        +'    <option value="size-1-1">1:1</option>'
        +'    <option value="size-1_5-1">1.5:1</option>'
        +'    <option value="size-2-2">2:2</option>'
        +'    <option value="size-3-2" selected>3:2[默认]</option>'
        +'    <option value="size-3-3">3:3</option>'
        +'    <option value="size-6-4">6:4</option>'
        +'</select>');
    $(document.body).append(holder);

    $(document).on("dragenter dragover drop dragleave", function(e){  
        e.preventDefault();
    });

    //文件上传以及在回调中显示图片
    function doShowImg(files){
        for (var i = 0; i < files.length; i++) {
            if( !/\bimage\b/.test( files[i].type ) ){
                alert( "文件必须为图片" );
                return false;
            }
            //FileReader 添加img
            (function(f){
                var reader = new FileReader();   
                reader.onload = function(e){  
                    main.append( $('<li class="item"><img src="'+e.target.result+'" alt="'+3+'" /></li>') ); 
                }  
                reader.readAsDataURL(f);   
            })(files[i]);
        };
        return ;
        //文件上传
        $.ajax({
            url: "/upload?target=demo/arrangement/upload.json&uploadUrl=demo/arrangement/images/",
            type: "post",
            data: {
                files: files
            },
            form: form,
            success:function(res){
                console.log( "文件上传完成。" );
                res.forEach(function(t){
                   main.append( $('<li class="item"><img src="images/'+t.file.name+'" alt="'+t.file.name+'" /></li>') ); 
                });
            },
            onprocess: function(e){
                console.log( "文件上传中..." );
            }
        });
    }
    //拖拽文件上传
    main.on("drop",function(e){
        e.preventDefault(); //取消默认浏览器拖拽效果
        var fileList = e.dataTransfer.files; //获取文件对象

        //检测是否是拖拽文件到页面的操作
        if(fileList.length == 0){
            return false;
        }
        doShowImg( fileList );
    });
    //文件选择上传
    files.on("change",function(e){
        doShowImg( this.files );
    });


    //定义单个item操作: 关联holder
    var holderElement = null;
    holder.refresh = function(){
        holderElement && holder.css(holderElement.parentNode.getBoundingClientRect()).show().trigger("focus");
    };
    $(window).on("resize",holder.refresh);
    main.on("dblclick",".item",function(e){
        holderElement = this.children[0];
        sizeSelect.val(holderElement.size || "size-3-2");
        holder.refresh();
    }).on("click",".item",function(e){
        holder.hide();holderElement = null;
    });
    holder.on("dblclick",function(e){
        holder.hide();holderElement = null;
    });

    //修改大小
    var sizeSelect = holder.children('select');
    sizeSelect.on("change",function(e){
        holderElement.parentNode.className = "item " + this.value;
        holderElement.size = this.value;
        holder.refresh();
    });
    //删除图片
    holder.on("keyup",function(e){
        if( e.keyCode === 8 || e.keyCode === 46 ){
            $(holderElement.parentNode).remove();
            holder.hide();
            holderElement = null;
            e.preventDefault();
            e.stopPropagation();
        }
    });
    //鼠标滚轮进行放大缩小
    holder.on("mousewheel",function(e){
        e.preventDefault();
        e.stopPropagation();
        var w = parseInt( holderElement.style.width || "100%" );
        if( e.wheelDelta > 0 ){
            w += 5;//放大
        }else{
            w -= 5;//缩小
        }
        holderElement.style.width = w + "%";
    });
    //鼠标拖拽进行img定位
    var imgPosition = null;
    holder.on("mousedown",function(e){
        imgPosition = {
            left: parseFloat( holderElement.style.left ) || 0,
            top: parseFloat( holderElement.style.top ) || 0,
            e: {
               x: e.x,
               y: e.y 
            }
        };
        return false;
    }).on("mousemove",function(e){
        var ip;
        if( ip = imgPosition ){
            $(holderElement).css({
                left: ( ip.left + e.x - ip.e.x ) + "px",
                top: ( ip.top + e.y - ip.e.y ) + "px"
            });
        }
    }).on("mouseup mouseout mouseleave",function(e){
        imgPosition = null;
        return false;
    });


    //绑定拖拽排序
    var dragElement = null;
    main.on("dragstart", ".item",function(e){
        dragElement = this;
        holder.hide();
    }).on("drop",".item",function(e){
        if( this !== dragElement ){
            var children = main.children();
            if( children.indexOf( this ) > children.indexOf( dragElement ) ){
                this.nextElementSibling 
                    ? this.parentNode.insertBefore( dragElement, this.nextElementSibling )
                    : this.parentNode.appendChild( dragElement );
            }else{
                this.parentNode.insertBefore( dragElement, this );
            }
        }
    });
})(wfQuery);

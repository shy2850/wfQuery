    
    wfQuery.extend({
        ajax: function(option){
            var opt = wfQuery.extend({
                async: true,
                timeout: 30000,
                cache: true,
                url: null,
                data: {},
                type: "GET",
                dataType: "json",
                form: null,     // 使用form参数时候, data参数失效, 直接进行可以携带文件上传的表单提交
                success: function(){},
                error: function(){},
                onprocess: function(){} 
            },option);

            if( !opt.url ){
                console.error( opt );
                throw new Error("ajax( url /*required*/ )");
            }
            
            if( opt.dataType.toUpperCase() === "JSONP" ){
                return wfQuery.jsonp( opt.url, opt.data, opt.success );
            }

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if (xhr.readyState == 4){
                    if( xhr.status != 200 ){
                        return opt.error(xhr);
                    }
                    switch( opt.dataType.toUpperCase() ){
                        case "JSON":  
                            try{
                                opt.success( JSON.parse(xhr.responseText) );
                            }catch(e){
                                return opt.error(xhr, e);
                            }
                            break;
                        case "XML":
                        case "HTML":
                            if( xhr.responseXML ){
                                opt.success( xhr.responseXML );
                            }else{
                                opt.error( xhr );
                            }
                            break;
                        default:
                            opt.success( xhr.responseText );
                    }
                }    
            };

            var data, form, type = opt.type.toUpperCase();
            if( opt.form && (form = $( opt.form )[0]) && form.tagName.toUpperCase() === "FORM" ){
                /*文件上传事件*/
                if( type === "POST" ){
                    xhr.upload.addEventListener("progress",opt.onprocess);
                }
                data = new FormData( form );
            }else{
                data = wfQuery.param( opt.data );
            }
            xhr.open(type, opt.url, opt.async);
            opt.cache || xhr.setRequestHeader("Cache-Control","no-cache");
            xhr.send(data);
        },
        jsonp: function(url, data, callback){
            if( wfQuery.isFunction(data) ){
                callback = data;
                data = {};
            }
            var cbk_name = "wfQuery_" + +new Date;
            data.__t = +new Date;
            data.callback = cbk_name;
            var _sc = doc.createElement('script');
                _sc.src = url + '?' + wfQuery.param( data );
            var sc = wfQuery(_sc);
            wfQuery('body').append( sc );

            window[cbk_name] = callback || function(){};
            sc.on('load',function(){
                delete window[cbk_name];
                sc.remove();
            });
        }
    });

    ( [ "get", "post" ] ).forEach( function( i, method ) {
        wfQuery[ method ] = function( url, data, callback, type ) {
            if ( wfQuery.isFunction( data ) ) {
                type = type || callback;
                callback = data;
                data = undefined;
            }

            return wfQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: _callback
            });
        };
    });

;(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        root.wfQuery = factory();
        window.$ = window.$ || root.wfQuery;
    }
}(this, function(require) {
    var doc = window.document,
    wfQuery = function( selector, context ) {
    	return new wfQuery.fn.init( selector, context );
    };

    /*初始化方法*/
    
    wfQuery.fn = wfQuery.prototype = new Array();   
    wfQuery.fn.constructor = wfQuery;
    var init = wfQuery.fn.init = function( selector, context ) {
        context = context || doc;

        var type = Object.prototype.toString.call( selector) ;

        if(!selector){
            return this;
        }else if( selector.constructor === wfQuery ){
            return selector;
        }else if( type === "[object String]" ){
            var holder = document.createElement("WF");
            if( /^\s*[\<]/.test(selector) ){
                holder.innerHTML = selector;
                return new init( holder.children );
            }else{
                return new init( context.querySelectorAll(selector) );              
            }
        }else if( /\[object\s(HTML|XML)/.test(type) && selector.nodeType || type === "[object global]" ){
            this.length = 1; 
            this[0] = selector;
            return this;
        }else if( "[object HTMLCollection]" === type || "[object NodeList]" === type || "[object Array]" === type ){
            this.length = selector.length;
            for (var i = 0; i < selector.length; i++) {
                this[i] = selector[i];
            };
            return this;
        }else if( wfQuery.isFunction( selector ) ){
            selector(wfQuery);
        }

    };
    init.prototype = wfQuery.fn;

    /*extend方法定义*/
    
    wfQuery.extend = wfQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[ i ] || {};
            i++;
        }

        if ( typeof target !== "object" && !wfQuery.isFunction(target) ) {
            target = {};
        }

        if ( i === length ) {
            target = this;
            i--;
        }

        for ( ; i < length; i++ ) {
            if ( (options = arguments[ i ]) != null ) {
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];
                    if ( target === copy ) {
                        continue;
                    }
                    if ( deep && copy && ( wfQuery.isPlainObject(copy) || (copyIsArray = wfQuery.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && wfQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && wfQuery.isPlainObject(src) ? src : {};
                        }
                        target[ name ] = wfQuery.extend( deep, clone, copy );
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }
        return target;
    };

    /*最常用的基本工具*/
        
    wfQuery.extend({
        trim: function(str){
            return (str || "").replace(/^\s*(.*?)\s*$/,"$1");
        },
        isFunction: function( obj ) {
            return typeof obj === "function";
        },
        isArray: Array.isArray,

        isPlainObject: function( obj ) {
            if ( typeof obj !== "object" || obj.nodeType || obj === obj.window ) {
                return false;
            }
            if ( obj.constructor && !Object.prototype.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
                return false;
            }
            return true;
        },
        obj2array: function(o){
            var res = [];
            for(var k in o){
                if( wfQuery.isArray(o[k]) ){
                    o[k].forEach( function(el){
                        res.push({
                            name: k,
                            value: el
                        });
                    } );
                }else{
                    res.push({
                        name: k,
                        value: o[k]
                    });
                }
            }
            return res;
        },
        array2obj: function(a){
            var res = {};
            a.forEach(function(i){
                if( wfQuery.isArray( res[i.name] ) ){
                    res[i.name].push( i.value );
                }else if( typeof res[i.name] === "string" ){
                    res[i.name] = [ res[i.name], i.value ];
                }else{
                    res[i.name] = i.value;
                }
            });
            return res;
        },
        param: function(a){
            var arr;
            if( wfQuery.isArray(a) ){
                arr = a;
            }else if( typeof a === "object" ){
                arr = wfQuery.obj2array( a );
            }else{
                return a;
            }
            return arr.map(function(item){
                if( typeof item.value === "undefined" ){ 
                    return ""; 
                }else{
                    return encodeURIComponent( item.name ) + "=" + encodeURIComponent( item.value );
                }
            }).join("&").replace(/%20/g,"+");
        }
    });

    wfQuery.fn.extend({
        serializeArray: function(){
            var form = this[0], res = [];
            if( form && form.tagName.toUpperCase() === "FORM" ){
                [].map.call( form.elements ,function( inp ){
                    if( !inp.name || inp.disabled ){
                        return ;
                    }
                    switch( inp.type ){
                        case "radio":
                        case "checkbox":
                            if( !inp.checked ) return;
                        case "input":
                        default:
                            res.push({
                                name: inp.name,
                                value: inp.value
                            });
                    }
                });
            }
            return res;
        },
        serialize: function(){
            return wfQuery.param( this.serializeArray() );
        }
    });

	/*原型基础方法*/
        
    wfQuery.fn.extend({
        each: function(fn){
            this.forEach(function(el,i){
                fn.call(el,i,el);
            });
            return this;
        },
        /**
        * @description 交叉循环, 将 ele转化成wfQuery对象后, 做笛卡尔积循环 
        * @param {wfQuery} ele
        * @param {Function} fn( dom, el )
        */
        cross_each: function(ele, fn){
            var ele = wfQuery(ele);
            return this.each(function(){
                var _t = this;
                ele.forEach(function(el){
                    fn( _t, el );
                });
            });
        },
        /**
        * @description 例如 attr/data/css 等类似方法的公用方法
        * @param {String} name 
        * @param {String} value
        * @param {Function} get
        * @param {Function} set
        */
        _attr: function(name, value, get, set){
            var _this = this;
            if( typeof name === "string" && typeof value !== "undefined" ){
                var o = {};
                o[name] = value;
                return this._attr(o, null, get, set);
            }else if( typeof name === "object" ){
                for(var i in name){
                    (function(n,v){
                        _this.each(function(){
                            set.call(this, n, v );
                        });
                    })(i,name[i]);
                }
                return this;
            }else{
                return this.length ? get.call(this[0], name) : null;
            }
        },
        /**
        * @description 例如 html/text/val 等类似方法的公用方法
        * @param {String} name 
        * @param {String} value
        */
        _get_set: function(name,value){
            if( !this.length ){
            }else if(typeof value === "undefined"){
                return this[0][name];
            }else{
                return this.each(function(){
                    this[name] = value;
                });
            } 
        }

    });



    /*查询相关方法*/
        var p = document.createElement('p'), w3cMatches = ["matchesSelector","webkitMatchesSelector","msMatchesSelector","mozMatchesSelector","oMatchesSelector"].filter(function(i){
        return p[i];
    })[0];
    wfQuery.fn.extend({
        /**
         * @description  quick-get functions
        **/
        first: function(){
            return wfQuery( this[0] );
        },
        eq: function(i){
            return wfQuery( this[ (this.length+i) % this.length ] );
        },
        index: function(){
            return this.parent().children().indexOf(this[0]);
        },
        last: function(){
            return wfQuery( this[this.length-1] );
        },
        next: function(){
            return wfQuery( !this[0] ? null : this[0].nextElementSibling );
        },
        prev: function(){
            return wfQuery( !this[0] ? null : this[0].previousElementSibling );
        },
        parent: function(){
            return wfQuery( !this[0] ? null : this[0].parentNode );
        },

        /**
         * @description parents 处理第一个元素的的父标签列表
         * @param {String} filter 
         * @param {HTMLElement} root 
        **/
        parents: function(filter, root){
            var _parents = [], tmp = this[0];
            root = root || document;
            while( tmp && tmp != root && (tmp = tmp.parentNode) ){
                _parents.push( tmp );
            }
            return wfQuery(_parents).filter(filter);
        },
        /**
         * @description  with muti-selectors
        **/
        filter: function(match){
            var tar = [];
            if( !match ){
                return this;
            }else if( typeof match === "function"){   /*原生filter保留*/
                tar = [].filter.call(this, match);
            }else{
                this.each( function(){
                    var _t = this;
                    if( _t[w3cMatches] && _t[w3cMatches](match) ){
                        tar.push( _t );
                    }
                } );
            }
            return wfQuery( tar );
        },
        not: function(no){
            var _this = this;
            return wfQuery( [].filter.call(_this,function(dom){
                var flag;
                try{
                    flag = dom[w3cMatches] && dom[w3cMatches](no);
                }catch(e){
                    flag = dom === wfQuery(no)[0];
                }
                return !flag;
            }) );
        },
        siblings: function(filter){
            return this.parent().children(filter).not(this);
        },
        nextAll: function(filter){
            var all = []
            this.each(function(){
                var children = $(this).parent().children(), i = children.indexOf(this);
                all = all.concat( children.slice(i+1) );
            });
            return wfQuery( all ).filter(filter);
        },
        find: function(filter){
            var _children = [];
            this.each(function(){
                _children = [].concat.apply(_children, wfQuery( this.querySelectorAll(filter) ) );
            });
            return wfQuery( _children );
        },
        children: function(filter){
            var _children = [];
            this.each(function(){
                var _t = this, children = _t.children;
                if( !children ){
                    children = [].filter.call(_t.childNodes, function(el){return !!el.tagName});
                }
                _children = [].concat.apply(_children, wfQuery(children) );
            });
            return wfQuery( _children ).filter(filter);
        }
    });

    /*DOM操作相关方法*/
        
    wfQuery.fn.extend({
        /*根据创建时是否为字符串创建判断: dom操作时候是否使用复制操作*/
        _appender: function(ele){
            return wfQuery(ele);
        },
        append: function(ele){
            return this.cross_each( this._appender(ele), function(dom, el){
                dom.appendChild( el );
            });
        },
        prepend: function(ele){
            return this.cross_each( this._appender(ele), function(dom, el){
                dom.insertBefore( el, dom.firstChild );
            });
        },
        before: function(ele){
            return this.cross_each( this._appender(ele), function(dom, el){
                dom.parentNode.insertBefore( el, dom );
            });
        },
        after: function(ele){
            return this.cross_each( this._appender(ele), function(dom, el){
                dom.parentNode.insertBefore( el, dom.nextSibling );
            });
        },
        empty: function(){
            return this.each(function(){
                this.textContent = "";
            });
        },
        remove: function(){
            return this.each(function(){
                this.parentNode.removeChild(this);
            });
        },
        clone: function(){
            return wfQuery( this.map(function(dom,i){
                return dom.cloneNode ? dom.cloneNode(true) : dom;     
            }) );
        }
    });

    /*属性操作相关方法*/
        var cache = {}, __n = 0;
    wfQuery.fn.extend({
        attr: function(name, value){
            return this._attr(name, value, function(name){
                return name ? this.getAttribute(name) : this.attributes;
            },function(n, v){
                typeof v === "undefined" ? this.removeAttribute(n) : this.setAttribute(n, v);
            });
        },
        data: function(name, value){
            return this._attr(name, value, function(name){
                var key = this.wfQueryCacheKey, o;
                if( key ){
                    o = cache[key];
                }else{
                    this.wfQueryCacheKey = key = "wf_" + (__n++);
                    o = cache[key] = wfQuery.array2obj( 
                        [].filter.call(this.attributes,function(item){
                            return !!item.name.match(/data-/);
                        }).map(function(i){ 
                            var value = i.value;
                            try{
                                value = new Function( "use strict; \n return " + value )();
                            }catch(e){
                            }
                            return {name: i.name.split("-")[1], value: value}; 
                        })
                    );
                }
                return name ? o[name] : o;
            },function(n, v){
                var o = $(this).data();
                var key = this.wfQueryCacheKey;
                if( v === "undefined" ){
                    delete o[n];
                }else{
                    o[n] = v;
                };
            });
        },
        text: function(txt){
            return this._get_set( "textContent", txt );
        },
        html: function(html){
            return this._get_set( "innerHTML", html );
        },
        val: function(value){
            return this._get_set( "value", value );
        },
        addClass: function(className){
            return this.each(function(){
                this.classList.add(className);
            });
        },
        removeClass: function(className){
            return this.each(function(){
                this.classList.remove(className);
            });
        },
        hasClass: function(className){
            return !!this.filter("."+className).length;
        },
        toggleClass: function(className){
            return this.each(function(){
                var list = this.classList;
                list.contains(className) ? list.remove(className) : list.add(className);
            });
        }
    });

    /*css操作相关方法*/
        
    wfQuery.fn.extend({
        css: function(name, value){
            return this._attr(name, value, function(name){
                return name ? window.getComputedStyle( this )[name] : this.style;
            },function(n, v){
                if( /width|height|left|right|top|bottom|size|radius/i.test(n) && /^[\d\.]+$/.test(v) ){
                    v += "px";      //含有这些字符串的style属性名支持一下纯数字写法
                }
                this.style[n] = v;      
            });
        },
        show: function(){
            return this.css({display:""});
        },
        hide: function(){
            return this.css({display:"none"});
        },
        toggle: function(){
            return this.each(function(){
                var _t = this;
                window.getComputedStyle( _t ).display === "none" ? _t.style.display = "" : _t.style.display = "none";
            });
        }
    });

    /*事件操作相关方法*/
        
    wfQuery.fn.extend({
        on: function(options, selector, fn, fn2){
            var eventTypes = (options + "").match(/\w+/g) || [];
            
            if( !eventTypes.length ){
                return this;
            }

            if( typeof selector === "function" ){
                fn = selector;
                selector = null;
            }

            return this.cross_each(eventTypes, function(dom, eventType){
                dom["wf_"+eventType] = dom["wf_"+eventType] || [];
                dom["wf_"+eventType].push(fn);
                dom.addEventListener(eventType, selector ? function(e){
                    var tar = wfQuery( e.target ), par = tar.parents(selector);
                    if( tar.filter(selector).length ){
                        fn.call( tar, e );
                    }else if( par.length ){
                        fn.call( par, e );
                    }else if(typeof fn2 === "function"){
                        fn2.call( this, e );
                    }
                } : fn ,false);
                if( dom.cloneNode && dom.cloneNode.list instanceof Array && dom.cloneNode.list.length ){
                    console.log( dom.cloneNode.list );
                    dom.cloneNode.list.on( options, selector, fn, fn2 );
                }
            });
        },
        /**
         * @description removeEventListener 
        **/
        off: function(eventType){
            return this.each(function(){
                delete this["wf_"+eventType];
                this.removeEventListener( eventType );
            });
        },
        trigger: function(eventType){
            var agu = arguments; 
            return this.each(function(){
                var _t = this, cbks = _t["wf_"+eventType] || [];
                if( _t[eventType] ){
                    _t[eventType]();
                }else{
                    cbks.forEach(function(fn){
                        fn.apply(_t,agu);
                    });
                }
            });
        }
    });

    /*ajax*/
        
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

    ( [ "get", "post" ] ).forEach( function( method ) {
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
                success: callback
            });
        };
    });


    return wfQuery;
}));
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

    /**
    * wfQuery is extends from Array
    */
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
    		var holder = document.createElement("div");
    		if( /^\s*[\<]/.test(selector) ){
    			holder.innerHTML = selector;
                var op = new init( holder.children );
                op._str_ = true;
    			return op;
    		}else{
				return new init( context.querySelectorAll(selector) );    			
    		}
    	}else if( /\[object\sHTML/.test(type) && selector.nodeType || type === "[object global]" ){
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

	
    /**
     * @description  copy from jQuery source code
    */
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
    wfQuery.extend({
        isFunction: function( obj ) {
            return typeof obj === "function";
        },
        isArray: Array.isArray,

        isPlainObject: function( obj ) {
            if ( typeof obj !== "object" || obj.nodeType || obj === obj.window ) {
                return false;
            }
            if ( obj.constructor &&
                    !Object.prototype.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
                return false;
            }
            return true;
        }
    });



    /**
     * @description  most Usually dom-options
    */
    wfQuery.fn.extend({
        text: function(txt){
            if( typeof txt !== "undefined" ){
                return this.each(function(dom){
                    dom.textContent = txt;
                });
            }else{
                return this[0].textContent;
            }
        },
        html: function(html){
            if( typeof html !== "undefined" ){
                return this.each(function(dom){
                    dom.innerHTML = html;
                });
            }else{
                return this[0].innerHTML;
            }
        },

        _appender: function(){
            return this._str_ ? this.clone() : this;
        },
        /**
         * @description dom options
        **/
        append: function(ele){
            return this.cross_each( wfQuery(ele)._appender(), function(dom, el){
                dom.appendChild( el );
            });
        },
        prepend: function(ele){
            return this.cross_each( wfQuery(ele)._appender(), function(dom, el){
                dom.insertBefore( el, dom.firstChild );
            });
        },
        before: function(ele){
            return this.cross_each( wfQuery(ele)._appender(), function(dom, el){
                dom.parentNode.insertBefore( el, dom );
            });
        },
        after: function(ele){
            return this.cross_each( wfQuery(ele)._appender(), function(dom, el){
                dom.parentNode.insertBefore( el, dom.nextSibling );
            });
        },
        remove: function(ele){
            return this.each(function(dom){
                dom.remove();
            });
        },
        empty: function(){
            return this.each(function(dom){
                dom.textContent = "";
            });
        },
        clone: function(){
            return wfQuery( this.map(function(dom,i){
                return dom.cloneNode ? dom.cloneNode(true) : dom;     
            }) );
        },

        /**
         * @description  quick-get functions
        **/
        first: function(){
            return wfQuery( this[0] );
        },
        eq: function(i){
            return wfQuery( this[i] );
        },
        last: function(){
            return wfQuery( this[this.length-1] );
        },
        next: function(){
            return wfQuery( this[0].nextElementSibling );
        },
        prev: function(){
            return wfQuery( this[0].previousElementSibling );
        },
        parent: function(){
            return wfQuery( this[0].parentNode );
        },


        /**
         * @description parents 处理第一个元素的的父标签列表
         * @param {String} filter 
         * @param {HTMLElement} root 
        **/
        parents: function(filter, root){
            var _parents = [], tmp = this[0];
            root = root || document;

            while( tmp && (tmp = tmp.parentNode) ){
                if( filter && tmp.matches && tmp.matches(filter) || !filter ){
                    _parents.push( tmp )
                }
                if( tmp === root ){
                    break;
                }
            }
            return wfQuery(_parents);
        },


        /**
         * @description  with muti-selectors
        **/
        filter: function(match){
            var tar = [];
            this.each( function(dom){
                if( dom.matches && dom.matches(match) ){
                    tar.push( dom );
                }
            } );
            return wfQuery( tar );
        },
        find: function(filter){
            var _children = [];
            this.each(function(dom){
                _children = [].concat.apply(_children, wfQuery( dom.querySelectorAll(filter) ) );
            });
            return wfQuery( _children );
        },


        has: function( ele ){
            ele = wfQuery(ele);
            return ele[0] && !!this.filter(function(dom){
                return dom === ele[0];
            }).length;
        },
        children: function(filter){
            var _children = [];
            this.each(function(dom){
                _children = [].concat.apply(_children, wfQuery(dom.children) );
            });
            return wfQuery( _children.filter(function(el){
                return !filter || el.matches(filter)
            }) );
        },
        each: function(fn){
            this.forEach(fn);
            return this;
        },
        /**
        * @description  
        * @param {wfQuery} ele
        * @param {Function} fn( el1, el2 )
        */
        cross_each: function(ele, fn){
            var selector = wfQuery(ele);
            return this.each(function(dom){
                selector.forEach(function(el){
                    fn( dom, el );
                });
            });
        }
    });

    /**
     * @description addEventListener 
    **/
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
                    var tar = $( e.target ), par = tar.parents(selector);
                    if( tar.filter(selector).length ){
                        fn.call( tar, e );
                    }else if( par.length ){
                        fn.call( par, e );
                    }else if(typeof fn2 === "function"){
                        fn2.call( this, e );
                    }
                } : fn ,false);
            });
        },
        /**
         * @description removeEventListener 
        **/
        off: function(eventType){
            return this.each(function(dom){
                delete dom["wf_"+eventType];
                dom.removeEventListener( eventType );
            });
        },
        trigger: function(eventType){
            var agu = arguments;
            return this.each(function(dom){
                var cbks = dom["wf_"+eventType] || [];
                if( dom[eventType] ){
                    dom[eventType]();
                }else{
                    cbks.forEach(function(fn){
                        fn.apply(dom,agu);
                    });
                }
            });
        }
    });

    /**
     * @description props 
    **/
    wfQuery.fn.extend({
        attr: function(name, value){
            var _this = this;
            if( !name || !this.length ){
                return null;
            }else if( typeof name === "string" && typeof value !== "undefined" ){
                var o = {};
                o[name] = value;
                return this.attr(o);
            }else if( typeof name === "object" ){
                for(var i in name){
                    (function(n,v){
                        _this.each(function(dom){
                            dom.setAttribute( n, v );
                        });
                    })(i,name[i]);
                }
                return this;
            }else{
                return this[0].getAttribute(name);
            }
        },
        addClass: function(className){
            return this.each(function(dom){
                dom.classList.add(className);
            });
        },
        removeClass: function(className){
            return this.each(function(dom){
                dom.classList.remove(className);
            });
        },
        toggleClass: function(className){
            return this.each(function(dom){
                dom.classList.contains(className) ? dom.classList.remove(className) : dom.classList.add(className);
            });
        },
        css: function(name, value){
            var _this = this;
            if( !name || !this.length ){
                return null;
            }else if( typeof name === "string" && typeof value !== "undefined" ){
                var o = {};
                o[name] = value;
                return this.css(o);
            }else if( typeof name === "object" ){
                for(var i in name){
                    (function(n,v){
                        if( /width|height|left|right|top|bottom|size|radius/i.test(n) && /^[\d\.]+$/.test(v) ){
                            v += "px";      //含有这些字符串的style属性名支持一下纯数字写法
                        }
                        _this.each(function(dom){
                            dom.style[n] = v;
                        });
                    })(i,name[i]);
                }
                return this;
            }else{
                return window.getComputedStyle( this[0] )[name];
            }
        },
        show: function(){
            return this.css({display:""});
        },
        hide: function(){
            return this.css({display:"none"});
        },
        toggle: function(){
            return this.each(function(dom){
                window.getComputedStyle( dom ).display === "none" ? dom.style.display = "" : dom.style.display = "none";
            });
        },
        val: function(value){
            if( !this.length ){
                return null;
            }else if(typeof value === "undefined"){
                return this[0].value;
            }else{
                return this.each(function(dom){
                    dom.value = value;
                });
            } 
        }
    });


    return wfQuery;
}));
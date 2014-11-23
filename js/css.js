    
    wfQuery.fn.extend({
        css: function(name, value){
            var _this = this;
            if( !name || !this.length ){
                return _this;
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
        }
    });
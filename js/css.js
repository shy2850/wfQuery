    
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
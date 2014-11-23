    
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
                var list = dom.classList;
                list.contains(className) ? list.remove(className) : list.add(className);
            });
        }
    });
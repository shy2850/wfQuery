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
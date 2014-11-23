    
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
        },
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
        }
    });
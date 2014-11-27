    
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


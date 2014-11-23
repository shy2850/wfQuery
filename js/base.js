    
    wfQuery.fn.extend({
        each: function(fn){
            this.forEach(fn);
            return this;
        },
        /**
        * @description 交叉循环, 将 ele转化成wfQuery对象后, 做笛卡尔积循环 
        * @param {wfQuery} ele
        * @param {Function} fn( dom, el )
        */
        cross_each: function(ele, fn){
            var ele = wfQuery(ele);
            return this.each(function(dom){
                ele.forEach(function(el){
                    fn( dom, el );
                });
            });
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
                return this.each(function(dom){
                    dom[name] = value;
                });
            } 
        }

    });


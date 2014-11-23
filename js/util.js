    
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
        },
        /**
        * @description 交叉循环, 将 ele转化成wfQuery对象后, 做笛卡尔积循环 
        * @param {wfQuery} ele
        * @param {Function} fn( dom, el )
        */
        cross_each: function(base, ele, fn){
            return base.map(function(dom){
                ele.forEach(function(el){
                    fn( dom, el );
                });
            });
        }
    });

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
        }else if( "[object HTMLCollection]" === type || "[object NodeList]" === type || "[object Array]" === type ){
            this.length = selector.length;
            for (var i = 0; i < selector.length; i++) {
                this[i] = selector[i];
            };
            return this;
        }else if( wfQuery.isFunction( selector ) ){
            selector(wfQuery);
        }else{
            this.length = 1; 
            this[0] = selector;
            return this;
        }

    };
    init.prototype = wfQuery.fn;
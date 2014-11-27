    
    wfQuery.fn.extend({
        /*根据创建时是否为字符串创建判断: dom操作时候是否使用复制操作*/
        _appender: function(ele){
            return wfQuery(ele);
        },
        append: function(ele){
            return this.cross_each( this._appender(ele), function(dom, el){
                dom.appendChild( el );
            });
        },
        prepend: function(ele){
            return this.cross_each( this._appender(ele), function(dom, el){
                dom.insertBefore( el, dom.firstChild );
            });
        },
        before: function(ele){
            return this.cross_each( this._appender(ele), function(dom, el){
                dom.parentNode.insertBefore( el, dom );
            });
        },
        after: function(ele){
            return this.cross_each( this._appender(ele), function(dom, el){
                dom.parentNode.insertBefore( el, dom.nextSibling );
            });
        },
        empty: function(){
            return this.each(function(){
                this.textContent = "";
            });
        },
        remove: function(){
            return this.each(function(){
                this.parentNode.removeChild(this);
            });
        },
        clone: function(){
            return wfQuery( this.map(function(dom,i){
                return dom.cloneNode ? dom.cloneNode(true) : dom;     
            }) );
        }
    });
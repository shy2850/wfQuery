    
    wfQuery.fn.extend({
        /*根据创建时是否为字符串创建判断: dom操作时候是否使用复制操作*/
        _appender: function(ele){
            return this.length && this[0].parentNode && this[0].parentNode.tagName === "WF" ? this.clone() : this;
        },
        append: function(ele){
            return this.cross_each( wfQuery(ele)._appender(), function(dom, el){
                dom.appendChild( el );
            });
        },
        prepend: function(ele){
            return this.cross_each( wfQuery(ele)._appender(), function(dom, el){
                dom.insertBefore( el, dom.firstChild );
            });
        },
        before: function(ele){
            return this.cross_each( wfQuery(ele)._appender(), function(dom, el){
                dom.parentNode.insertBefore( el, dom );
            });
        },
        after: function(ele){
            return this.cross_each( wfQuery(ele)._appender(), function(dom, el){
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
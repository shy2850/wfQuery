    var p = document.createElement('p'), w3cMatches = ["matchesSelector","webkitMatchesSelector","msMatchesSelector","mozMatchesSelector","oMatchesSelector"].filter(function(i){
        return p[i];
    })[0];
    wfQuery.fn.extend({
        /**
         * @description  quick-get functions
        **/
        first: function(){
            return wfQuery( this[0] );
        },
        eq: function(i){
            return wfQuery( this[ (this.length+i) % this.length ] );
        },
        last: function(){
            return wfQuery( this[this.length-1] );
        },
        next: function(){
            return wfQuery( !this[0] ? null : this[0].nextElementSibling );
        },
        prev: function(){
            return wfQuery( !this[0] ? null : this[0].previousElementSibling );
        },
        parent: function(){
            return wfQuery( !this[0] ? null : this[0].parentNode );
        },

        /**
         * @description parents 处理第一个元素的的父标签列表
         * @param {String} filter 
         * @param {HTMLElement} root 
        **/
        parents: function(filter, root){
            var _parents = [], tmp = this[0];
            root = root || document;
            while( tmp && tmp != root && (tmp = tmp.parentNode) ){
                _parents.push( tmp );
            }
            return wfQuery(_parents).filter(filter);
        },
        /**
         * @description  with muti-selectors
        **/
        filter: function(match){
            var tar = [];
            if( !match ){
                return this;
            }else if( typeof match === "function"){   /*原生filter保留*/
                tar = [].filter.call(this, match);
            }else{
                this.each( function(){
                    var _t = this;
                    if( _t[w3cMatches] && _t[w3cMatches](match) ){
                        tar.push( _t );
                    }
                } );
            }
            return wfQuery( tar );
        },
        not: function(no){
            var _this = this;
            return wfQuery( [].filter.call(_this,function(dom){
                var flag;
                try{
                    flag = dom[w3cMatches] && dom[w3cMatches](no);
                }catch(e){
                    flag = dom === wfQuery(no)[0];
                }
                return !flag;
            }) );
        },
        siblings: function(filter){
            return this.parent().children(filter).not(this);
        },
        nextAll: function(filter){
            var all = []
            this.each(function(){
                var children = $(this).parent().children(), i = children.indexOf(this);
                all = all.concat( children.slice(i+1) );
            });
            return wfQuery( all ).filter(filter);
        },
        find: function(filter){
            var _children = [];
            this.each(function(){
                _children = [].concat.apply(_children, wfQuery( this.querySelectorAll(filter) ) );
            });
            return wfQuery( _children );
        },
        children: function(filter){
            var _children = [];
            this.each(function(){
                var _t = this, children = _t.children;
                if( !children ){
                    children = [].filter.call(_t.childNodes, function(el){return !!el.tagName});
                }
                _children = [].concat.apply(_children, wfQuery(children) );
            });
            return wfQuery( _children ).filter(filter);
        }
    });
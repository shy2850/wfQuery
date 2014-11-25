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

            while( tmp && (tmp = tmp.parentNode) ){
                if( filter && tmp[w3cMatches] && tmp[w3cMatches](filter) || !filter ){
                    _parents.push( tmp )
                }
                if( tmp === root ){
                    break;
                }
            }
            return wfQuery(_parents);
        },
        /**
         * @description  with muti-selectors
        **/
        filter: function(match){
            var tar = [];
            if( typeof match === "function"){   /*原生filter保留*/
                tar = [].filter.call(this);
            }else{
                this.each( function(dom){
                    if( dom[w3cMatches] && dom[w3cMatches](match) ){
                        tar.push( dom );
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
        find: function(filter){
            var _children = [];
            this.each(function(dom){
                _children = [].concat.apply(_children, wfQuery( dom.querySelectorAll(filter) ) );
            });
            return wfQuery( _children );
        },
        children: function(filter){
            var _children = [];
            this.each(function(dom){
                var children = dom.children;
                if( !children ){
                    children = [].filter.call(dom.childNodes, function(el){return !!el.tagName});
                }
                _children = [].concat.apply(_children, wfQuery(children) );
            });
            return wfQuery( _children.filter(function(el){
                return !filter || el[w3cMatches](filter)
            }) );
        }
    });
    
    wfQuery.fn.extend({
        on: function(options, selector, fn, fn2){
            var eventTypes = (options + "").match(/\w+/g) || [];
            
            if( !eventTypes.length ){
                return this;
            }

            if( typeof selector === "function" ){
                fn = selector;
                selector = null;
            }

            return this.cross_each(eventTypes, function(dom, eventType){
                dom["wf_"+eventType] = dom["wf_"+eventType] || [];
                dom["wf_"+eventType].push(fn);
                dom.addEventListener(eventType, selector ? function(e){
                    var tar = wfQuery( e.target ), par = tar.parents(selector);
                    if( tar.filter(selector).length ){
                        fn.call( tar, e );
                    }else if( par.length ){
                        fn.call( par, e );
                    }else if(typeof fn2 === "function"){
                        fn2.call( this, e );
                    }
                } : fn ,false);
                if( dom.cloneNode && dom.cloneNode.list instanceof Array && dom.cloneNode.list.length ){
                    console.log( dom.cloneNode.list );
                    dom.cloneNode.list.on( options, selector, fn, fn2 );
                }
            });
        },
        /**
         * @description removeEventListener 
        **/
        off: function(eventType){
            return this.each(function(){
                delete this["wf_"+eventType];
                this.removeEventListener( eventType );
            });
        },
        trigger: function(eventType){
            var agu = arguments; 
            return this.each(function(){
                var _t = this, cbks = _t["wf_"+eventType] || [];
                if( _t[eventType] ){
                    _t[eventType]();
                }else{
                    cbks.forEach(function(fn){
                        fn.apply(_t,agu);
                    });
                }
            });
        }
    });
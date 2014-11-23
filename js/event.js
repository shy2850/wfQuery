    
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
            });
        },
        /**
         * @description removeEventListener 
        **/
        off: function(eventType){
            return this.each(function(dom){
                delete dom["wf_"+eventType];
                dom.removeEventListener( eventType );
            });
        },
        trigger: function(eventType){
            var agu = arguments;
            return this.each(function(dom){
                var cbks = dom["wf_"+eventType] || [];
                if( dom[eventType] ){
                    dom[eventType]();
                }else{
                    cbks.forEach(function(fn){
                        fn.apply(dom,agu);
                    });
                }
            });
        }
    });
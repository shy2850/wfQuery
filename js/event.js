    
    wfQuery.fn.extend({
        on: function(options, selector, fn, fn2){
            var f = fn,
                eventTypes = (options + "").match(/\w+/g) || [];
            
            if( !eventTypes.length ){
                return this;
            }

            if( typeof selector === "function" ){
                f = selector;
                selector = null;
            }else{
                f = function(e){
                    var tar = wfQuery( e.target ), par = tar.parents(selector);
                    if( tar.filter(selector).length ){
                        return fn.call( tar[0], e );
                    }else if( par.length ){
                        return fn.call( par[0], e );
                    }else if(typeof fn2 === "function"){
                        return fn2.call( this, e );
                    }
                };
            }

            return this.cross_each(eventTypes, function(dom, eventType){
                dom["wf_"+eventType] = dom["wf_"+eventType] || [];
                dom["wf_"+eventType].push(f);
                dom.addEventListener(eventType, f ,false);
                if( dom.cloneNode && dom.cloneNode.list instanceof Array && dom.cloneNode.list.length ){
                    dom.cloneNode.list.on( options, selector, f, fn2 );
                }
            });
        },
        /**
         * @description removeEventListener 
        **/
        off: function(eventType){
            return this.each(function(){
                var  _t = this,
                    allEvent = _t["wf_"+eventType] || [];
                allEvent.forEach(function(ev){
                    _t.removeEventListener( eventType, ev, false);
                });
                delete _t["wf_"+eventType];
            });
        },
        trigger: function(eventType){
            var agu = arguments; 
            return this.each(function(){
                var _t = this, cbks = _t["wf_"+eventType] || [];
                if( document.createElement(_t.tagName)[eventType] ){
                    _t[eventType]();
                }else{
                    cbks.forEach(function(fn){
                        fn.apply(_t,agu);
                    });
                }
            });
        }
    });
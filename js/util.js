    
    wfQuery.extend({
        trim: function(str){
            return (str || "").replace(/^\s*(.*?)\s*$/,"$1");
        },
        isFunction: function( obj ) {
            return typeof obj === "function";
        },
        isArray: Array.isArray,

        isPlainObject: function( obj ) {
            if ( typeof obj !== "object" || obj.nodeType || obj === obj.window ) {
                return false;
            }
            if ( obj.constructor && !Object.prototype.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
                return false;
            }
            return true;
        },
        obj2array: function(o){
            var res = [];
            for(var k in o){
                if( wfQuery.isArray(o[k]) ){
                    o[k].forEach( function(el){
                        res.push({
                            name: k,
                            value: el
                        });
                    } );
                }else{
                    res.push({
                        name: k,
                        value: o[k]
                    });
                }
            }
            return res;
        },
        array2obj: function(a){
            var res = {};
            a.forEach(function(i){
                if( wfQuery.isArray( res[i.name] ) ){
                    res[i.name].push( i.value );
                }else if( typeof res[i.name] === "string" ){
                    res[i.name] = [ res[i.name], i.value ];
                }else{
                    res[i.name] = i.value;
                }
            });
            return res;
        },
        param: function(a){
            var arr;
            if( wfQuery.isArray(a) ){
                arr = a;
            }else if( typeof a === "object" ){
                arr = wfQuery.obj2array( a );
            }else{
                return a;
            }
            return arr.map(function(item){
                if( typeof item.value === "undefined" ){ 
                    return ""; 
                }else{
                    return encodeURIComponent( item.name ) + "=" + encodeURIComponent( item.value );
                }
            }).join("&").replace(/%20/g,"+");
        }
    });

    wfQuery.fn.extend({
        serializeArray: function(){
            var form = this[0], res = [];
            if( form && form.tagName.toUpperCase() === "FORM" ){
                [].map.call( form.elements ,function( inp ){
                    if( !inp.name || inp.disabled ){
                        return ;
                    }
                    switch( inp.type ){
                        case "radio":
                        case "checkbox":
                            if( !inp.checked ) return;
                        case "input":
                        default:
                            res.push({
                                name: inp.name,
                                value: inp.value
                            });
                    }
                });
            }
            return res;
        },
        serialize: function(){
            return wfQuery.param( this.serializeArray() );
        }
    });

    wfQuery.extend = wfQuery.fn.extend = function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;

        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[ i ] || {};
            i++;
        }

        if ( typeof target !== "object" && !wfQuery.isFunction(target) ) {
            target = {};
        }

        if ( i === length ) {
            target = this;
            i--;
        }

        for ( ; i < length; i++ ) {
            if ( (options = arguments[ i ]) != null ) {
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];
                    if ( target === copy ) {
                        continue;
                    }
                    if ( deep && copy && ( wfQuery.isPlainObject(copy) || (copyIsArray = wfQuery.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && wfQuery.isArray(src) ? src : [];

                        } else {
                            clone = src && wfQuery.isPlainObject(src) ? src : {};
                        }
                        target[ name ] = wfQuery.extend( deep, clone, copy );
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }
        return target;
    };
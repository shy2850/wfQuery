/**
     * 将两个或更多对象的内容合并到第一个对象。
     *
     * @param {Object} o 基础对象
     * @param {...Object} o1 没有第二个参数时，附加属性到wfQuery对象
     * @return {Object} 第一个对象
     */
    wfQuery.extend = wfQuery.fn.extend = function () {
        var options;
        var name;
        var src;
        var copy;
        var copyIsArray;
        var clone;
        var target = arguments[0] || {};
        var i = 1;
        var length = arguments.length;
        var deep = false;
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (typeof target !== 'object' && !wfQuery.isFunction(target)) {
            target = {};
        }
        if (i === length) {
            target = this;
            i--;
        }
        for (; i < length; i++) {
            if ((options = arguments[i])) {
                for (name in options) {
                    if (!options.hasOwnProperty(name)) {
                        break;
                    }
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (wfQuery.isPlainObject(copy) || (copyIsArray = wfQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && wfQuery.isArray(src) ? src : [];
                        }
                        else {
                            clone = src && wfQuery.isPlainObject(src) ? src : {};
                        }
                        target[name] = wfQuery.extend(deep, clone, copy);
                    }
                    else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    };

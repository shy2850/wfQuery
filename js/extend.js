    /**
     * 将两个或更多对象的内容合并到第一个对象。
     * 这里第一个对象以下称为：待扩展对象
     *         后续对象称为：待合并对象
     *
     * @param {?boolean} deep 是否深度扩展, 默认不深度扩展, 首个参数为true进行深度扩展
     * @param {...Object} o 可变参数，长度不为零。
     *          长度为1时： 待扩展对象默认为执行方法的从属对象 wfQuery 或 wfQuery.fn
     *          长度为2+时： 第一个对象为待扩展对象, 从后面开始依次扩展属性到待扩展对象
     *              如： var base = {a:1,b:[1,2,3],d:{d1:1,d2:2}};
     *                  extend( base, {b:2}, {c:3}, {c:4,d:5}, {c:6,a:7} );
     *                  返回值 = base = {a:7,b:2,c:6,d:5};
     *                  extend( true, base, {b:[2,5]}, {c:3}, {c:4,d:{d3:3}}, {c:6,a:7} );
     *                  返回值 = base = {a:7,b:[2,5,3],c:6,d:{d1:1,d2:2,d3:3}};
     * @return {Object} 待扩展对象
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

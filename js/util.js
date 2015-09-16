    wfQuery.extend({
        trim: function (str) {
            return (str || '').replace(/^\s*(.*?)\s*$/, '$1');
        },
        isFunction: function (obj) {
            return typeof obj === 'function';
        },
        isArray: Array.isArray,
        isPlainObject: function (obj) {
            if (typeof obj !== 'object' || obj.nodeType || obj === obj.window) {
                return false;
            }
            if (obj.constructor && !Object.prototype.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }
            return true;
        },

        /**
         * 将一个数据对象转化成一个序列换数组 。
         *
         * @param {Object} o 传入的对象
         * @return {Array} 序列化数组，形如：[{name:'a',value:1},{name:'b',value:2}]
         */
        obj2array: function (o) {
            var res = [];
            for (var k in o) {
                if (wfQuery.isArray(o[k])) {
                    o[k].forEach(function (el) {
                        res.push({
                            name: k,
                            value: el
                        });
                    });
                }
                else {
                    res.push({
                        name: k,
                        value: o[k]
                    });
                }
            }
            return res;
        },

        /**
         * 将一个序列换数组转化成一个数据对象。
         *
         * @param {Array} a 传入的序列化数组
         * @return {Object} 返回对象
         */
        array2obj: function (a) {
            var res = {};
            a.forEach(function (i) {
                if (wfQuery.isArray(res[i.name])) {
                    res[i.name].push(i.value);
                }
                else if (typeof res[i.name] === 'string') {
                    res[i.name] = [res[i.name], i.value];
                }
                else {
                    res[i.name] = i.value;
                }
            });
            return res;
        },

        /**
         * 将一个序列换数组或数据对象转化成 序列化字符串。
         *
         * @param {Object} a 传入的序列化数组或者对象
         * @return {string} 序列化字符串，形如： a=1&b=2&c=3&c=4
         */
        param: function (a) {
            var arr;
            if (wfQuery.isArray(a)) {
                arr = a;
            }
            else if (typeof a === 'object') {
                arr = wfQuery.obj2array(a);
            }
            else {
                return a;
            }
            return arr.map(function (item) {
                if (typeof item.value === 'undefined') {
                    return '';
                }
                return encodeURIComponent(item.name) + '=' + encodeURIComponent(item.value);
            }).join('&').replace(/%20/g, '+');
        }
    });
    wfQuery.fn.extend({

        /**
         * 将一个表单内的elements值转化成一个序列化数组。
         * this 必须是一个form， 否则返回空数组 []
         *
         * @return {Array} 序列化数组
         */
        serializeArray: function () {
            var form = this[0];
            var res = [];
            if (form && form.tagName.toUpperCase() === 'FORM') {
                [].map.call(form.elements, function (inp) {
                    if (!inp.name || inp.disabled) {
                        return;
                    }
                    switch (inp.type) {
                        case 'radio':
                        case 'checkbox':
                            if (!inp.checked) {
                                return;
                            }
                        case 'input':
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

        /**
         * 将一个表单内的elements值转化成一个序列化字符串。
         * this 必须是一个form， 否则返回 ''
         *
         * @return {string} 序列化字符串
         */
        serialize: function () {
            return wfQuery.param(this.serializeArray());
        }
    });

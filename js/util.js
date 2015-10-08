    /**
     * @file  基本数据操作相关方法, 核心依赖
     * @author shiyangyang(shiyangyang@baidu.com)
     * @namespace wfquery/ajax
     */
    wfQuery.extend({

        /**
         * 去除字符串收尾的空白(仅支持匹配正则元字符\s)
         *
         * @param {string} str 传入的字符串参数, 为空时, 返回''
         * @return {string}
         */
        trim: function (str) {
            return (str || '').replace(/^\s*(.*?)\s*$/, '$1');
        },

        /**
         * 判断一个对象是否一个方法， 包括使用new Function() 创建的
         *
         * @param {Function} fn 需要判断的对象
         * @return {boolean}
         */
        isFunction: function (fn) {
            return pto.toString.call(fn) === '[object Function]';
        },
        isArray: Array.isArray,

        /**
         * 判断一个对象是否 Object 源对象(未使用其他构造方法创建或其他基本对象)
         *
         * @param {Object} obj 需要判断的对象
         * @return {boolean}
         */
        isPlainObject: function (obj) {
            if (typeof obj !== 'object' || obj.nodeType || obj === obj.window) {
                return false;
            }
            if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }
            return true;
        },

        /**
         * 将一个数据对象转化成一个序列换数组 。
         *
         * @param {Object} dataObj 传入的简单数据对象
         * @return {Array} 序列化数组，形如：[{name:'a',value:1},{name:'b',value:2}]
         */
        obj2array: function (dataObj) {
            var res = [];
            for (var key in dataObj) {
                if (dataObj.hasOwnProperty(key)) {
                    if (wfQuery.isArray(dataObj[key])) {
                        for (var i = 0; i < dataObj[key].length; i++) {
                            res.push({
                                name: key,
                                value: dataObj[key][i]
                            });
                        }
                    }
                    else {
                        res.push({
                            name: key,
                            value: dataObj[key]
                        });
                    }
                }
            }
            return res;
        },

        /**
         * 将一个序列换数组转化成一个数据对象。
         *
         * @param {Array} serializeArr 传入的序列化数组
         * @return {Object} 返回对象
         */
        array2obj: function (serializeArr) {
            var res = {};
            var setResToArr = function (i) {
                if (wfQuery.isArray(res[i.name])) {
                    res[i.name].push(i.value);
                }
                else if (typeof res[i.name] === 'string') {
                    res[i.name] = [res[i.name], i.value];
                }
                else {
                    res[i.name] = i.value;
                }
            };
            serializeArr.forEach(setResToArr);
            return res;
        },

        /**
         * 将一个序列换数组或数据对象转化成 序列化字符串。
         *
         * @param {*} serializeArr 传入的序列化数组对象或者string
         * @return {string} 序列化字符串，形如： a=1&b=2&c=3&c=4
         */
        param: function (serializeArr) {
            var arr;
            // 如果是序列化数组，赋值备用
            if (wfQuery.isArray(serializeArr)) {
                arr = serializeArr;
            }
            // 如果是数据对象，转化成序列化数组备用
            else if (typeof serializeArr === 'object') {
                arr = wfQuery.obj2array(serializeArr);
            }
            // 如果是字符串，直接当作序列化完成的字符串返回
            else {
                return serializeArr;
            }
            // 序列化过程
            return arr.map(function (item) {
                if (typeof item.value === 'undefined') {
                    return '';
                }
                return encodeURIComponent(item.name) + '=' + encodeURIComponent(item.value);
            }).join('&').replace(/%20/g, '+');
        }
    });

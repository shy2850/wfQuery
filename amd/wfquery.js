/**
 * @file  jQuery-API 简单实现, gzip < 4k 方便移动端调用
 *         1. 基于Array.prototype
 *         2. 选择器直接使用 querySelectorAll
 *         3. 事件绑定仅支持 on/off/trigger, 支持代理(阻止事件冒泡)
 *         4. 不支持 animate 相关
 *         5. Ajax支持基于ajax2.0的文件上传和进度设置
 * @author shiyangyang(shiyangyang@baidu.com)
 * @namespace wfquery
 */
define('wfquery', function () {
    var doc = window.document;
    var pto = Object.prototype;

    /**
     *  like jQuery extends Array
     *
     * @exports wfQuery
     * @extends Array
     * @param {string} selector 选择器可以是：css选择器、html片段或者DOMCollection等
     * @param {string} context 使用css选择器时包含标签
     * @return {wfQuery}
     */
    var wfQuery = function (selector, context) {
        return new wfQuery.fn.Init(selector, context);
    };

    wfQuery.fn = wfQuery.prototype = [];
    wfQuery.fn.constructor = wfQuery;

    /**
     * wfQuery 初始化方法
     *
     * @param {string} selector 选择器可以是：css选择器、html片段或者DOMCollection等
     * @param {string} context 使用css选择器时包含标签
     * @return {wfQuery} 返回wfQuery对象
     */
    var Init = wfQuery.fn.Init = function (selector, context) {
        context = context || doc;
        var type = Object.prototype.toString.call(selector);
        if (!selector) {
            return this;
        }
        else if (selector.constructor === wfQuery) {
            return selector;
        }
        else if (type === '[object String]') {
            var holder = document.createElement('WF');
            if (/^\s*[\<]/.test(selector)) {
                holder.innerHTML = selector;
                return new Init(holder.children);
            }
            return new Init(context.querySelectorAll(selector));
        }
        else if ('[object HTMLCollection]' === type || '[object NodeList]' === type || '[object Array]' === type) {
            this.length = selector.length;
            for (var i = 0; i < selector.length; i++) {
                this[i] = selector[i];
            }
            return this;
        }
        else if (wfQuery.isFunction(selector)) {
            selector(wfQuery);
        }
        else {
            this.length = 1;
            this[0] = selector;
            return this;
        }
    };
    Init.prototype = wfQuery.fn;


    /**
     * 将两个或更多对象的内容合并到第一个对象。
     * 这里第一个对象以下称为：待扩展对象
     *         后续对象称为：待合并对象
     *
     * @param {boolean} isDeep 是否深度扩展, 默认不深度扩展, 首个参数为true进行深度扩展
     * @param {Object} obj 可变参数，长度不为零。
     *          长度为1时： 待扩展对象默认为执行方法的从属对象 wfQuery 或 wfQuery.fn
     *          长度为2+时： 第一个对象为待扩展对象, 从后面开始依次扩展属性到待扩展对象
     *              如： var base = {a:1,b:[1,2,3],d:{d1:1,d2:2}};
     *                  extend( base, {b:2}, {c:3}, {c:4,d:5}, {c:6,a:7} );
     *                  返回值 = base = {a:7,b:2,c:6,d:5};
     *                  extend( true, base, {b:[2,5]}, {c:3}, {c:4,d:{d3:3}}, {c:6,a:7} );
     *                  返回值 = base = {a:7,b:[2,5,3],c:6,d:{d1:1,d2:2,d3:3}};
     * @return {Object} 待扩展对象
     */
    wfQuery.extend = wfQuery.fn.extend = function (isDeep, obj) {
        var target = isDeep || {};
        // 根据首个参数不同值，确定待合并对象组循环起始参数位置
        var objIndex = 1;
        var length = arguments.length;
        var deep = false;
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[objIndex] || {};
            objIndex++;
        }
        if (typeof target !== 'object' && !wfQuery.isFunction(target)) {
            target = {};
        }
        if (objIndex === length) {
            target = this;
            objIndex--;
        }

        var name;
        var options;
        var src;
        var copy;
        var copyIsArray;
        var clone;
        for (var i = objIndex; i < length; i++) {
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


    /**
     * @file  wfQuery基础原型方法
     * @author shiyangyang(shiyangyang@baidu.com)
     * @namespace wfquery/base
     */
    wfQuery.fn.extend({
        each: function (fn) {
            this.forEach(function (el, i) {
                fn.call(el, i, el);
            });
            return this;
        },

        /**
         * 两个wfQuery对象进行笛卡尔交叉循环，执行fn。
         *
         * @param {wfQuery} ele wfQuery对象或者选择器
         * @param {Function} fn 交叉循环时执行的方法
         *          fn(that,other) that:当前循环元素， other: ele循环项
         * @return {wfQuery} 返回原wfQuery链式对象
         */
        crossEach: function (ele, fn) {
            var $ele = wfQuery(ele);
            return this.each(function () {
                var $t = this;
                $ele.forEach(function (el) {
                    fn($t, el);
                });
            });
        },

        /**
         * 特殊属性设置方法，用于attr、css、data等方法。
         *
         * @private
         *
         * @param {string} name 属性key
         * @param {Object} value 属性value
         * @param {Function} get get方法
         * @param {Function} set set方法
         *
         * @return {wfQuery} 返回原wfQuery链式对象
         */
        _attr: function (name, value, get, set) {
            var $this = this;
            var eachKV = function (n, v) {
                var eachSet = function () {
                    if (wfQuery.isFunction(set)) {
                        set.call(this, n, v);
                    }
                };
                $this.each(eachSet);
            };
            if (typeof name === 'string' && typeof value !== 'undefined') {
                var o = {};
                o[name] = value;
                return this._attr(o, null, get, set);
            }
            if (typeof name === 'object') {
                for (var i in name) {
                    if (name.hasOwnProperty(i)) {
                        eachKV(i, name[i]);
                    }
                }
                return this;
            }
            return this.length ? get.call(this[0], name) : null;
        },

        /**
         *
         * DOM直接属性设置方法，用于html、text等方法。
         *
         * @private
         * @param {string} name 属性key
         * @param {Object} value 属性value
         *
         * @return {wfQuery} 返回原wfQuery链式对象
         */
        _getSet: function (name, value) {
            if (!this.length) {
                return;
            }
            if (typeof value === 'undefined') {
                return this[0][name];
            }
            return this.each(function () {
                this[name] = value;
            });
        }
    });

    return wfQuery;
});

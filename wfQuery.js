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
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    }
    else {
        root.wfQuery = factory();
        window.$ = window.$ || root.wfQuery;
    }
}(this, function () {
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



    /**
     * @file  表单序列化相关方法
     * @author shiyangyang(shiyangyang@baidu.com)
     * @namespace wfquery/serialize
     */
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


    /**
     * @file  dom查询相关各种方法
     * @author shiyangyang(shiyangyang@baidu.com)
     * @namespace wfquery/query
     */
    var p = document.createElement('p');

    /**
     *
     * 兼容性的 matchesSelector 获取
     * @private
     * @type {Function}
     *
     */
    var w3cMatches = [
        'matchesSelector',
        'webkitMatchesSelector',
        'msMatchesSelector',
        'mozMatchesSelector',
        'oMatchesSelector'
    ].filter(function (i) {
        return p[i];
    })[0];
    wfQuery.fn.extend({

        /**
         * 获取wfQuery对象数组中的第一个元素并且封装为一个新的wfQuery对象。
         *
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        first: function () {
            return wfQuery(this[0]);
        },

        /**
         * 获取wfQuery对象数组中的第i个元素并且封装为一个新的wfQuery对象。
         *
         * @param {number} i 需要查找的元素下标
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        eq: function (i) {
            return wfQuery(this[(this.length + i) % this.length]);
        },

        /**
         * 获取wfQuery对象数组中的第1个元素在父级列表中的位置。
         *
         * @return {number} 返回查找到的位置下标
         */
        index: function () {
            return this.parent().children().indexOf(this[0]);
        },

        /**
         * 获取wfQuery对象数组中的最后一个元素并且封装为一个新的wfQuery对象。
         *
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        last: function () {
            return wfQuery(this[this.length - 1]);
        },

        /**
         * 获取wfQuery对象数组中的第一个元素在document中的下一个元素, 并且封装为一个新的wfQuery对象。
         *
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        next: function () {
            return wfQuery(!this[0] ? null : this[0].nextElementSibling);
        },

        /**
         * 获取wfQuery对象数组中的第一个元素在document中的上一个元素, 并且封装为一个新的wfQuery对象。
         *
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        prev: function () {
            return wfQuery(!this[0] ? null : this[0].previousElementSibling);
        },

        /**
         * 获取wfQuery对象数组中的第一个元素在document中的父级元素, 并且封装为一个新的wfQuery对象。
         *
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        parent: function () {
            return wfQuery(!this[0] ? null : this[0].parentNode);
        },

        /**
         * 获取dom父级标签列表。
         *
         * @param {string} filter 通过选择器过滤选择结果
         * @param {Element} root 父级列表根节点范围
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        parents: function (filter, root) {
            var $parents = [];
            var tmp = this[0];
            root = root || document;
            while (tmp && tmp !== root && (tmp = tmp.parentNode)) {
                $parents.push(tmp);
            }
            return wfQuery($parents).filter(filter);
        },

        /**
         * 基于当前wfQuery对象dom列表进行的matchesSelector过滤。
         *
         * @param {string} match 通过选择器过滤选择结果
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        filter: function (match) {
            var tar = [];
            if (!match) {
                return this;
            }
            /* 原生filter保留 */
            else if (typeof match === 'function') {
                tar = [].filter.call(this, match);
            }
            else {
                this.each(function () {
                    var $t = this;
                    if ($t[w3cMatches] && $t[w3cMatches](match)) {
                        tar.push($t);
                    }
                });
            }
            return wfQuery(tar);
        },

        /**
         * 基于当前wfQuery对象dom列表进行的matchesSelector过滤。
         *
         * @param {string} no 不被通过选择器
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        not: function (no) {
            var $this = this;
            return wfQuery([].filter.call($this, function (dom) {
                var flag;
                try {
                    flag = dom[w3cMatches] && dom[w3cMatches](no);
                }
                catch(e) {
                    flag = dom === wfQuery(no)[0];
                }
                return !flag;
            }));
        },

        /**
         * 获取wfQuery对象数组中的第1个元素在document中的所有兄弟元素。
         *
         * @param {string} filter 通过选择器过滤选择结果
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        siblings: function (filter) {
            return this.parent().children(filter).not(this);
        },

        /**
         * 获取wfQuery对象数组中的每一个元素在document中的同级后续元素的集合。
         *
         * @param {string} filter 通过选择器过滤选择结果
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        nextAll: function (filter) {
            var all = [];
            this.each(function () {
                var children = $(this).parent().children();
                var i = children.indexOf(this);
                all = all.concat(children.slice(i + 1));
            });
            return wfQuery(all).filter(filter);
        },

        /**
         * 基于当前wfQuery对象dom所有后代元素集合进行的matchesSelector过滤。
         *
         * @param {string} filter 通过选择器过滤选择结果
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        find: function (filter) {
            var $children = [];
            this.each(function () {
                $children = [].concat.apply($children, wfQuery(this.querySelectorAll(filter)));
            });
            return wfQuery($children);
        },

        /**
         * 基于当前wfQuery对象dom所有子元素集合进行的matchesSelector过滤。
         *
         * @param {string} filter 通过选择器过滤选择结果
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        children: function (filter) {
            var $children = [];
            this.each(function () {
                var $t = this;
                var children = $t.children;
                if (!children) {
                    children = [].filter.call($t.childNodes, function (el) {
                        return !!el.tagName;
                    });
                }
                $children = [].concat.apply($children, wfQuery(children));
            });
            return wfQuery($children).filter(filter);
        }
    });



    /**
     * @file  常用的dom操作添加、删除、前置、后置等
     * @author shiyangyang(shiyangyang@baidu.com)
     * @namespace wfquery/dom
     */
    wfQuery.fn.extend({

        /**
         * 基于当前wfQuery对象dom列表进行的matchesSelector过滤。
         *
         * @private
         *
         * @param {string} ele html字符串
         * @return {wfQuery} 返回document.createElement创建的新元素
         */
        _appender: function (ele) {
            return wfQuery(ele);
        },

        /**
         * 在当前wfQuery对象每个元素内部结尾添加指定 标签(可多个)。
         *
         * @param {string|wfQuery} ele 需要被添加的元素
         * @return {wfQuery} 返回原wfQuery链式对象
         */
        append: function (ele) {
            return this.crossEach(this._appender(ele), function (dom, el) {
                dom.appendChild(el);
            });
        },

        /**
         * 在当前wfQuery对象每个元素内部开始位置添加指定 标签(可多个)。
         *
         * @param {string|wfQuery} ele 需要被添加的元素
         * @return {wfQuery} 返回原wfQuery链式对象
         */
        prepend: function (ele) {
            return this.crossEach(this._appender(ele), function (dom, el) {
                dom.insertBefore(el, dom.firstChild);
            });
        },

        /**
         * 在当前wfQuery对象每个元素前面添加指定 标签(可多个)。
         *
         * @param {string|wfQuery} ele 需要被添加的元素
         * @return {wfQuery} 返回原wfQuery链式对象
         */
        before: function (ele) {
            return this.crossEach(this._appender(ele), function (dom, el) {
                dom.parentNode.insertBefore(el, dom);
            });
        },

        /**
         * 在当前wfQuery对象每个元素后面添加指定 标签(可多个)。
         *
         * @param {string|wfQuery} ele 需要被添加的元素
         * @return {wfQuery} 返回原wfQuery链式对象
         */
        after: function (ele) {
            return this.crossEach(this._appender(ele), function (dom, el) {
                dom.parentNode.insertBefore(el, dom.nextSibling);
            });
        },

        /**
         * 清空当前wfQuery对象每个元素内容
         *
         * @return {wfQuery} 返回原wfQuery链式对象
         */
        empty: function () {
            return this.each(function () {
                this.textContent = '';
            });
        },

        /**
         * 从document中删除当前wfQuery对象每个元素
         *
         * @return {wfQuery} 返回原wfQuery链式对象
         */
        remove: function () {
            return this.each(function () {
                this.parentNode.removeChild(this);
            });
        },

        /**
         * 依照原wfQuery数组中元素, clone一组新的元素(包括已经绑定的事件和内部后代元素)
         *
         * @return {wfQuery} 返回原wfQuery链式对象
         */
        clone: function () {
            return wfQuery(this.map(function (dom, i) {
                return dom.cloneNode ? dom.cloneNode(true) : dom;
            }));
        }
    });


    /**
     * @file  html/text/className/attribute/data 相关设置
     * @author shiyangyang(shiyangyang@baidu.com)
     * @namespace wfquery/attr
     */
    var cache = {};
    var $n = 0;
    wfQuery.fn.extend({

        /**
         * 基于getAttribute和setAttribute方法的封装。
         *
         * @param {string} name 属性名
         * @param {string} value 属性值
         * @return {wfQuery} 获取属性值 或 返回原wfQuery对象
         */
        attr: function (name, value) {
            return this._attr(name, value, function (name) {
                return name ? this.getAttribute(name) : this.attributes;
            }, function (n, v) {
                typeof v === 'undefined' ? this.removeAttribute(n) : this.setAttribute(n, v);
            });
        },

        /**
         * 数据绑定
         *      1. 支持data-* 属性直接获取
         *      2. 如果属性的值满足JSON.parse结果不抛出异常, 则自动转化为Object
         *      3. js绑定数据不会修改attribute
         *
         * @param {string} name 属性名
         * @param {string} value 属性值
         * @return {wfQuery} 获取绑定数据 或 返回原wfQuery对象
         */
        data: function (name, value) {
            return this._attr(name, value, function (name) {
                var key = this.wfQueryCacheKey;
                var o;
                if (key) {
                    o = cache[key];
                }
                else {
                    this.wfQueryCacheKey = key = 'wf_' + ($n++);
                    o = cache[key] = wfQuery.array2obj([].filter.call(this.attributes, function (item) {
                            return !!item.name.match(/data-/);
                        }).map(function (i) {
                            var value = i.value;
                            try {
                                value = JSON.parse(value);
                            }
                            catch(e) {
                            }
                            return {name: i.name.split('-')[1], value: value};
                        }));
                }
                return name ? o[name] : o;
            }, function (n, v) {
                var o = $(this).data();
                if (v === 'undefined') {
                    delete o[n];
                }
                else {
                    o[n] = v;
                }
            });
        },

        /**
         * 为wfQuery对象数组每一个元素设置文本内容
         *
         * @param {string} txt 需要设置的文本
         * @return {wfQuery} 返回原wfQuery对象
         */
        text: function (txt) {
            return this._getSet('textContent', txt);
        },

        /**
         * 为wfQuery对象数组每一个元素设置innerHTML
         *
         * @param {string} html 需要设置的html字符串
         * @return {wfQuery} 返回原wfQuery对象
         */
        html: function (html) {
            return this._getSet('innerHTML', html);
        },

        /**
         * 为wfQuery对象数组每一个元素设置value
         *
         * @param {string} value 需要设置的value
         * @return {wfQuery} 返回原wfQuery对象
         */
        val: function (value) {
            return this._getSet('value', value);
        },

        /**
         * 为wfQuery对象数组每一个元素增加一个 className
         *
         * @param {string} className 需要设置的className
         * @return {wfQuery} 返回原wfQuery对象
         */
        addClass: function (className) {
            return this.each(function () {
                this.classList.add(className);
            });
        },

        /**
         * 为wfQuery对象数组每一个元素删除一个 className
         *
         * @param {string} className 需要删除的className
         * @return {wfQuery} 返回原wfQuery对象
         */
        removeClass: function (className) {
            return this.each(function () {
                this.classList.remove(className);
            });
        },

        /**
         * 判断wfQuery对象数组是不是有元素含有指定className
         *
         * @param {string} className 需要查找的 className
         * @return {boolean} 返回是否找到
         */
        hasClass: function (className) {
            return !!this.filter('.' + className).length;
        },

        /**
         * 依次判断wfQuery对象数组每一个元素是否含有指定的 className
         *      有：则删除
         *      无：则添加
         *
         * @param {string} className 需要添加或者删除的className
         * @return {wfQuery} 返回原wfQuery对象
         */
        toggleClass: function (className) {
            return this.each(function () {
                var list = this.classList;
                list.contains(className) ? list.remove(className) : list.add(className);
            });
        }
    });


    /**
     * @file  css方法设置和获取style, 简单 show/hide 方法
     * @author shiyangyang(shiyangyang@baidu.com)
     * @namespace wfquery/css
     */
    wfQuery.fn.extend({

        /**
         * 基于getComputedStyle的样式属性获取或 直接对style属性进行设置
         * 特殊属性名称支持默认对number型值添加px单位, 以及获取时返回number
         *
         * @param {string} name 样式属性名
         * @param {string} value 待设置属性值
         * @return {wfQuery} 获取属性值 或 返回原wfQuery对象
         */
        css: function (name, value) {
            var numReg = /width|height|left|right|top|bottom|size|radius/i;
            return this._attr(name, value, function (name) {
                var cssValue =  name ? window.getComputedStyle(this)[name] : this.style;
                if (numReg.test(name) && cssValue.match(/^[\+\-]?[\d\.]+px$/)) {
                    cssValue = Number(cssValue.replace(/px/, ''));
                }
                return cssValue;
            }, function (n, v) {
                if (numReg.test(n) && pto.toString.call(v) === '[object Number]') {
                    v += 'px';
                }
                this.style[n] = v;
            });
        },

        /**
         * 取消 wfQuery 数组中所有元素设置的style.display的值
         *
         * @return {wfQuery} 返回原wfQuery对象
         */
        show: function () {
            return this.css({display: ''});
        },

        /**
         * 为 wfQuery 数组中所有元素设置style.display='none'
         *
         * @return {wfQuery} 返回原wfQuery对象
         */
        hide: function () {
            return this.css({display: 'none'});
        },

        /**
         * 基于getComputedStyle的样式属性获取或 直接对style属性进行设置
         * 特殊属性名称支持默认对number型值添加px单位, 以及获取时返回number
         *
         * @param {string} name 样式属性名
         * @param {string} value 待设置属性值
         * @return {wfQuery} 获取属性值 或 返回原wfQuery对象
         */
        toggle: function () {
            return this.each(function () {
                var $t = this;
                window.getComputedStyle($t).display === 'none' ? $t.style.display = '' : $t.style.display = 'none';
            });
        }
    });


    /**
     * @file  on/off/trigger 方法, on支持代理, off只能按照事件类型取消绑定
     * @author shiyangyang(shiyangyang@baidu.com)
     * @namespace wfquery/event
     */
    wfQuery.fn.extend({

        /**
         * 事件绑定
         *
         * @param {string} options 事件名，支持使用\W分隔的分别绑定多个事件
         * @param {string} selector 代理事件选择器，为空时不做时间代理
         * @param {Function} fn 绑定事件主体， 如果是代理事件为包装对象
         * @param {Function} fn2 事件代理，如果不在代理目标内触发事件
         * @return {wfQuery} 返回原wfQuery对象
         */
        on: function (options, selector, fn, fn2) {
            var f = fn;
            var eventTypes = (options + '').match(/\w+/g) || [];
            if (!eventTypes.length) {
                return this;
            }
            if (typeof selector === 'function') {
                var cbk = selector;
                f = function (e) {
                    if (false === cbk.call(this, e)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                };
                selector = null;
            }
            else {
                f = function (e) {
                    var tar = wfQuery(e.target);
                    var par = tar.parents(selector);
                    var ret;
                    if (tar.filter(selector).length) {
                        ret = fn.call(tar[0], e);
                    }
                    else if (par.length) {
                        ret = fn.call(par[0], e);
                    }
                    else if (typeof fn2 === 'function') {
                        ret = fn2.call(this, e);
                    }
                    if (false === ret) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                };
            }
            return this.crossEach(eventTypes, function (dom, eventType) {
                dom['wf_' + eventType] = dom['wf_' + eventType] || [];
                dom['wf_' + eventType].push(f);
                dom.addEventListener(eventType, f, false);
                if (dom.cloneNode && dom.cloneNode.list instanceof Array && dom.cloneNode.list.length) {
                    dom.cloneNode.list.on(options, selector, f, fn2);
                }
            });
        },

        /**
         * 取消事件绑定
         *
         * @param {string} eventType 事件类型，支持且仅支持单个类型的事件解绑
         * @return {wfQuery} 返回原wfQuery对象
         */
        off: function (eventType) {
            return this.each(function () {
                var  $t = this;
                var allEvent = $t['wf_' + eventType] || [];
                allEvent.forEach(function (ev) {
                    $t.removeEventListener(eventType, ev, false);
                });
                delete $t['wf_' + eventType];
            });
        },

        /**
         * 触发事件绑定
         *
         * @param {string} eventType 事件类型，支持且仅支持单个类型的事件解绑
         * @return {wfQuery} 返回原wfQuery对象
         */
        trigger: function (eventType) {
            var agu = arguments;
            return this.each(function () {
                var $t = this;
                var cbks = $t['wf_' + eventType] || [];
                if (document.createElement($t.tagName)[eventType]) {
                    $t[eventType]();
                }
                else {
                    cbks.forEach(function (fn) {
                        fn.apply($t, agu);
                    });
                }
            });
        }
    });


    /**
     * @file  Ajax支持基于ajax2.0的文件上传和进度设置
     * @author shiyangyang(shiyangyang@baidu.com)
     * @namespace wfquery/ajax
     */
    wfQuery.extend({

        /**
         * ajax实现
         *
         * @param {Object} option 所有参数配置
         * @param {string} option.url 请求链接
         * @param {boolean} option.async 是否异步， 默认为 true
         * @param {boolean} option.cache 请求头是否携带 cache-control:no-cache
         * @param {Object} option.data 请求参数设置， 支持序列化字符串、序列化数组以及基本数据对象
         * @param {string} option.type 请求类型，支持GET/POST 默认为GET， 大小写不敏感
         * @param {string} option.dataType 期望的响应数据类型 支持 json/html/xml/text/jsonp
         * @param {wfQuery} option.form 使用form参数时候, data参数失效, 直接进行可以携带文件上传的表单提交
         * @param {Function} option.success ajax成功回调
         * @param {Function} option.error 请求失败或者数据格式有问题时触发 error
         * @param {Function} option.onprocess 使用form参数时候起效，获取文件上传进度
         * @return {XMLHttpRequest} 返回原生 XMLHttpRequest 对象
         */
        ajax: function (option) {
            var opt = wfQuery.extend({
                async: true,
                cache: true,
                url: null,
                data: {},
                type: 'GET',
                dataType: 'json',
                form: null,
                success: function () {},
                error: function () {},
                onprocess: function () {}
            }, option);
            if (!opt.url) {
                throw new Error('ajax(url /*required*/)');
            }
            if (opt.dataType.toUpperCase() === 'JSONP') {
                return wfQuery.jsonp(opt.url, opt.data, opt.success);
            }
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status !== 200) {
                        return opt.error(xhr);
                    }
                    switch (opt.dataType.toUpperCase()) {
                        case 'JSON':
                            try {
                                opt.success(JSON.parse(xhr.responseText));
                            }
                            catch(e) {
                                return opt.error(xhr, e);
                            }
                            break;
                        case 'XML':
                        case 'HTML':
                            if (xhr.responseXML) {
                                opt.success(xhr.responseXML);
                            }
                            else {
                                opt.error(xhr);
                            }
                            break;
                        default:
                            opt.success(xhr.responseText);
                    }
                }
            };
            var data;
            var form;
            var type = opt.type.toUpperCase();
            if (opt.form && (form = wfQuery(opt.form)[0]) && form.tagName.toUpperCase() === 'FORM') {
                /* 文件上传事件 */
                if (type === 'POST') {
                    xhr.upload.addEventListener('progress', opt.onprocess);
                }
                data = new FormData(form);
                for (var t in opt.data) {
                    if (opt.data.hasOwnProperty(t)) {
                        var dt = opt.data[t];
                        if (({}).toString.call(dt) === '[object FileList]') {
                            for (var i = 0; i < dt.length; i++) {
                                data.append(t, dt[i]);
                            }
                        }
                        else {
                            data.append(t, dt);
                        }
                    }
                }
            }
            else {
                data = wfQuery.param(opt.data);
            }
            if (type === 'POST') {
                xhr.open(type, opt.url, opt.async);
                (typeof data === 'string') && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.send(data);
            }
            else {
                xhr.open(type, opt.url.match(/\?/) ? (opt.url + '&' + data) : (opt.url + '?' + data), opt.async);
                opt.cache || xhr.setRequestHeader('Cache-Control', 'no-cache');
                xhr.send();
            }
        },

        /**
         * jsonp实现
         *
         * @param {string} url 请求链接
         * @param {Object} data  可携带的get请求参数
         * @param {Function} callback 设置jsonp的回调方法
         */
        jsonp: function (url, data, callback) {
            if (wfQuery.isFunction(data)) {
                callback = data;
                data = {};
            }
            var cbkName = 'wfQuery_' + +new Date();
            data.__t = +new Date();
            data.callback = cbkName;
            var $sc = doc.createElement('script');
            var bdy = document.body;
            $sc.src = url + '?' + wfQuery.param(data);
            bdy.appendChild($sc);
            window[cbkName] = callback || function () {};
            $sc.onload = function () {
                delete window[cbkName];
                bdy.removeChild($sc);
            };
        }
    });
    (['get', 'post']).forEach(function (method) {

        /**
         * 基于ajax方法的快捷方法实现
         *
         * @param {string} url 请求链接
         * @param {Object} data  可携带的请求参数
         * @param {Function} callback AJAX回调方法
         * @param {string} type ajax的dataType
         * @return {undefined}
         */
        wfQuery[method] = function (url, data, callback, type) {
            if (wfQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }
            return wfQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });


    return wfQuery;
}));

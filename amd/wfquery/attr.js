/**
 * @file  html/text/className/attribute/data 相关设置
 * @author shiyangyang(shiyangyang@baidu.com)
 * @namespace wfquery/attr
 */
define('wfquery/attr', function () {
    var wfQuery = require('wfquery');
    var cache = {};
    var $$n = 0;
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
                    this.wfQueryCacheKey = key = 'wf_' + ($$n++);
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
});

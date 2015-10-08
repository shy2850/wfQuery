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
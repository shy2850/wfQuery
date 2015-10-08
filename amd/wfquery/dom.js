/**
 * @file  常用的dom操作添加、删除、前置、后置等
 * @author shiyangyang(shiyangyang@baidu.com)
 * @namespace wfquery/dom
 */
define('wfquery/dom', function () {
    var wfQuery = require('wfquery');
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
});

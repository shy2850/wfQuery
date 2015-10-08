/**
 * @file  css方法设置和获取style, 简单 show/hide 方法
 * @author shiyangyang(shiyangyang@baidu.com)
 * @namespace wfquery/css
 */
define('wfquery/css', function () {
    var wfQuery = require('wfquery');
    var pto = Object.prototype;
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
});

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

$include[js/init.js]

$include[js/extend.js]

$include[js/util.js]

$include[js/base.js]

$include[js/serialize.js]

$include[js/query.js]

$include[js/dom.js]

$include[js/attr.js]

$include[js/css.js]

$include[js/event.js]

$include[js/ajax.js]

    return wfQuery;
}));

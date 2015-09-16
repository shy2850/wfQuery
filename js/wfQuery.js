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
}(this, function (require) {
    var doc = window.document;

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

     /*初始化方法*/
    $include[init.js]

    /*extend方法定义*/
    $include[extend.js]

    /*最常用的基本工具*/
    $include[util.js]

    /*原型基础方法*/
    $include[base.js]

    /*查询相关方法*/
    $include[query.js]

    /*DOM操作相关方法*/
    $include[dom.js]

    /*属性操作相关方法*/
    $include[attr.js]

    /*css操作相关方法*/
    $include[css.js]

    /*事件操作相关方法*/
    $include[event.js]

    /*ajax*/
    $include[ajax.js]

    return wfQuery;
}));

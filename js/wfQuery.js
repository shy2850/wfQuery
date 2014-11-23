;(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(factory);
    } else {
        root.wfQuery = factory();
        window.$ = window.$ || root.wfQuery;
    }
}(this, function(require) {
    var doc = window.document,
    wfQuery = function( selector, context ) {
    	return new wfQuery.fn.init( selector, context );
    };

    /*初始化方法*/
    $include[js/init.js]

    /*extend方法定义*/
    $include[js/extend.js]

    /*最常用的基本工具*/
    $include[js/util.js]

	/*原型基础方法*/
    $include[js/base.js]

    /*查询相关方法*/
    $include[js/query.js]

    /*DOM操作相关方法*/
    $include[js/dom.js]

    /*属性操作相关方法*/
    $include[js/attr.js]

    /*css操作相关方法*/
    $include[js/css.js]

    /*事件操作相关方法*/
    $include[js/event.js]

    /*ajax*/
    $include[js/ajax.js]

    return wfQuery;
}));
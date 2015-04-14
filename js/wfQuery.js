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
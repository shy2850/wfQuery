/**
 * @file  Ajax支持基于ajax2.0的文件上传和进度设置
 * @author shiyangyang(shiyangyang@baidu.com)
 * @namespace wfquery/ajax
 */
define('wfquery/ajax', function () {
    var wfQuery = require('wfquery');
    var doc = window.document;
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
});

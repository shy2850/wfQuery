/**
* 通用表单验证组件 of jQuery
*/ (function($) {

    /**全角字符转化为半角字符**/
    $.stringCtoh = function(str) {
        str = str ? "" + str : "";
        var result = "";
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) == 12288) {
                result += String.fromCharCode(str.charCodeAt(i) - 12256);
                continue;
            }
            if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
                result += String.fromCharCode(str.charCodeAt(i) - 65248);
            } else {
                result += String.fromCharCode(str.charCodeAt(i));
            }
        }
        return result;
    };

    $.form = $.form || {};
    $.extend($.form, {

        /**
         * 默认配置
         */
        settings: {

            /**需要提示的标签后面追加提示标签*/
            initTip: function(input, defaultTip) {
                input.after($("<span class='tip tip-default'></span>")
                    .text(defaultTip || ""));
            },

            /**默认的出错提示方案*/
            validTip: function(input, errorInfo, defaultTip) {
                if (errorInfo) {
                    input.next()
                        .removeClass('tip-default')
                        .addClass("tip-error")
                        .text(errorInfo);
                } else {
                    input.next()
                        .removeClass('tip-error')
                        .addClass("tip-default")
                        .text(defaultTip || "");
                }
            }

        },

        /**验证工具：正则式 & 类似正则功能的function等*/
        regValids: {
            alpha: /^[A-Za-z]+$/,
            alphanumber: /^[A-Za-z0-9]+$/,
            integer: /^\d+$/,
            number: /^[+-]?(\d+(\.\d*)?|\.\d+)([Ee]-?\d+)?$/,
            mobile: /^1[3458]\d{9}$/,
            email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
            chinese: /^[\u4e00-\u9fa5]*$/

        },

        /**
         * 验证 value 的值，不通过：返回提示信息；验证通过：返回 ""。
         * input：待验证的输入， v 为json格式参数,不存在时，验证直接返回 "" 
         */
        valid: function(input, valid) {
            input = input || {};
            /**v：验证器、value：待验证值、valueReturn：自定义validFun的返回值*/
            var v = {}, value = "",
                validReturn = {};
            input.vReturn = "";

            if ((!input.data("validater") && !valid)) {
                return "";
            }

            v = $.extend(v, input.data("validater"), valid);

            value = input.val();
            if (v.trim !== false) { //默认trim
                value = $.trim(value);
                input.val(value);
            }
            if (v.stringCtoh === true) { //默认不使用全角转半角字符
                value = $.stringCtoh(value);
                input.val(value);
            }


            if (v.begin && typeof v.begin === "function") {
                value = v.begin(input);
            }

            var thisValue = value || "";
            v.showName = v.showName || "";
            if (!v.required && thisValue.length == 0) {
                input.vReturn = "";
            } else if (v.required && thisValue.length == 0) {
                input.vReturn = v.requiredTip || v.showName + "不能为空";
            } else if (v.len && thisValue.length != v.len) {
                input.vReturn = v.lenTip || v.showName + "长度必须为:" + v.len;
            } else if (v.minlen && thisValue.length < v.minlen) {
                input.vReturn = v.lenTip || v.showName + "长度不小于： " + v.minlen;
            } else if (v.maxlen && thisValue.length > v.maxlen) {
                input.vReturn = v.lenTip || v.showName + "长度不超过 ：" + v.maxlen;
            } else if (v.regexp && !v.regexp.test(thisValue)) {
                input.vReturn = v.errorTip || v.showName + "验证不通过";
            } else if (v.validFun && typeof v.validFun === "function") {
                validReturn = v.validFun(value, input);
                input.vReturn = validReturn.errorInfo;
            } else {
                //DO Nothing
            }

            if (input.vReturn) {
                if (v.failed && typeof v.failed === "function") {
                    v.failed(input, validReturn);
                }
            } else {
                if (v.success && typeof v.success === "function") {
                    v.success(input, validReturn);
                }
            }

            if (v.end && typeof v.end === "function") {
                v.end(input, validReturn);
            }

            return input.vReturn;
        },
        //单组输入框验证绑定
        validTip: function(selector) {
            var validater = $(selector)
                .data("validater") || {};
            if (validater.type) {
                var regValid = this.regValids[validater.type];
                if (regValid) {
                    if (regValid instanceof RegExp) { //正则直接赋值
                        validater.regexp = regValid;
                    } else if (typeof regValid === 'function') { //function：需要返回正则赋值
                        validater.regexp = regValid(validater);
                    } else if (typeof regValid.check === 'function') { //object：添加check方法到validater中
                        validater.validFun = function(value) {
                            return regValid.check.call(regValid, value);
                        };
                    }
                }

            }
            $(selector)
                .each(function() {
                $.form.settings.initTip($(this), validater.defaultTip);
                $(this)
                    .on((validater.option || "noListenner"), function() {
                    //验证开始前操作
                    if (validater.before && typeof validater.before === 'function') {
                        validater.before($(this));
                    }

                    var errorInfo = $.form.valid($(this), validater);
                    $.form.settings.validTip($(this), errorInfo, validater.defaultTip);

                    //验证结束后操作
                    if (validater.after && typeof validater.after === 'function') {
                        validater.after($(this), errorInfo);
                    }
                });
            });
        },

        //统一事件绑定
        render: function(validaters, common) {
            for (var selector in validaters) {
                var validater0 = validaters[selector] || {},
                validater = $(selector)
                    .data("validater") || {};
                $.extend(validater, common);
                $(selector)
                    .data("validater", validater);
                this.validTip(selector, $.extend(validater, validater0));
            }
        }

    });

    $.fn.extend({
        valid: function(valid) {
            return $.form.valid(this, valid);
        },
        formValid: function(selector, commonValider, settings) {
            var info = "",
                firstErr = null,
                settings = settings || $.form.settings;

            commonValider = commonValider || {};

            this.find(selector || "[name]")
                .each(function() {
                if (commonValider.interrupt && firstErr) return;
                var vReturn = $(this)
                    .valid(commonValider.get ? commonValider.get(this.name) : commonValider);
                info += vReturn;
                if (vReturn && !firstErr) {
                    firstErr = $(this);
                    firstErr.focus()
                        .blur();

                }
                settings.validTip($(this), vReturn);
            });

            return info ? false : true;
        },
        validAttr: function(attr, attrValue) {
            var data = this.data("validater") || {};
            if (typeof attr === 'object') {
                $.extend(data, attr);
                return this;
            } else if (attr && attrValue) {
                data[attr] = attrValue;
            } else if (attr) {
                return data[attr];
            } else {
                return data;
            }
            return this;
        }
    });

})(wfQuery);
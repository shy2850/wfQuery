    /**
     * @file  on/off/trigger 方法, on支持代理, off只能按照事件类型取消绑定
     * @author shiyangyang(shiyangyang@baidu.com)
     * @namespace wfquery/event
     */
    wfQuery.fn.extend({

        /**
         * 事件绑定
         *
         * @param {string} options 事件名，支持使用\W分隔的分别绑定多个事件
         * @param {string} selector 代理事件选择器，为空时不做时间代理
         * @param {Function} fn 绑定事件主体， 如果是代理事件为包装对象
         * @param {Function} fn2 事件代理，如果不在代理目标内触发事件
         * @return {wfQuery} 返回原wfQuery对象
         */
        on: function (options, selector, fn, fn2) {
            var f = fn;
            var eventTypes = (options + '').match(/\w+/g) || [];
            if (!eventTypes.length) {
                return this;
            }
            if (typeof selector === 'function') {
                var cbk = selector;
                f = function (e) {
                    if (false === cbk.call(this, e)) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                };
                selector = null;
            }
            else {
                f = function (e) {
                    var tar = wfQuery(e.target);
                    var par = tar.parents(selector);
                    var ret;
                    if (tar.filter(selector).length) {
                        ret = fn.call(tar[0], e);
                    }
                    else if (par.length) {
                        ret = fn.call(par[0], e);
                    }
                    else if (typeof fn2 === 'function') {
                        ret = fn2.call(this, e);
                    }
                    if (false === ret) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                };
            }
            return this.crossEach(eventTypes, function (dom, eventType) {
                dom.addEventListener(eventType, f, false);
                if (dom.cloneNode && dom.cloneNode.list instanceof Array && dom.cloneNode.list.length) {
                    dom.cloneNode.list.on(options, selector, f, fn2);
                }
            });
        },

        /**
         * 取消事件绑定
         *
         * @param {string} eventType 事件类型，支持且仅支持单个类型的事件解绑
         * @return {wfQuery} 返回原wfQuery对象
         */
        off: function (eventType) {
            return this.each(function () {
                var  $t = this;
                var allEvent = $t['wf_' + eventType] || [];
                allEvent.forEach(function (ev) {
                    $t.removeEventListener(eventType, ev, false);
                });
                delete $t['wf_' + eventType];
            });
        },

        /**
         * 触发事件绑定
         *
         * @param {string} eventType 事件类型，支持且仅支持单个类型的事件解绑
         * @return {wfQuery} 返回原wfQuery对象
         */
        trigger: function (eventType, e) {
            return this.each(function () {
                var $t = this;
                var eve = new CustomEvent(eventType, e)
                $t.dispatchEvent(eve)
            });
        }
    });
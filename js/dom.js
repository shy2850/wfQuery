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
        append: function (ele) {
            return this.crossEach(this._appender(ele), function (dom, el) {
                dom.appendChild(el);
            });
        },
        prepend: function (ele) {
            return this.crossEach(this._appender(ele), function (dom, el) {
                dom.insertBefore(el, dom.firstChild);
            });
        },
        before: function (ele) {
            return this.crossEach(this._appender(ele), function (dom, el) {
                dom.parentNode.insertBefore(el, dom);
            });
        },
        after: function (ele) {
            return this.crossEach(this._appender(ele), function (dom, el) {
                dom.parentNode.insertBefore(el, dom.nextSibling);
            });
        },
        empty: function () {
            return this.each(function () {
                this.textContent = '';
            });
        },
        remove: function () {
            return this.each(function () {
                this.parentNode.removeChild(this);
            });
        },
        clone: function () {
            return wfQuery(this.map(function (dom, i) {
                return dom.cloneNode ? dom.cloneNode(true) : dom;
            }));
        }
    });
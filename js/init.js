    wfQuery.fn = wfQuery.prototype = [];
    wfQuery.fn.constructor = wfQuery;

    /**
     * wfQuery 初始化方法
     *
     * @param {string} selector 选择器可以是：css选择器、html片段或者DOMCollection等
     * @param {string} context 使用css选择器时包含标签
     * @return {wfQuery} 返回wfQuery对象
     */
    var Init = wfQuery.fn.Init = function (selector, context) {
        context = context || doc;
        var type = Object.prototype.toString.call(selector);
        if (!selector) {
            return this;
        }
        else if (selector.constructor === wfQuery) {
            return selector;
        }
        else if (type === '[object String]') {
            var holder = document.createElement('WF');
            if (/^\s*[\<]/.test(selector)) {
                holder.innerHTML = selector;
                return new Init(holder.children);
            }
            return new Init(context.querySelectorAll(selector));
        }
        else if ('[object HTMLCollection]' === type || '[object NodeList]' === type || '[object Array]' === type) {
            this.length = selector.length;
            for (var i = 0; i < selector.length; i++) {
                this[i] = selector[i];
            }
            return this;
        }
        else if (wfQuery.isFunction(selector)) {
            selector(wfQuery);
        }
        else {
            this.length = 1;
            this[0] = selector;
            return this;
        }
    };
    Init.prototype = wfQuery.fn;

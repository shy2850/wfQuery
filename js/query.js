    /**
     * @file  dom查询相关各种方法
     * @author shiyangyang(shiyangyang@baidu.com)
     * @namespace wfquery/query
     */
    var p = document.createElement('p');

    /**
     *
     * 兼容性的 matchesSelector 获取
     * @private
     * @type {Function}
     *
     */
    var w3cMatches = [
        'matchesSelector',
        'webkitMatchesSelector',
        'msMatchesSelector',
        'mozMatchesSelector',
        'oMatchesSelector'
    ].filter(function (i) {
        return p[i];
    })[0];
    wfQuery.fn.extend({

        /**
         * 获取wfQuery对象数组中的第一个元素并且封装为一个新的wfQuery对象。
         *
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        first: function () {
            return wfQuery(this[0]);
        },

        /**
         * 获取wfQuery对象数组中的第i个元素并且封装为一个新的wfQuery对象。
         *
         * @param {number} i 需要查找的元素下标
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        eq: function (i) {
            return wfQuery(this[(this.length + i) % this.length]);
        },

        /**
         * 获取wfQuery对象数组中的第1个元素在父级列表中的位置。
         *
         * @return {number} 返回查找到的位置下标
         */
        index: function () {
            return this.parent().children().indexOf(this[0]);
        },

        /**
         * 获取wfQuery对象数组中的最后一个元素并且封装为一个新的wfQuery对象。
         *
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        last: function () {
            return wfQuery(this[this.length - 1]);
        },

        /**
         * 获取wfQuery对象数组中的第一个元素在document中的下一个元素, 并且封装为一个新的wfQuery对象。
         *
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        next: function () {
            return wfQuery(!this[0] ? null : this[0].nextElementSibling);
        },

        /**
         * 获取wfQuery对象数组中的第一个元素在document中的上一个元素, 并且封装为一个新的wfQuery对象。
         *
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        prev: function () {
            return wfQuery(!this[0] ? null : this[0].previousElementSibling);
        },

        /**
         * 获取wfQuery对象数组中的第一个元素在document中的父级元素, 并且封装为一个新的wfQuery对象。
         *
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        parent: function () {
            return wfQuery(!this[0] ? null : this[0].parentNode);
        },

        /**
         * 获取dom父级标签列表。
         *
         * @param {string} filter 通过选择器过滤选择结果
         * @param {Element} root 父级列表根节点范围
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        parents: function (filter, root) {
            var $parents = [];
            var tmp = this[0];
            root = root || document;
            while (tmp && tmp !== root && (tmp = tmp.parentNode)) {
                $parents.push(tmp);
            }
            return wfQuery($parents).filter(filter);
        },

        /**
         * 基于当前wfQuery对象dom列表进行的matchesSelector过滤。
         *
         * @param {string} match 通过选择器过滤选择结果
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        filter: function (match) {
            var tar = [];
            if (!match) {
                return this;
            }
            /* 原生filter保留 */
            else if (typeof match === 'function') {
                tar = [].filter.call(this, match);
            }
            else {
                this.each(function () {
                    var $t = this;
                    if ($t[w3cMatches] && $t[w3cMatches](match)) {
                        tar.push($t);
                    }
                });
            }
            return wfQuery(tar);
        },

        /**
         * 基于当前wfQuery对象dom列表进行的matchesSelector过滤。
         *
         * @param {string} no 不被通过选择器
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        not: function (no) {
            var $this = this;
            return wfQuery([].filter.call($this, function (dom) {
                var flag;
                try {
                    flag = dom[w3cMatches] && dom[w3cMatches](no);
                }
                catch(e) {
                    flag = dom === wfQuery(no)[0];
                }
                return !flag;
            }));
        },

        /**
         * 获取wfQuery对象数组中的第1个元素在document中的所有兄弟元素。
         *
         * @param {string} filter 通过选择器过滤选择结果
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        siblings: function (filter) {
            return this.parent().children(filter).not(this);
        },

        /**
         * 获取wfQuery对象数组中的每一个元素在document中的同级后续元素的集合。
         *
         * @param {string} filter 通过选择器过滤选择结果
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        nextAll: function (filter) {
            var all = [];
            this.each(function () {
                var children = wfQuery(this).parent().children();
                var i = children.indexOf(this);
                all = all.concat(children.slice(i + 1));
            });
            return wfQuery(all).filter(filter);
        },

        /**
         * 基于当前wfQuery对象dom所有后代元素集合进行的matchesSelector过滤。
         *
         * @param {string} filter 通过选择器过滤选择结果
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        find: function (filter) {
            var $children = [];
            this.each(function () {
                $children = [].concat.apply($children, wfQuery(this.querySelectorAll(filter)));
            });
            return wfQuery($children);
        },

        /**
         * 基于当前wfQuery对象dom所有子元素集合进行的matchesSelector过滤。
         *
         * @param {string} filter 通过选择器过滤选择结果
         * @return {wfQuery} 返回过滤后的wfQuery链式对象
         */
        children: function (filter) {
            var $children = [];
            this.each(function () {
                var $t = this;
                var children = $t.children;
                if (!children) {
                    children = [].filter.call($t.childNodes, function (el) {
                        return !!el.tagName;
                    });
                }
                $children = [].concat.apply($children, wfQuery(children));
            });
            return wfQuery($children).filter(filter);
        }
    });

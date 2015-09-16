    var cache = {};
    var $$n = 0;
    wfQuery.fn.extend({

        /**
         * 基于getAttribute和setAttribute方法的封装。
         *
         * @param {string} name 属性名
         * @param {string} value 属性值
         * @return {wfQuery} 获取属性值 或 返回原wfQuery对象
         */
        attr: function (name, value) {
            return this._attr(name, value, function (name) {
                return name ? this.getAttribute(name) : this.attributes;
            }, function (n, v) {
                typeof v === 'undefined' ? this.removeAttribute(n) : this.setAttribute(n, v);
            });
        },

        /**
         * 数据绑定
         *      1. 支持data-* 属性直接获取
         *      2. 如果属性的值满足JSON.parse结果不抛出异常, 则自动转化为Object
         *      3. js绑定数据不会修改attribute
         *
         * @param {string} name 属性名
         * @param {string} value 属性值
         * @return {wfQuery} 获取绑定数据 或 返回原wfQuery对象
         */
        data: function (name, value) {
            return this._attr(name, value, function (name) {
                var key = this.wfQueryCacheKey;
                var o;
                if (key) {
                    o = cache[key];
                }
                else {
                    this.wfQueryCacheKey = key = 'wf_' + ($$n++);
                    o = cache[key] = wfQuery.array2obj([].filter.call(this.attributes, function (item) {
                            return !!item.name.match(/data-/);
                        }).map(function (i) {
                            var value = i.value;
                            try {
                                value = JSON.parse(value);
                            }
                            catch(e) {
                            }
                            return {name: i.name.split('-')[1], value: value};
                        }));
                }
                return name ? o[name] : o;
            }, function (n, v) {
                var o = $(this).data();
                if (v === 'undefined') {
                    delete o[n];
                }
                else {
                    o[n] = v;
                }
            });
        },
        text: function (txt) {
            return this._getSet('textContent', txt);
        },
        html: function (html) {
            return this._getSet('innerHTML', html);
        },
        val: function (value) {
            return this._getSet('value', value);
        },
        addClass: function (className) {
            return this.each(function () {
                this.classList.add(className);
            });
        },
        removeClass: function (className) {
            return this.each(function () {
                this.classList.remove(className);
            });
        },
        hasClass: function (className) {
            return !!this.filter('.' + className).length;
        },
        toggleClass: function (className) {
            return this.each(function () {
                var list = this.classList;
                list.contains(className) ? list.remove(className) : list.add(className);
            });
        }
    });
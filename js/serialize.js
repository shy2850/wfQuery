    /**
     * @file  表单序列化相关方法
     * @author shiyangyang(shiyangyang@baidu.com)
     * @namespace wfquery/serialize
     */
    wfQuery.fn.extend({

        /**
         * 将一个表单内的elements值转化成一个序列化数组。
         * this 必须是一个form， 否则返回空数组 []
         *
         * @return {Array} 序列化数组
         */
        serializeArray: function () {
            var form = this[0];
            var res = [];
            if (form && form.tagName.toUpperCase() === 'FORM') {
                [].map.call(form.elements, function (inp) {
                    if (!inp.name || inp.disabled) {
                        return;
                    }
                    switch (inp.type) {
                        case 'radio':
                        case 'checkbox':
                            if (!inp.checked) {
                                return;
                            }
                        case 'input':
                        default:
                            res.push({
                                name: inp.name,
                                value: inp.value
                            });
                    }
                });
            }
            return res;
        },

        /**
         * 将一个表单内的elements值转化成一个序列化字符串。
         * this 必须是一个form， 否则返回 ''
         *
         * @return {string} 序列化字符串
         */
        serialize: function () {
            return wfQuery.param(this.serializeArray());
        }
    });
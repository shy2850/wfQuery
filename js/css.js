    wfQuery.fn.extend({
        css: function (name, value) {
            return this._attr(name, value, function (name) {
                return name ? window.getComputedStyle(this)[name] : this.style;
            }, function (n, v) {
                if (/width|height|left|right|top|bottom|size|radius/i.test(n) && /^[\d\.]+$/.test(v)) {
                    v += 'px';
                }
                this.style[n] = v;
            });
        },
        show: function () {
            return this.css({display: ''});
        },
        hide: function () {
            return this.css({display: 'none'});
        },
        toggle: function () {
            return this.each(function () {
                var $t = this;
                window.getComputedStyle($t).display === 'none' ? $t.style.display = '' : $t.style.display = 'none';
            });
        }
    });
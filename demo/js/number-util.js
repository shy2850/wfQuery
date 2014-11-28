;(function (root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.NumberUtil = factory();
  }

}(this,function(require, exports, module) {
	var _c = "零壹贰叁肆伍陆柒捌玖".split("");
	var _d = "萬***亿***萬***圆";
	var _e = "仟,佰,拾,".split(",");
	var _0 = "0000000000000000";
	var _decimalPart = function(b){	//人民币读数转化小数部分
		switch(b.length){
			case 0: return "整";
			case 1: return _c[b] + "角";
			default:
				return _c[b.charAt(0)] + "角" + _c[b.charAt(1)] + "分"
		}
	};
	var _set = {
		"B": 1,
		"KB": 1024,
		"MB" : 1024*1024,
		"GB" : 1024*1024*1024,
		"TB" : 1024*1024*1024*1024
	};
	var _getUnit = function(n){ //判断使用哪个单位合适
		var i = 0, _n = n;
		while(_n > 1024){
			_n /= 1024;
			i++;
		}
		return ["B","KB","MB","GB","TB"][i] || "TB"; 
	};
	return {
		/** 人民币大写读数 */
		toRMB: function(n){
			var s = (""+n).split("."), 
	            a = s[0],       //整数部分
	            b = s[1] || ""; //小数部分
	        a = _0.substring(a.length) + a; //整数高位补零,位数弄成16位,最高支持到万亿数量级.
	        var intPart = a.replace(/\d{4}/g,function(match4,index4){
	        	var unit4 = match4.replace(/\d/g,function(match,index){
	        		var num = Number(match);
	        		return _c[num] + (num ? _e[index] : "");	// 每位数字读数, 如果不是零还要带单位
	        	}).replace(/^(.*?)[零]*$/,"$1").replace(/零+/,"零");	//每个4位整数读数中尾零不读，中间的零合并
	        	return unit4 + _d.charAt(index4);						//每4位读数完毕, 追加万进制单位
	        });
	        intPart = intPart
	        			.replace(/亿萬/,"亿")	// 万级别的数字均为0时, 不读'萬'字
	        			.replace( /^[^壹贰叁肆伍陆柒捌玖]+(.*?)$/, "$1"); //从第一个不是零的数位开始读数。
	        return intPart + _decimalPart(b);
		},
		/**标准千机制表示法*/
		to1000Hex:function(n,split){
			var s = (""+n).split("."), 
            a = s[0],       //整数部分
            b = s[1] || "", //小数部分
            c = b ? "." : ""; //是否加小数点
	        a = ["","00","0"][a.length%3] + a; //整数高位补零,位数弄成3的倍数. 
	        return a.match(/\d{3}/g).join(split || ",").replace(/^0+(\d+)/,"$1") + c + b;
		},
		/**数据存储表示法,默认保留小数点后2位*/
		toStorage:function(n,unit,fixed_len){
			if( !unit || !_set[unit] ){
				unit = _getUnit(n);
			}
			return ( n / _set[unit] ).toFixed(fixed_len||2) + unit;
		}
	};

}));
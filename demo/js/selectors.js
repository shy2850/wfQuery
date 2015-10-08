/**
 * @description  基于jQuery UI的input转联动下拉框
 * @author yangyang.shiyy@alibaba-inc.com
 */
(function($){
	
	/**
	 * @description 创建下拉框选项专用方案,拼接生成html字符串
	 * @param {Object}o ： 当前映射对象列表
	 * @param {String}withDefault : 使用的默认选项
	 * @returns {String} 表示创建options的字符串 
	 */
	function createOptions(o,withDefault,defaultOption){
		
		withDefault = defaultOption || withDefault;
		
		var defaultOpt = withDefault ? "<option value=''>"+withDefault+"</option>" : "<option value=''>请选择</option>";
		if(!o)return defaultOpt;
		var str = defaultOpt;
		for(i in o){
			if(typeof o[i] === 'string' || typeof o[i] === 'number'){
				str += "<option value='"+o[i]+"'>"+i+"</option>"; 
			}else{
				var show = i, value = i, split = i.split('_');
				if(split.length === 2){
					show = split[0];
					value= split[1];
				}
				str += "<option value='"+value+"'>"+show+"</option>";
			}
		}
		return str;
	}

	/**
	 * 拼装年月日组合下拉框数据源
	 * @param beginDate:{year:2000,month:1,day:1}
	 * @param endDate : {year:2012,month:7,day:2}
	 */
	function dateMap(beginDate,endDate){
	    var fullYearMap = {};
	    endDate = endDate || new Date();
	    for(var year = endDate.getFullYear(); year >=  beginDate.getFullYear() ; year--){
	        var yearMap = {},
	            beginMonth = (year == beginDate.getFullYear() ) ? beginDate.getMonth() : 0,
	            endMonth = (year == endDate.getFullYear()) ? endDate.getMonth() : 11;
	        for(var month = beginMonth; month <= endMonth; month++){
	            var beginDay = (year == beginDate.getFullYear() && month == beginDate.getMonth()) ? beginDate.getDate() : 1,
	                endDay = (year == endDate.getFullYear() && month == endDate.getMonth()) ? endDate.getDate() : 31;
	            yearMap[(month+1)+"月_"+year+"-"+(month+1)] = dayOfMonth(year,month,beginDay,endDay);
	        }
	        fullYearMap[year+"年"] = yearMap;
	    }

	    function dayOfMonth(year,month,dayMin,dayMax){
	        var length = 0, result = {}, maxDay = dayMax ? parseInt(dayMax) : 9999, minDay = dayMin || 1;
	        switch(month){
	            case 0:
	            case 2:
	            case 4:
	            case 6:
	            case 7:
	            case 9:
	            case 11: length = 31;break;
	            case 3:
	            case 5:
	            case 8:
	            case 10: length = 30;break;
	            case 1: length = (year%4 == 0 && year%100 != 0 || year%400==0) ? 29 : 28;break;
	            default: length = 0;
	        }
	        length = length > maxDay ? maxDay : length;
	        for(var i=dayMin; i<= length; i++){
	            result[i+"日"] = year+"-"+(month+1)+"-"+i;
	        }
	        return result;
	    }

	    return fullYearMap;
	};
	
	
	var fnOption = {
		options : {
			/**
			 * @type ：Object
			 * 基础数据：未定义时将报错。
			 */
			o : null,
			/**
			 * @type ：Array
			 * 定义多级下拉框的属性，将通过jQuery().attr()赋值。
			 * 注意：定义当前数组的长度为多级下拉框数目
			 */
			selectors : null,	
			/**
			 * 定义多级下拉框的属性，将通过jQuery().attr()赋值。
			 * 以当前属性模板设置所有select具有相同的属性，selectors未定义时可用。
			 */
			selectorModel : {}, 
			/**
			 * 下拉框组所在的标签会直接跟在被隐藏的input后面
			 */
			next: $("<span></span>"),
			/**
			 * 每个下拉框中option的默认值
			 */
			withDefault : "请选择",
			/**
			 * 是否设置，next下拉框元素为空时的隐藏
			 */
			hiddenEmpty : true,
			/**
			 * 是否设置非叶子节点的值的有效性
			 */
			brancheValue: false,
			/**
			 * 在基础json中用于在key中分割当前下拉框显示内容和值的分隔符
			 */
			devide : '_',
			/**
			 * 值索引表中value前缀的分隔符，用来通过一个最终结果值设置多级下拉框选中状态
			 */
			chainSpliter: '$',
			/**
			 * 值索引表中第一个叶子节点的key，用于作为默认项
			 */
			chainFirst:"$$"
		},
		
		_create : function(options,element){
			var $this = this,
				config = $.extend($this.options,options) ,
				withDefault = config.withDefault,
				chainSpliter = config.chainSpliter,
				hiddenEmpty = config.hiddenEmpty,
				next = config.next,
				brancheValue = config.brancheValue,
				o = config.o,
				valueMap = {},
				optionMap = {};
			if(!o)return;
			
			this._reverseMap(o,"",valueMap,optionMap);
			this._sumSelectors(valueMap);
			
			element.each(function(){
				var i = 0;
				$(this).hide().after( (next && (next instanceof $) && next.length === 1) ? config.next.clone().removeAttr("id") : $("<span></span>"));
				var span = $(this).next().html("");
				
				while(i < $this.options.selectors.length){
					var selector = $("<select>"+createOptions(null,withDefault,$this.options.selectors[i]['defaultOption'])+"</select>").attr($this.options.selectors[i]);
					span.append(selector);
					i++;
				}
				
				var input = $(this),
					value = $(this).val();
				
				
				var first = span.children().first();
				
				first.html(createOptions(o,withDefault,first.attr('defaultOption')));
				
				//参数绑定到jQueryDom元素上面，供selectValue使用
				$(this).data("selectData",{
					"o" : o,
					"valueMap" : valueMap,
					"optionMap" : optionMap,
					"withDefault" : withDefault,
					"chainSpliter" : chainSpliter,
					"hiddenEmpty" : hiddenEmpty
				});
				
				//初始化select事件
				span.on('change','select',function(){
					
					var next = $(this).next();
					$(this).nextAll().each(function(){
						$(this).html(createOptions(null,withDefault,$(this).attr('defaultOption')));
					});
					
					//需要隐藏空值下拉框的情况
					if($this.options.hiddenEmpty){
						$(this).nextAll().hide();
						if($(this).val() && optionMap[$(this).val()]){
							//alert($(this).next().length);
							$(this).next().show();
						}
					}
					
					if(next.length){
						next.html(createOptions(optionMap[$(this).val()],withDefault,next.attr('defaultOption')));
					}
					
					input.val($(this).val()).attr('value',$(this).val()).change();
					
					if(!brancheValue && optionMap[$(this).val()]){
						input.val("").attr('value','').change();
					}
				});
				
				//初始化默认值
				$(this).selectValue($(this).val());
				
			});
			
		},
		
		/**
		 * @description 获取值索引表中的最长索引，selectors数组存在时失效
		 */
		_sumSelectors: function(valueMap){
			var config = this.options,
				selectors = config.selectors,
				selectorModel = config.selectorModel;
			if(selectors && selectors.length){
				
			}else{
				var maxLength = 0;
				for(key in valueMap){
					var len = valueMap[key].split(config.chainSpliter).length;
					if(maxLength < len){
						maxLength = len;
					}
				}
				
				config.selectors = new Array();
				
				for ( var i = 0; i < maxLength-2; i++ ) {
					config.selectors[i] = selectorModel;
				}
				
			}
			
			
		},	
		
		/**
		 * 递归创建值索引表valueMap和 下拉选项索引表optionMap
		 */
		_reverseMap : function (o,prefix,valueMap,optionMap){
			
			var prefix = prefix || "",
			valueMap = valueMap || {},
			optionMap = optionMap || {},
			parent = prefix.split(this.options.chainSpliter).pop();

			if(o instanceof Array){
				o = optionMap[parent] = this._arrayToJson(optionMap[parent], this.options.devide);
			}
			
			for(i in o){
				
				if(typeof o[i] === 'string' || typeof o[i] === 'number'){
					valueMap[o[i]] = prefix+this.options.chainSpliter+o[i]+this.options.chainSpliter+i;
					valueMap[this.options.chainFirst] = valueMap[this.options.chainFirst] || valueMap[o[i]];
				}else{
					var t = i;

					var split = i.split(this.options.devide);
					if(split.length === 2){
						valueMap[split[1]] = prefix+this.options.chainSpliter+split[1]+this.options.chainSpliter+split[0];
						t = split[1];
						optionMap[t] = o[i];
					}else{
						optionMap[i] = o[i];
					}
					this._reverseMap(o[i],prefix+this.options.chainSpliter+t,valueMap,optionMap);
				}
				
			}
			
		},
		
		_arrayToJson : function(arr, devide){
			var obj = {};
			for ( var i in arr) {
				if(typeof arr[i] === "string"){
					var split = arr[i].split(devide);
					split.push(split[0]);
					obj[split[0]] = split[1];
				}
			}
			return obj;
		}

	};
	
	$.fn.extend({
		selectors : function(o){
			if( o.beginDate ){
				//如果给出开始日期,不给数据源, 当作日期下拉框处理
				o.o = o.o || dateMap(o.beginDate,o.endDate); 
			}
			fnOption._create(o,this);
			return this;
		},
		/**
		 * ①将当前input设置value
		 * ②设置下拉框值
		 * ③不会触发下拉框的change事件
		 */
		selectValue : function(val){
			
			if(val === undefined){
				return $(this).val();
			}else{
				$(this).val(val).attr('value',val);
				return $(this).each(function(){
					var $this = $(this);
					var data = $this.data("selectData");
				    if(!data){
				    	return;
				    }
					var	o = data.o,
						valueMap = data.valueMap,
						optionMap = data.optionMap;
						withDefault = data.withDefault,
						hiddenEmpty = data.hiddenEmpty,
						chainSpliter = data.chainSpliter;
					
					var first = $this.next().children().first();
					
					//获取填充路径
					var keyMap = "";
					if(val && valueMap[val]){
						keyMap = valueMap[val];
					}else{
						first.children().removeAttr('selected').first().attr('selected',true).select();
					}
					
					var keyArr = keyMap.split(chainSpliter);
					
					//选中第一个层option
					first.children("option[value='"+(keyArr[1]||'')+"']").attr("selected",true);
					$this.next().children().each(function(i){
						//依次选中各个select的option
						next = $(this).next().show();
						if(next.length){
							next.html(createOptions(optionMap[keyArr[i+1]],withDefault,next.attr('defaultOption')));
							if(hiddenEmpty){
								if(next.children().length === 1){
									next.hide();
								}
							}
							try{
								next.children("option[value='"+(keyArr[i+2]||'')+"']").attr("selected",true);
							}catch(e){
								//TODO
							} 
						}
					});
					
					
				});
			}
			
				
			
		}
	});
	
})(wfQuery);
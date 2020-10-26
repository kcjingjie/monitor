/* JS的日期工具类*/
var timeUtil = {
	/* 获取某一年的第N周的开始和结束日期 */
	getWeekDate : function(year, weekNo){
	    // 此年1号是星期几
	    var oneday = new Date(year+'-01-01').getDay(); //0-6
	    // 方便计算，当为星期天时为7
	    if(oneday == 0){
	        oneday = 7;
	    }
	
	    var one_fistday;
	    var one_lastday;
	    // 如果1号刚好是星期一
	    if(oneday == 1){
	         one_fistday = year + '-01-01';
	         one_lastday = year + '-01-07';
	    }else{
	        var jj = 8 - oneday;
	         one_fistday = (year - 1) + '-12-' + (31 - oneday + 2 > 9 ? 31 - oneday + 2 : '0' + (31 - oneday + 2));
	         one_lastday = year + '-01-' + (jj > 9 ? jj : '0' + jj);
	    }
	
	    var fistday;
	    var lastday;
	    // 如果刚好是第一周
	    if(weekNo ==1){
	        fistday = one_fistday;
	        lastday = one_lastday;
	    }
		else
		{
	        fistday = this.addDate(one_lastday, (weekNo-2) * 7 + 1);
	        lastday = this.addDate(one_lastday, (weekNo-1) * 7);
	    }
	    return [fistday, lastday];
	},
	
	getWeekAtYear : function (date) {
	    var d1 = date;
	    var d2 = new Date();
		d2.setYear(date.getFullYear());
	    d2.setMonth(0);
	    d2.setDate(1);
	    var rq = d1 - d2;
	    var days = Math.floor(rq / (24 * 60 * 60 * 1000));
	    var num = Math.floor(days / 7);
	    return num + 1;
	},
	getYearWeek2 : function (a, b, c) {
		/*
        date1是当前日期
        date2是当年第一天
        d是当前日期是今年第多少天
        用d + 当前年的第一天的周差距的和在除以7就是本年第几周
        */
		var date1 = new Date(a, parseInt(b) - 1, c), date2 = new Date(a, 0, 1),
			d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
		return Math.ceil(
			(d + ((date2.getDay() + 1) - 1)) / 7
		);
	},
	/* 
	 * 日期加减法  date参数为计算开始的日期，days为需要加的天数
	 * 格式:addDate('2017-1-11', 20) 
	 */
	addDate : function (date, days){ 
	    var d = new Date(date); 
	    d.setDate(d.getDate() + days); 
	    var m = d.getMonth() + 1; 
	    return d.getFullYear()+'-'+(m>9?m:'0'+m)+'-'+(d.getDate()>9?d.getDate():'0'+d.getDate()); 
	}
};
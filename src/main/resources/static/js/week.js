var week = {
	vueLeft : null,
	vueRight : null,
	sequence: 0,
	init : function(){
		var _this = this;
		this.vueLeft = new Vue({
			el: '#div-left',
			data: {
				year: '',
				weeks: [],
			},
			methods: {
				changeWeek : function(sequence){
					_this.changeWeek(sequence);
				},
				
				changeYear : function(offset){
					_this.changeYear(offset);
				}
			}
		});
		
		this.vueRight = new Vue({
			el: '#div-week-list',
			data: {
				description : '',
				publicDate : '',
				industryNews : [],
				safeNews : [],
				hotNews:[]
			},
			methods: {
				exportWeekNews : function(){
					_this.exportWeekNews();
				},
				deleteReportFromDaily: function (index, id,time,newsName) {
					_this.deleteReportFromDaily(index, id,time,newsName);
				}
			}
		});
		var date = new Date();
		this.createWeeks(date);
		/*var weekNum = timeUtil.getWeekAtYear(date);*/
		var weekNum = timeUtil.getYearWeek2(date.getFullYear(),date.getMonth()+1,date.getDate());

		this.changeWeek(weekNum);
	},
	
	exportWeekNews : function(){
		var sequence = this.sequence;
		var year = this.vueLeft.year;
		var times = timeUtil.getWeekDate(year, sequence);
		console.log("导出周报中");
		window.location.href="/week/exportWeekReport?startTime="+times[0]+"&endTime="+times[1]+"&sequence="+sequence+"&year="+year;
	},
	
	changeYear : function(offset){
		var year = this.vueLeft.year;
		var today = new Date();
		var tempYear = today.getFullYear();
		if(year == tempYear && offset == 1)
		{
			toastr.warning('已是当前年份。');
			return;
		}
		
		var selectYear = year + offset;
		var date = new Date();
		if(selectYear < tempYear)
		{
			date.setYear(selectYear);
			date.setMonth(11);
			date.setDate(31);
		}
		this.createWeeks(date);
		this.changeWeek(1);
	},
	
	changeWeek : function(sequence){
		this.sequence =sequence;
		var year = this.vueLeft.year;
		var times = timeUtil.getWeekDate(year, sequence);
		var startTime = times[0];
		var endTime = times[1];
		var data = {startDate : startTime, endDate : endTime};

		this.vueRight.industryNews = [];
		this.vueRight.safeNews = [];
		this.vueRight.hotNews = [];
		this.vueRight.publicDate = new Date(startTime).Format('MM月dd日') + ' ~ ' + new Date(endTime).Format('MM月dd日');
		var array = [year, '年 第', sequence, '周'];
		this.vueRight.description = array.join('');
		requestUtil.get('/week/listNews', data, this.onListWeekNewsSuccess.bind(this), null);
	},
	
	onListWeekNewsSuccess : function(response){
		if(!response.data || !response.data.data)
		{
			toastr.warning("暂无数据");
			return;
		}
		
		var news = response.data.data;
		if(news.length == 0)
		{
			toastr.warning("暂无数据");
			return;
		}
		
		for (var i = 0; i < news.length; i++) {
			var temp = news[i];
			var publishWeekType = temp.publishWeekType;
			var content = temp.content;
			var publishWeekTime = temp.publishWeekTime;
			var ps = content.split('###');
			if (ps[0] == "")
				ps.shift();
				
			var time = new Date(temp.time).Format('yyyy年MM月dd日');
			var viewData = {id: temp.id, title: temp.title, source: temp.source, time: time, contents: ps,publishWeekTime:publishWeekTime};
				
			if(0 == publishWeekType)
			{
				this.vueRight.industryNews.push(viewData);
			}
			else if( 1 == publishWeekType)
			{
				this.vueRight.safeNews.push(viewData);
			}
			else if (2 == publishWeekType)
			{
				this.vueRight.hotNews.push(viewData);
			}
		}
	},
	
	createWeeks : function(date){
		var year = date.getFullYear();
		this.vueLeft.year = year;
		this.vueLeft.weeks.length = 0;
		/*var weekNum = timeUtil.getWeekAtYear(date);*/
		var weekNum = timeUtil.getYearWeek2(date.getFullYear(),date.getMonth()+1,date.getDate());

		for (var i = 0; i < weekNum; i++) 
		{
			this.vueLeft.weeks.push(i + 1);
		}
	},
	deleteReportFromDaily: function (index, id,time,newsName) {
		var _this = this;
		requestUtil.get('/week/delete/' + id, {day:time}, function (response) {
			if (newsName == 'industry'){
				_this.vueRight.industryNews.splice(index, 1);
			} else if(newsName == 'safe'){
				_this.vueRight.safeNews.splice(index, 1);
			}else if(newsName == 'hot'){
				_this.vueRight.hotNews.splice(index, 1);
			}
		}, null);
	},
};
var daily = {
	vue: null,

	init: function () {
		var _this = this;
		var vue = new Vue({
			el: '#div-all-content',
			data: {
				dateTime: '',
				news: []
			},
			methods: {
				exportDaily: function () {
					_this.exportDaily();
				},
				deleteReportFromDaily: function (index, id) {
					_this.deleteReportFromDaily(index, id);
				}
			}
		});
		this.vue = vue;
		$('#time').datetimepicker({
			bootcssVer: 3,
			language: 'zh-CN',
			format: 'yyyy-mm-dd',
			weekStart: 0, //一周从哪一天开始
			todayHighlight: true, //如果为true, 高亮当前日期。
			minView: 2,
			clearBtn: true,
			autoclose: true,
			initialDate: new Date() // 默认时间
		}).on('changeDate', function (ev) {
			var date = $('#time').val();
			_this.getDailyContent(date);
		});
		
		$("#time").datetimepicker("setDate", new Date());
		
		var now = new Date();
		var todayDate = now.Format('yyyy年MM月dd日');
		$('#todayDate').text(todayDate);
		//初始进入时，默认显示当天的日报
		this.getDailyContent(now.Format('yyyy-MM-dd'));
	},

	deleteReportFromDaily: function (index, id) {
		var _this = this;
		var time = $('#time').val();
		requestUtil.get('/daily/delete/' + id, {day:time}, function (response) {
			_this.vue.news.splice(index, 1);
		}, null);
	},

	onGetDailySuccess: function (response) {
		var datas = response.data.data;
		if (!datas || datas.length==0)
			toastr.warning('暂无数据。');
		else {
			this.vue.news = [];
			for (var i = 0; i < datas.length; i++) {
				var data = datas[i];
				var content = data.content;
				var ps = content.split('###');
				if (ps[0] == "")
					ps.shift();
				var date = new Date(data.time);
				var timeFormat = date.Format("yyyy-MM-dd");
				var viewData = {id: data.id, title: data.title, source: data.source + ' ' + timeFormat, contents: ps};
				this.vue.news.push(viewData);
				var time = $('#time').val();
				var ps = time.split('-');
				$('#todayDate').text(ps[0]+"年"+ps[1]+"月"+ps[2]+"日");
			}
		}
	},

	getDailyContent: function (date) {
		this.vue.dateTime = '';
		this.vue.news = [];
		requestUtil.get('/daily/list', {date:date}, this.onGetDailySuccess.bind(this), null);
	},

	exportDaily:function () {
		var time = $('#time').val();
/*
		requestUtil.get('/daily/export',{day:time},null,null);
*/
		window.location.href="/daily/export?day=" + time;
	}

}

	



	

var searchContent = {
	tableData : [],
	pageSize : 10,
	sort : 0,/*时间排序标志位  0为倒序 1为正序*/
	
	/* 页面初始化 */
	init : function(){
		this.initTimepicker();
		/* table不能反复销毁和重建，会影响性能，应该只初始化一次 */
		this.initBootstrapTable();
		
		var _this = this;
		$('#btn-search').click(function(){
			_this.requestData();
		});
		$('#time-sort').click(function(){
			_this.sort = _this.sort == 1 ? 0 : 1;
			_this.requestData();
		});
		var searchContent = this.getURLParam("searchContent");
		var searchVal = decodeURI(searchContent)
		var selectVal = this.getURLParam("selectVal");
		$('#searchContent_title').val(searchVal);
		$('#searchContent_content').val(searchVal);
		
		/* 初始化完成后，开始执行业务流程，搜索数据 */
		this.requestData();
	},
	
	initTimepicker : function(){
		var date = new Date();
		for(var index = 1; index <= 2; index++)
		{
			$('#time' + index).datetimepicker({
			    bootcssVer: 3,
			    language: 'zh-CN',
			    format: 'yyyy-mm-dd',
			    weekStart: 0, //一周从哪一天开始
			    todayHighlight: true, //如果为true, 高亮当前日期。
			    minView: 2,
			    clearBtn:true,
				autoclose: true,
			    initialDate: date // 默认时间
			});
			/*$("#time1").datetimepicker("setDate", date);*/
		}
	},
	
	initBootstrapTable : function(){
		var _this = this;
		var columns = [{
		        field: 'sequence',
		        title: '序号',
		        width:'5%',
		        align: 'center',
		    }, {
		        field: 'title',
		        align: 'center',
		        title: '标题',
		        width:'40%',
		    }, {
		        field: 'time',
		        title: '发布时间',
		        width:'15%',
		        align: 'center',
		    }, {
		        field: 'source',
		        title: '来源',
		        align: 'center',
		        width:'15%'
		    }, {
		        field: 'publishInfo',
		        title: '操作',
		        align: 'center',
		        width:'25%',
				events: _this.operateEvents,
		        formatter:function (value,row,index) {
					var daily = value.daily;
					var week = value.week;
					
					var html = '<div class="div-news-button">' + 
						'<button type="button" class="btn-daily {0}">日报</button>' + 
						'<button type="button" class="btn-week {1}">动态</button>' + 
						'<button type="button" class="btn-week {2}">突发</button>' + 
						'<button type="button" class="btn-week {3}">热点</button>' + 
					'</div>';
					
					if(daily == 1)
					{
						html = html.replace('{0}', 'btn btn-success');
					}
					else
					{
						html = html.replace('{0}', 'btn btn-default');
					}
					
					if(week == 0)
					{
						html = html.replace('{1}', 'btn btn-success');
						html = html.replace('{2}', 'btn btn-default');
						html = html.replace('{3}', 'btn btn-default');
					}
					else if(week == 1)
					{
						html = html.replace('{1}', 'btn btn-default');
						html = html.replace('{2}', 'btn btn-success');
						html = html.replace('{3}', 'btn btn-default');
					}
					else if(week == 2)
					{
						html = html.replace('{1}', 'btn btn-default');
						html = html.replace('{2}', 'btn btn-default');
						html = html.replace('{3}', 'btn btn-success');
					}
					else
					{
						html = html.replace('{1}', 'btn btn-default');
						html = html.replace('{2}', 'btn btn-default');
						html = html.replace('{3}', 'btn btn-default');
					}
					
		            return html;
		        },
		    },
		];
		
		$('#table').bootstrapTable({
		    data: this.tableData,
		    showHeader:false,
		    showLoading:false,
		    queryParams : "postQueryParams",//自定义参数
		    pageSize : this.pageSize,//每页大小
		    pageList : [8, 16, 32, 64],//可以选择每页大小
		    columns: columns,
		    onClickCell: _this.onClickCellHandler.bind(_this)
		});
	},
	
	operateEvents : {
		'click .btn-daily' : function(e, value, row, index){
			var btn = e.currentTarget;
			
			var now = new Date();
			var year = now.getFullYear();
			/*var weekNum = timeUtil.getWeekAtYear(now);*/
			var weekNum = timeUtil.getYearWeek2(now.getFullYear(),now.getMonth()+1,now.getDate());
			var times = timeUtil.getWeekDate(year, weekNum);
			var startTime = times[0];
			var endTime = times[1];
			
			var data = {newId:row.id, title:row.title};
			requestUtil.get("/daily/publishDaily", data, function (response) {
				if(btn.className.indexOf('btn-success') != -1)
				{
					btn.className = 'btn-daily btn btn-default';
				}
				else
				{
					btn.className = 'btn-daily btn btn-success';
				}
			},function (response) {
			    toastr.warning('添加失败。');
			});
		},
		
		'click .btn-week' : function(e, value, row, index){
			var btn = e.currentTarget;
			
			var text = btn.innerText;
			var weekType = 0;
			if('动态' == text)
			{
				weekType = 0;
			}
			else if('突发' == text)
			{
				weekType = 1;
			}
			else if('热点' == text)
			{
				weekType = 2;
			}
			
			var now = new Date();
			var year = now.getFullYear();
			/*var weekNum = timeUtil.getWeekAtYear(now);*/
			var weekNum = timeUtil.getYearWeek2(now.getFullYear(),now.getMonth()+1,now.getDate());
			var times = timeUtil.getWeekDate(year, weekNum);
			var startTime = times[0];
			var endTime = times[1];
			
			var data = {newId:row.id, title:row.title, weekType:weekType, startDate : startTime, endDate : endTime};
			requestUtil.get("/daily/publishWeek", data , function (response) {
				var indexOf = btn.className.indexOf('btn-success');
				var nodes = btn.parentNode.children;
				for(var i = 0; i < nodes.length; i++) 
				{
					if(i > 0)
					{
						nodes[i].className = 'btn-week btn btn-default';
					}
				}
				
				if(indexOf != -1)
				{
					btn.className = 'btn-daily btn btn-default';
				}
				else
				{
					btn.className = 'btn-daily btn btn-success';
				}
			},function (response) {
			    toastr.warning('添加失败。');
			});
		}
	},
	
	onClickCellHandler : function (field, value, row, $element) {
		if (field == 'publishInfo')
		{
			return;
		}
		else
		{
			window.open(row.url, 'blank');
		}
	},
	
	/* 检索url后面参数的方法, paramName为参数名 */
	getURLParam : function(paramName){
		var svalue = location.search.match(new RegExp("[\?\&]" + paramName + "=([^\&]*)(\&?)", "i"));
		return svalue ? unescape(svalue[1]) : unescape(svalue);
	},
	
	requestData : function (){
		var _this = this;
	    var type = $('#selectVal').val();
	    var startTime =  $('#time1').val();
	    var endTime = $('#time2').val();
	    var searchContent_title = $('#searchContent_title').val();
	    var searchContent_content = $('#searchContent_content').val();
	    var title_isContain = $('#title_isContain').val();
	    var content_isContain = $('#content_isContain').val();

	    var data = {
	        pageNum : 1,
	        pageSize : this.pageSize,
	        searchContent_title : searchContent_title,
	        searchContent_content : searchContent_content,
	        title_isContain : title_isContain,
	        content_isContain : content_isContain,
	        type : type,
	        startTime : startTime,
	        endTime : endTime,
			timeSort: _this.sort
	    };
	   
	    requestUtil.get("../news/getNews", data, this.onSuccessHandler.bind(this), null);
	},
	
	/* 函数最好不要定义在另一个常调用的函数中，内存无法回收 */
	onSuccessHandler : function(response){
		var data = response.data.data;
		var msg = response.data.msg;
		if (data != null){
		    if (msg == 'OK'){
		        var array = data.data;
				this.parseData(array, 1);
				
		        this.initPage(data.total);
		    }
		}
	},
	
	parseData : function(array, page){
		var tableDatas = [];
		for (var i = 0; i < array.length; i++) 
		{
			var temp = array[i];
			var publishDailyTime = temp.publishDailyTime;
			var publishWeekType = temp.publishWeekType;
			var publishWeekTime = temp.publishWeekTime;
			var publishInfo = {};//
			var now = new Date();
			var nowStr = now.Format('yyyy-MM-dd');
			var dailyTime = new Date(publishDailyTime).Format('yyyy-MM-dd');
			var weekTime = new Date(publishWeekTime);
			if(nowStr == dailyTime)
			{
				publishInfo.daily = 1;//今天发布过
			}
			else
			{
				publishInfo.daily = 0;
			}
			
			var year = now.getFullYear();
			/*var weekNum = timeUtil.getWeekAtYear(now);*/
			var weekNum = timeUtil.getYearWeek2(now.getFullYear(),now.getMonth()+1,now.getDate());
			var times = timeUtil.getWeekDate(year, weekNum);
			var startTime = times[0];
			var endTime = times[1];
			if(weekTime >= new Date(startTime) && weekTime <= new Date(endTime))
		{
			publishInfo.week = publishWeekType;
		}
			else
			{
				publishInfo.week = -1;
			}
			var sequence = (page - 1) * this.pageSize + 1 + i;
			var viewData = {
				id : temp.id,
				sequence : sequence,
				title : temp.title,
				url : temp.url,
				time : new Date(temp.time).Format('yyyy-MM-dd'),
				source : temp.source,
				publishInfo : publishInfo
			};
			tableDatas.push(viewData);
			temp.publishInfo = temp.publishType + '#' + temp.publishTime;
		}
		$('#table').bootstrapTable('load', {'data' : tableDatas});
	},
	
	initPage : function (total){
		var _this = this;
	    $("#myPage").sPage({
	        page:1,//当前页码，必填
	        total:total,//数据总条数，必填
	        pageSize:10,//每页显示多少条数据，默认10条
	        totalTxt:"共{total}条",//数据总条数文字描述，{total}为占位符，默认"共{total}条"
	        showTotal:true,//是否显示总条数，默认关闭：false
	        showSkip:true,//是否显示跳页，默认关闭：false
	        showPN:true,//是否显示上下翻页，默认开启：true
	        prevPage:"上一页",//上翻页文字描述，默认“上一页”
	        nextPage:"下一页",//下翻页文字描述，默认“下一页”
	        backFun:function(page){
	            //点击分页按钮回调函数，返回当前页码
	            _this.toPage(page);
	        }
	    });
	},
	
	toPage : function (page) {
		var _this = this;
	    var type = $('#selectVal').val();
	    var startTime =  $('#time1').val();
	    var endTime = $('#time2').val();
	    var searchContent_title = $('#searchContent_title').val();
	    var searchContent_content = $('#searchContent_content').val();
	    var title_isContain = $('#title_isContain').val();
	    var content_isContain = $('#content_isContain').val();
	    $.ajax({
	        type:'get',
	        url:'../news/getNews',
	        data:{
	            pageNum:page,
	            pageSize:_this.pageSize,
	            searchContent_title:searchContent_title,
	            searchContent_content:searchContent_content,
	            title_isContain:title_isContain,
	            content_isContain:content_isContain,
	            type:type,
	            startTime:startTime,
	            endTime:endTime,
				timeSort:_this.sort
	        },
	        success:function (data) {
	            if (data!=null){
	                var array = data.data.data;
					_this.parseData(array, page);
	            }
	        }
	    });
	}
};


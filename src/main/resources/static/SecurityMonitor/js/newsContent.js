var newsContent = {
	getContent : function(){
		 var param = decodeURI(window.location.search.substring(1));
		 var values = param.split('=');
		 if(values[0] == 'id')
		 {
			 var id = values[1];
			 //请求数据,下方为模拟数据
			 var data = {};
			 data.title = '仙桃一化工企业发生闪爆事故 已致4人失联5人受伤';
			 data.source = '中国新闻网 2020-08-20 10:30:25';
			 data.contents = [];
			 data.contents[0] = '据湖北省应急管理厅3日晚信息，3日17时30分许，位于湖北省仙桃市西流河镇的仙桃市蓝化有机硅有限公司丁酮肟车间发生闪爆事故，目前已致4人失联，5人受伤。';
			 data.contents[1] = '截至19时，火势已被扑灭，受伤人员均已送往医院治疗，失联人员正在搜救中。';
			 data.contents[2] = '事故发生后，仙桃市主要领导组织公安、消防、应急、环保、卫健等部门开展处置，湖北省消防总队江汉支队、武汉支队18车82名消防队员在现场救援。湖北省应急管理厅工作组已到现场指导救援处置工作，目前现场未发生次生灾害，事故原因正在调查。';
			 this.showContent(data);
		 }
		 else
		 {
			 toastr.warning('参数错误');
		 }
	},
	
	showContent : function(data){
		var html = '<h3 align="center" style="color: #005BAC;">{title}</h3>' + 
			'<div id="div-from">' + 
				'<span>{source}</span>' + 
				'<div id="div-action">' + 
					'<a>发布到日报</a>' + 
					'<a>发布到周报</a>' + 
					'<a>从列表中删除</a>' + 
				'</div>' + 
			'</div>' + 
			
			'<div id="div-content">' + 
				'{content}' + 
			'</div>';
			
		var title = data.title;
		var source = data.source;
		var contents = data.contents;
		var content = '';
		for(var i = 0; i < contents.length; i++)
		{
			var temp = '<p>' + contents[i] + '</p>';
			content = content + temp;
		}
		
		html = html.replace('{title}', title);
		html = html.replace('{source}', source);
		html = html.replace('{content}', content);
		
		document.querySelector('#div-container').innerHTML = html;
	}
};
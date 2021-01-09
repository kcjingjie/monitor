//通用的http请求：get、post，封装了对请求成功和错误的处理。
var requestUtil = {
	baseUrl : 'http://127.0.0.1:10031/',
	
	get : function(url, data, onSuccess, onError){
		var args = {
			args : arguments
		};
		
		var _this = this;
		
		if(data == null)
			data = {};
		
		var params = {params : data};	
		
		// axios.get(_this.baseUrl+url, params).then(function(response){
		// 	_this.onSuccess(response, args);
		// });
		
		$.ajax({
		    method:'get',
		    url: _this.baseUrl + url,
			data: data,
		    success:function (res) {
				_this.onSuccess(res, args);
		    }
		});
	},
	
	post : function(url, data, onSuccess, onError){
		var args = {
			args : arguments
		};
		
		var _this = this;
		
		if(data == null)
			data = {};
		
		axios.get(_this.baseUrl+url, data).then(function(response){
			_this.onSuccess(response, args);
		});
	},
	
	onSuccess : function(response, args){
		var onSuccess = args.args[2];
		var onError = args.args[3];
		
		if(response.success != true){
			if(onError)
				onError(response);
			else
				toastr.warning(response.data.msg);
			
			return;
		}
		
		if(onSuccess)
			onSuccess(response);
		else
			toastr.warning("请求成功.");
	},
	
	onError : function(error, args){
		var onError = args.args[3];
		
		var response = error.response;
		if(onError)
			onError(response);
		else
			toastr.warning(response.data.msg);
	}
};
var baseUrl = 'http://123.57.131.21:10031';
var sockerUrl = 'ws://123.57.131.21:10031/server';

var canvas,canvas2,canvas3;
//decoder
var decoder1,decoder2,decoder3;
//声明下面的cxt
var cxt1;
var cxt2;
var cxt3;
var preBoxTime1 = 0;
var preBoxTime2 = 0;
var preBoxTime3 = 0;
//更改图片的下标
var changeIndex = 0;
//滚动的dv
var $dList = $('.div_scroll');

initContainer();
function initContainer() {
    var container = document.getElementById("playercontainer1");
    var container2 = document.getElementById("playercontainer2");
    var container3 = document.getElementById("playercontainer3");

    var containerHeight = container.offsetWidth * 4 / 6;
    container.style.height = containerHeight+'px';
    container2.style.height =  containerHeight+'px';
    container3.style.height =  containerHeight+'px';

}
function handleError(e) {
    console.log('捕获到错误', e);
}

function handleSuccess() {
    console.log("播放成功。");
}

function getToken() {
    var token = '';
    $.ajax({
        url: "https://open.ys7.com/api/lapp/token/get",
        type: 'POST',
        async: false,
        data: {
            appKey: '04dd4edbcc944faea177776aad714b72',
            appSecret: 'dbc1b753f17d66986b776c7bb9a41622'
        },
        success: function (data) {
            console.log(data);
            if (data.code == '200') {
                token = data.data.accessToken;
            } else if (data.code == "111001") {
                return false;
            } else {

            }
        },
        error: function (err) {

        }
    })
    return token;
}

function playVideo(num) {
    var url = $('#url' + num).val().trim();
    if (url == ''){
        toastr.warning('播放地址不能为空。');
        return;
    }
	
	var url1 = $('#url1').val().trim();
	var url2 = $('#url2').val().trim();
	var url3 = $('#url3').val().trim();
	
	if((url1 == url2 && url1 != '') || (url1 == url3 && url1 != '') || (url2 == url3 && url2 != ''))
	{
		toastr.warning('播放地址不能重复。');
		return;
	}
	
    var token = getToken();
    var container = document.getElementById("playercontainer1");
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetWidth * 4 / 6;
    var tempDecoder = new EZUIKit.EZUIPlayer({
        id: 'playercontainer' + num,
        autoplay: true,
        url: url,
        accessToken: token,
        decoderPath: '../js',
        width: containerWidth,
        height: containerHeight,
        handleError: handleError,
        handleSuccess: handleSuccess
    });
    if (num == 1 ){
        decoder1 = tempDecoder;
    }else if(num==2){
        decoder2 = tempDecoder;
    }else {
        decoder3 = tempDecoder;
    }
    initCanvas(num);
}

var websocket;
// 首先判断是否 支持 WebSocket
if ('WebSocket' in window) {
    websocket = new WebSocket(sockerUrl);
} else if ('MozWebSocket' in window) {
    websocket = new MozWebSocket(sockerUrl);
} else {
    websocket = new SockJS(sockerUrl);
}

websocket.onopen = function (evnt) {
    console.log('ws clint:open websocket');
    //发送消息 
    var obj = {"msgContent": "dran", "sex": "man"};
    var jstring = JSON.stringify(obj);
    console.log('ws clint:send msg:' + jstring)
    websocket.send(jstring);
};
//websocket 接受消息
websocket.onmessage = function (evnt) {
    if (evnt.data == "连接成功") {
		console.log('websocket连接服务器成功。');
		return;
    }
    var data = $.parseJSON(event.data);
	// console.log('数据已接收:' + data.detect);
    if (data.detect != null && data.detect.length > 0) {
        changeRealTimeViolation(data);
		// changeBottomImg(data);
		// drawArea(data);
    }
};

websocket.onerror = function (evnt) {
    console.log('ws client:error ' + evnt);
};

websocket.onclose = function (evnt) {
    console.log('ws clent:close ');
}
//根据编号初始化canvas
function initCanvas(num) {
    if (num == 1){
        canvas = document.getElementById("canvas"+num);
        cxt1 = canvas.getContext("2d");
    } else if (num == 2 ){
        canvas2 = document.getElementById("canvas"+num);
        cxt2 = canvas2.getContext("2d");
    }else {
        canvas3 = document.getElementById("canvas"+num);
        cxt3 = canvas3.getContext("2d");
    }

}
//根据设备编号画canvas
function drawArea(data) {
    var index = 0;
    var tempCxt;
	if(!data.deviceId)
		return
	
    for (var i = 1; i < 4; i++)
    {
        var playUrl = $('#url'+i).val();
        if (playUrl.indexOf(data.deviceId) != -1)
		{
            index = i;
            if (index == 1){
                tempCxt = cxt1;
            } else if (index == 2 ){
                tempCxt = cxt2;
            }else {
                tempCxt = cxt3;
            }
            break;
        }
    }
	
	if(!tempCxt)
		return;
		
	var tempDecoder;
	if(index == 1)
	{
		preBoxTime1 = new Date().getTime();
		tempDecoder = decoder1;
	}
	else if(index == 2)
	{
		preBoxTime2 = new Date().getTime();
		tempDecoder = decoder2;
	}
	else if(index == 3)
	{
		preBoxTime3 = new Date().getTime();
		tempDecoder = decoder3;
	}
	
    var canvas = document.getElementById('canvas' + index);
    var canvasWidth = canvas.offsetWidth;
    var canvasHeight = canvas.offsetWidth * 4 / 6;
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;
    tempCxt.clearRect(0, 0, canvasWidth, canvasHeight);
    tempCxt.strokeStyle = "#FF0000";
    //根据比例来
    var container = document.getElementById('playercontainer' + index);
    var width = container.offsetWidth;
    var height = container.offsetWidth * 4 / 6;
	
	var getOSDTimePromise = tempDecoder.getOSDTime();
	getOSDTimePromise.then(function(videoTime){
		//这里判断视频的时间和监测的时间匹配度 5秒
		for (var i = 0; i < data.detect.length; i++)
		{
			var temp = data.detect[i];
			var time = temp.time;
			if(videoTime > time)
			{
				var d = videoTime - time;
				console.log('===播放时间大于违章时间===，差值 = ' + d);
			}
			else
			{	
				var d = time - videoTime;
				console.log('********播放时间小于违章时间*******，差值 = ' + d);
			}
			var position = temp.polygon.position;
		    tempCxt.moveTo(position[0] / 100 * width, position[1] / 100 * height);
		    for (var j = 0; j < temp.polygon.count; j++) {
		        tempCxt.lineTo(position[j*2] / 100 * width, position[j*2+1] / 100 * height);
		    }
		    tempCxt.lineTo(position[0] / 100 * width, position[1] / 100 * height);
		}
		tempCxt.stroke();
	});
	
    // var videoTime = getOSDTime(index);
    
}
//更改下面的图片
function changeBottomImg(){

    $.ajax({
        url: baseUrl + "/smartsafe/getBottomImage",
        type: 'get',
        async: false,
        success: function (data) {
            if (data.data!=null && data.success==true){
                for (var i=0;i<data.data.length;i++){
                    $('#bottom_img'+(i+1)).attr('src',data.data[i].imageUrl);
                }
            }
        },
        error: function (err) {

        }
    })
}
//更改实时告警列表
function changeRealTimeViolation(data){
    scrollDiv(data);
}
//滚动动画
function scrollDiv(data) {
    //获取div高度
    var length = $(".div_scroll").children().length;
	if (data.detect != null && data.detect.length > 0)
	{
	    for (var i = 0; i < data.detect.length; i++)
		{
			var tempDetect = data.detect[i];
			var array = [];
			array.push('<div class="realTimeViolation"><span>设备：');
			array.push(data.deviceId);
			array.push('，类型：');
			array.push(getDetectTypeStr(tempDetect.type));
			array.push('，概率：');
			array.push(tempDetect.probability);
			array.push('%，时间：');
			array.push(new Date(tempDetect.time).Format('yyyy-MM-dd hh:mm:ss'));
			array.push('。</span></div>');
			if(length >= 13)
			{
				var scrollHeight = $('.div_scroll div:first').height();
				//滚出一个li的高度
				$dList.stop().animate({marginTop:-scrollHeight},100,function () {
				    //动画结束后
				    var b = document.getElementsByClassName('realTimeViolation');
				    //默认是从下标0开始，想要移除第二个就是a[1].remove();
					// console.log('scrollHeight = ' + scrollHeight);
				    b[0].remove();
					$dList.append(array.join(''));
				    $dList.css('marginTop',0);
				});
			}
			else
			{
				$dList.append(array.join(''));
				length += 1;
			}
	    }
	}
}

setInterval(clearRect,1000);

function clearRect() {
	var tempTime = new Date().getTime();
	if(cxt1)
	{
		if(tempTime - preBoxTime1 > 5000)
		{
			var canvas = document.getElementById('canvas1');
			var canvasWidth = canvas.width;
			var canvasHeight = canvas.height;
			cxt1.clearRect(0, 0, canvasWidth, canvasHeight);
		}
	}
	
	if(cxt2)
	{
		if(tempTime - preBoxTime2 > 5000)
		{
			var canvas = document.getElementById('canvas2');
			var canvasWidth = canvas.width;
			var canvasHeight = canvas.height;
			cxt2.clearRect(0, 0, canvasWidth, canvasHeight);
		}
	}
	
	if(cxt3)
	{
		if(tempTime - preBoxTime3 > 5000)
		{
			var canvas = document.getElementById('canvas3');
			var canvasWidth = canvas.width;
			var canvasHeight = canvas.height;
			cxt3.clearRect(0, 0, canvasWidth, canvasHeight);
		}
	}	
}

function getDetectTypeStr(type){
	if(type == 1)
		return '安全帽';
	if(type == 2)
		return '安全绳';
	if(type == 3)
		return '着装';
	if(type == 4)
		return '跨越围栏';
	return '未知';
}

//每隔5秒更新底部图片
setInterval(changeBottomImg,5000);

function getOSDTime(index){
    var tempDecoder;
    if (index == 1){
        tempDecoder = decoder1;
    }else if( index == 2){
        tempDecoder = decoder2;
    }else {
        tempDecoder = decoder3;
    }
    var getOSDTimePromise = tempDecoder.getOSDTime();
	getOSDTimePromise.then(function(data){
	    return data;
	})
}

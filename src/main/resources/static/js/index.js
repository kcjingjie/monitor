var canvas;
var cxt;
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
    console.log("播放成功回调函数，此处可执行播放成功后续动作");
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
                token = data.data.accessToken
            } else if (data.code == "111001") {
                return false;
            } else {

            }
        },
        error: function (err) {

        }
    })
    //return 'ra.4iqnlesz1uy22y8612w2kk8l2zwf0v34-5tpezsnoux-14mjpj7-fiihjxsow';
    return token;
}

function playVideo(num) {
    var url = $('#url' + num).val().trim();
    var token = getToken();
    var container = document.getElementById("playercontainer1");
    var containerWidth = container.offsetWidth;
    var containerHeight = container.offsetWidth * 4 / 6;
    var decoder = new EZUIKit.EZUIPlayer({
        id: 'playercontainer' + num,
        autoplay: true,
        url: url,
        accessToken: token,
        decoderPath: '',
        width: containerWidth,
        height: containerHeight,
        handleError: handleError,
        handleSuccess: handleSuccess,
    });
    decoder.play({
        handleError: handleError
    });
    initCanvas();
}

var websocket;
// 首先判断是否 支持 WebSocket
if ('WebSocket' in window) {
    websocket = new WebSocket("ws://127.0.0.1:8000/server");
} else if ('MozWebSocket' in window) {
    websocket = new MozWebSocket("ws://127.0.0.1:8000/server");
} else {
    websocket = new SockJS("ws://127.0.0.1:8000/server");
}

websocket.onopen = function (evnt) {
    console.log('ws clint:open websocket');
    //发送消息 
    var obj = {"msgContent": "dran", "sex": "man"};
    var jstring = JSON.stringify(obj);
    console.log('ws clint:send msg:' + jstring)
    websocket.send(jstring);
};

websocket.onmessage = function (evnt) {
    if (evnt.data == "成功建立socket连接") {

    }
    console.log('数据已接收:' + evnt.data.detect);
    var data = $.parseJSON(event.data);
    if (data.detect != null && data.detect.length > 0) {
        drawArea(data);
    }
};

websocket.onerror = function (evnt) {
    console.log('ws client:error ' + evnt);
};

websocket.onclose = function (evnt) {
    console.log('ws clent:close ')
}

function initCanvas() {
    canvas = document.getElementById("myCanvas");
    cxt = canvas.getContext("2d");
}

function drawArea(data) {
    var canvas = document.getElementById("myCanvas");
    var canvasWidth = canvas.offsetWidth;
    var canvasHeight = canvas.offsetWidth * 4 / 6;
    canvas.height = 0;
    canvas.width = 0
    canvas.height =canvasHeight;
    canvas.width = canvasWidth;
    cxt.clearRect(0, 0, canvasWidth, canvasHeight);
    cxt.strokeStyle = "#FF0000";
    //根据比例来
    var container = document.getElementById("playercontainer1");
    var width = container.offsetWidth;
    var height = container.offsetWidth * 4 / 6;
    for (var i = 0; i < data.detect.length; i++) {
        cxt.moveTo(data.detect[i].polygon.position[0] / 100 * width, data.detect[i].polygon.position[1] / 100 * height);
        for (var j = 0; j < data.detect[i].polygon.count; j++) {
            cxt.lineTo(data.detect[i].polygon.position[j*2] / 100 * width, data.detect[i].polygon.position[j*2+1] / 100 * height);
        }
        cxt.lineTo(data.detect[i].polygon.position[0] / 100 * width, data.detect[i].polygon.position[1] / 100 * height);
    }
    cxt.stroke();
}

function clearCanvas() {

}
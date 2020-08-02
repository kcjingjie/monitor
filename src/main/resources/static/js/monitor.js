function playVideo(){
    var player = cyberplayer("playercontainer").setup({
        flashplayer: "cyberplayer.flash.swf",
        width: '100%',
        height: '85%',
        repeat: false,
        file: "rtmp://58.200.131.2:1935/livetv/hunantv",
        autostart: true,
        stretching: "uniform",
        volume: 0,
        controls: true,
        rtmp: {
            reconnecttime: 5, // rtmp直播的重连次数
            bufferlength: 0 // 缓冲多少秒之后开始播放 默认1秒
        }
    });
}
playVideo();
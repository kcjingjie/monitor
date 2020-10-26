//当dom结构加载好之后
$(document).ready(function () {
    var success = function(response){
        var data = response.data.data;
        var msg = response.data.msg;
        if (data!=null){
            if (msg == 'OK'){
                changeLink(data.electric,data.safe);
            }
        }
    }
    requestUtil.get("../news/getNewsForIndex",null,success,null);
})
//更改新闻的内容和url
function changeLink(electric,safe) {
    if (electric!=null){
        for (var i=0;i<electric.length;i++){
            $('#electric_'+i).attr('href',electric[i].url);
            $('#electric_'+i).text(electric[i].title);
        }
    }
    if (safe!=null){
        for (var i=0;i<safe.length;i++){
            $('#safe_'+i).attr('href',safe[i].url);
            $('#safe_'+i).text(safe[i].title);
        }
    }
}
function toAdvancedSearchPage(){
    var searchVal = $('#searchContent').val();
    window.location.href='searchContent.html?searchContent='+encodeURI(encodeURI(searchVal)); // 在下载数据时,这个方法可以实现不刷新页面
}

//记录当前tab页
var currentNum = 'one';
//tab 栏点击方法
function tabClick(num) {
    if (num == currentNum){
        return
    }else{
        if (num =='one'){
            currentNum = 'one'
            $('.tab_one').css({'background-color':'rgb(0,101,105)'});
            $('.tab_two').css({'background-color':'#D3D3D3'})
            $('#contentFrame').attr('src','monitor.html')
        }
        if (num =='two'){
            currentNum = 'tow'
            $('.tab_two').css({'background-color':'rgb(0,101,105)'});
            $('.tab_one').css({'background-color':'#D3D3D3'})
            $('#contentFrame').attr('src','alarmHistory.html')
        }
    }
}


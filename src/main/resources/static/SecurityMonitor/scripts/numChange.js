(function ($) {
    $.fn.numberAnimate = function (data) {

        this.suffixs = {  '十':1,  '百':2,'千': 3,  '万':4,'十万':5,  '百万':6 };
        this.suffix = '万';

        this.htmlNum = 0;
        this.htmlContent = "";
        this.htmlNumDigit = 0;
        this.Num = data;

        this.suNum = Math.pow(10,this.suffixs[this.suffix]+1);
        if (data > (this.suNum - 1)) {
            this.htmlNum = parseInt(data / (this.suNum/10));
            this.htmlContent = this.htmlNum + this.suffix;
            this.htmlNumDigit = this.htmlNum.toString().length;
        } else {
            this.htmlNum = data;
            this.htmlContent = data;
            this.htmlNumDigit = this.htmlNum.toString().length;
        }
        this.fontsize=this.fontsize ||this.css('font-size');

        //执行动画
        this.runAnimate = function () {
            var i = 0;
            var time = 1000 / 100;///变化十次/秒
            var item = this;
            
            item.css('font-size', parseFloat(item.fontsize.replace("px", "")) * 1.2);

            var inter = setInterval(function () {
                i += 1;
                item.html(RandomNum(item.htmlNumDigit) + (item.Num >= item.suNum ? item.suffix : ""));
                if (i > time) {
                    item.html(item.htmlContent);
                    item.css('font-size', item.fontsize);
                    clearInterval(inter);
                }
                },
                100);
            setTimeout(function() {
                item.css('font-size', item.fontsize);
            },1100);
        }

        function RandomNum(digit) {
            var s = Math.pow(10, digit - 1);
            return parseInt(Math.random() * s * 9 + s, 10);
        }

        

        return this;
    }
})(jQuery);
var historyData = {
    baseUrl: 'http://127.0.0.1:8000/',
    tableData: [],
    pageSize: 10,
    sort: 0,/*时间排序标志位  0为倒序 1为正序*/

    /* 页面初始化 */
    init: function () {
        this.initTimepicker();
        var _this = this;
        $('#btn-search').click(function () {
            _this.requestData();
        });
        /* table不能反复销毁和重建，会影响性能，应该只初始化一次 */
        this.initBootstrapTable();
        /* 初始化完成后，开始执行业务流程，搜索数据 */
        this.requestData();
    },

    initTimepicker: function () {
        var date = new Date();
        for (var index = 1; index <= 2; index++) {
            $('#time' + index).datetimepicker({
                bootcssVer: 3,
                language: 'zh-CN',
                format: 'yyyy-mm-dd',
                weekStart: 0, //一周从哪一天开始
                todayHighlight: true, //如果为true, 高亮当前日期。
                minView: 2,
                clearBtn: true,
                autoclose: true,
                initialDate: date // 默认时间
            });
        }
    },

    initBootstrapTable: function () {
        var _this = this;
        var columns = [{
            field: 'sequence',
            title: '序号',
            width: '10%',
            align: 'center',
        }, {
            field: 'imageUrl',
            align: 'center',
            title: '告警图片',
            width: '10%',
            formatter: function (value, row, index) {
                var html = '<div class="div-news-button">' +
                    '<img src="' + value + '" width="100px" height="80px"/>'
                '</div>';
                return html;
            },
        }, {
            field: 'detectType',
            title: '告警类型',
            width: '20%',
            align: 'center',
        }, {
            field: 'detectContent',
            title: '告警内容',
            align: 'center',
            width: '20%'
        }, {
            field: 'deviceId',
            title: '摄像头编号',
            align: 'center',
            width: '10%',
        }, {
            field: 'updateTime',
            title: '告警时间',
            align: 'center',
            width: '20%',
        }, {
            field: 'publishInfo',
            title: '视频',
            align: 'center',
            width: '10%',
            formatter: function (value, row, index) {
                var html = '<div class="div-news-button">' +
                    '<button type="button" class="btn-daily">视频</button>'
                '</div>';
                return html;
            },
        }
        ];

        $('#table').bootstrapTable({
            data: this.tableData,
            showHeader: false,
            showLoading: false,
            queryParams: "postQueryParams",//自定义参数
            pageSize: this.pageSize,//每页大小
            pageList: [8, 16, 32, 64],//可以选择每页大小
            columns: columns,
            onClickCell: _this.onClickCellHandler.bind(_this)
        });
    },

    operateEvents: {},

    onClickCellHandler: function (field, value, row, $element) {
        if (field == 'imageUrl'){
            this.showImage(value);
        }
    },
    requestData: function () {
        var _this = this;
        var deviceId = $('#deviceId').val();
        var detectType = $('#detectType').val();
        var startTime = $('#time1').val();
        var endTime = $('#time2').val();
        var data = {
            start: 0,
            startTime: startTime,
            endTime: endTime,
            deviceId: deviceId,
            detectType: detectType,
            pageSize: 10
        };
        requestUtil.get("/smartsafe/edge/cloud/events", data, this.onSuccessHandler.bind(this), null);
    },

    /* 函数最好不要定义在另一个常调用的函数中，内存无法回收 */
    onSuccessHandler: function (response) {
        var data = response.data.data;
        var msg = response.data.msg;
        if (data != null) {
            if (msg == 'OK') {
                var array = data.data;
                this.parseData(array, 1);
                this.initPage(data.total);
            }
        }
    },

    parseData: function (array, page) {
        var tableDatas = [];
        for (var i = 0; i < array.length; i++) {
            var temp = array[i];
            var sequence = (page - 1) * this.pageSize + 1 + i;
            var viewData = {
                deviceId: temp.deviceId,
                deviceType: temp.deviceType,
                updateTime: temp.updateTime,
                sequence: sequence,
                imageUrl: temp.imageUrl
            };
            tableDatas.push(viewData);
        }
        $('#table').bootstrapTable('load', {'data': tableDatas});
    },

    initPage: function (total) {
        var _this = this;
        $("#myPage").sPage({
            page: 1,//当前页码，必填
            total: total,//数据总条数，必填
            pageSize: 10,//每页显示多少条数据，默认10条
            totalTxt: "共{total}条",//数据总条数文字描述，{total}为占位符，默认"共{total}条"
            showTotal: true,//是否显示总条数，默认关闭：false
            showSkip: true,//是否显示跳页，默认关闭：false
            showPN: true,//是否显示上下翻页，默认开启：true
            prevPage: "上一页",//上翻页文字描述，默认“上一页”
            nextPage: "下一页",//下翻页文字描述，默认“下一页”
            backFun: function (page) {
                //点击分页按钮回调函数，返回当前页码
                _this.toPage(page);
            }
        });
    },

    toPage: function (page) {
        var _this = this;
        var deviceId = $('#deviceId').val();
        var detectType = $('#detectType').val();
        var startTime = $('#time1').val();
        var endTime = $('#time2').val();

        $.ajax({
            type: 'get',
            url: _this.baseUrl + '/smartsafe/edge/cloud/events',
            data: {
                start: (page - 1) * _this.pageSize,
                startTime: startTime,
                endTime: endTime,
                deviceId: deviceId,
                detectType: detectType,
                pageSize: 10
            },
            success: function (data) {
                if (data != null) {
                    var array = data.data.data;
                    _this.parseData(array, page);
                }
            }
        });
    },
    showImage: function (source) {
        $("#ShowImage_Form").find("#img_show").html("<img src='" + source + "' style='width: 500px;margin:0 auto;margin-top: 200px;' class='carousel-inner img-responsive img-rounded' />");
        $("#ShowImage_Form").modal('show');
    }
};


(function ($) {
    'use strict';
 
    $.extend($.fn.bootstrapTable.defaults, {
        fixedColumns: false,
        fixedNumber: 1
    });
 
    var BootstrapTable = $.fn.bootstrapTable.Constructor,
        _initHeader = BootstrapTable.prototype.initHeader,
        _initBody = BootstrapTable.prototype.initBody,
        _initFooter = BootstrapTable.prototype.initFooter,
        _resetView = BootstrapTable.prototype.resetView;
 
    BootstrapTable.prototype.initFixedColumns = function () {
        this.$fixedHeader = $([
            '<div class="fixed-table-header-columns">',
            '<table>',
            '<thead></thead>',
            '</table>',
            '</div>'].join(''));
 
        this.timeoutHeaderColumns_ = 0;
        this.$fixedHeader.find('table').attr('class', this.$el.attr('class'));
        this.$fixedHeaderColumns = this.$fixedHeader.find('thead');
        this.$tableHeader.before(this.$fixedHeader);
 
        this.$fixedBody = $([
            '<div class="fixed-table-body-columns">',
            '<table>',
            '<tbody></tbody>',
            '</table>',
            '</div>'].join(''));
 
        this.timeoutBodyColumns_ = 0;
        this.$fixedBody.find('table').attr('class', this.$el.attr('class'));
        this.$fixedBodyColumns = this.$fixedBody.find('tbody');
        this.$tableBody.before(this.$fixedBody);
        
        this.$fixedFooter = $([
            '<div class="fixed-table-footer-columns">',
            '<table>',
            '<tfoot></tfoot>',
            '</table>',
            '</div>'].join(''));
        
        this.timeoutFooterColumns_ = 0;
        this.$fixedFooter.find('table').attr('class', this.$el.attr('class'));
        this.$fixedFooterColumns = this.$fixedFooter.find('tfoot');
        this.$tableFooter.before(this.$fixedFooter);
    };
 
    BootstrapTable.prototype.initHeader = function () {
        _initHeader.apply(this, Array.prototype.slice.apply(arguments));
 
        if (!this.options.fixedColumns) {
            return;
        }              	
 
        this.initFixedColumns();
 
        var that = this, $trs = this.$header.find('tr').clone();
        
        /****************固定列复选框事件****************/
        var $ths = $trs.find('th');      
        var headTh = $ths.eq(0);
        var input=headTh.find('input'); 
    	var inp=that.$header.find("th[data-field=" + 0 + "] input");
    	
    	input.click(function () {
    		inp.click();
        });
        /*********************************************************/
    	
        $trs.each(function () {
            $(this).find('th:gt(' + (that.options.fixedNumber - 1) + ')').remove();
        });
        this.$fixedHeaderColumns.html('').append($trs); 
    };
 
    BootstrapTable.prototype.initBody = function () {
        _initBody.apply(this, Array.prototype.slice.apply(arguments));
 
        if (!this.options.fixedColumns) {
            return;
        }
 
        var that = this,
            rowspan = 0;
 
        this.$fixedBodyColumns.html('');
        this.$body.find('> tr[data-index]').each(function () {
            var $tr = $(this).clone(),
                $tds = $tr.find('td');
 
            $tr.html('');
            /*******固定列操作事件转移及复选框事件*******/
            for (var i = 0; i < that.options.fixedNumber; i++) {
                var indexTd = i;
                var oldTd = $tds.eq(indexTd);
                var fixTd = oldTd.clone();
                var buttons = fixTd.find('a');
                
                //事件转移：冻结列里面的事件转移到实际按钮的事件
                buttons.each(function (key, item) {
                    $(item).click(function () {
                        that.$body.find("tr[data-index=" + $tr.attr('data-index') + "] td:eq(" + indexTd + ") a:eq(" + key + ")").click();
                    });
                });
                if(i==0){
                	var inputs=fixTd.find('input');
                	var index=inputs.data("index");
                	var inp=that.$body.find("tr[data-index=" + index + "] td:eq(" + 0 + ") input[data-index=" + index + "]");
                	
                	inputs.click(function () {
                		inp.click();
                    });               	
                }
                $tr.append(fixTd);
            }
            that.$fixedBodyColumns.append($tr);
            /********************************************************/
//            var end = that.options.fixedNumber;
//            if (rowspan > 0) {
//                --end;
//                --rowspan;
//            }
//            for (var i = 0; i < end; i++) {
//                $tr.append($tds.eq(i).clone());
//            }
//            that.$fixedBodyColumns.append($tr);
//            
//            if ($tds.eq(0).attr('rowspan')){
//            	rowspan = $tds.eq(0).attr('rowspan') - 1;
//            }
        });
    };
    
    BootstrapTable.prototype.initFooter = function () {
    	_initFooter.apply(this, Array.prototype.slice.apply(arguments));
 
        if (!this.options.fixedColumns) {
            return;
        }
        
        var that = this, $trs = this.$tableBody.find('table tfoot tr').clone();
 
        $trs.each(function () {
            $(this).find('th:gt(' + (that.options.fixedNumber - 1) + ')').remove();
        });
        this.$fixedFooterColumns.html('').append($trs); 
 
    };
 
    BootstrapTable.prototype.resetView = function () {
        _resetView.apply(this, Array.prototype.slice.apply(arguments));
 
        if (!this.options.fixedColumns) {
            return;
        }
 
        clearTimeout(this.timeoutHeaderColumns_);
        this.timeoutHeaderColumns_ = setTimeout($.proxy(this.fitHeaderColumns, this), this.$el.is(':hidden') ? 100 : 0);
 
        clearTimeout(this.timeoutBodyColumns_);
        this.timeoutBodyColumns_ = setTimeout($.proxy(this.fitBodyColumns, this), this.$el.is(':hidden') ? 100 : 0);
        
        clearTimeout(this.timeoutFooterColumns_);
        this.timeoutFooterColumns_ = setTimeout($.proxy(this.fitFooterColumns, this), this.$el.is(':hidden') ? 100 : 0);
    };
 
    BootstrapTable.prototype.fitHeaderColumns = function () {
        var that = this,
            visibleFields = this.getVisibleFields(),
            headerWidth = 0;
 
        this.$body.find('tr:first-child:not(.no-records-found) > *').each(function (i) {
            var $this = $(this),
                index = i;
 
            if (i >= that.options.fixedNumber) {
                return false;
            }
 
            if (that.options.detailView && !that.options.cardView) {
                index = i - 1;
            }
 
            that.$fixedHeader.find('th[data-field="' + visibleFields[index] + '"]')
                .find('.fht-cell').width($this.innerWidth());
            headerWidth += $this.outerWidth();
        });
        this.$fixedHeader.find('th').css('height', '44px');
        this.$fixedHeader.width(headerWidth + 1).show();
    };
 
    BootstrapTable.prototype.fitBodyColumns = function () {
        var that = this,
            top = -(parseInt(this.$el.css('margin-top')) - 2),
            height = this.$tableBody.find('table tbody').height();
        if (!this.$body.find('> tr[data-index]').length) {
            this.$fixedBody.hide();
            return;
        }
 
        if (!this.options.height) {
            top = this.$fixedHeader.height();
        }
 
        this.$fixedBody.css({
            width: this.$fixedHeader.width()-1,
            height: height,
            top: top
        }).show();
 
        this.$body.find('> tr').each(function (i) {
            //that.$fixedBody.find('tr:eq(' + i + ')').css('height','30px');
        });
 
        // events
        this.$tableBody.on('scroll', function () {
            that.$fixedBody.find('table').css('top', -$(this).scrollTop());
        });
        this.$body.find('> tr[data-index]').off('hover').hover(function () {
            var index = $(this).data('index');
            that.$fixedBody.find('tr[data-index="' + index + '"]').addClass('hover');
        }, function () {
            var index = $(this).data('index');
            that.$fixedBody.find('tr[data-index="' + index + '"]').removeClass('hover');
        });
        this.$fixedBody.find('tr[data-index]').off('hover').hover(function () {
            var index = $(this).data('index');
            that.$body.find('tr[data-index="' + index + '"]').addClass('hover');
        }, function () {
            var index = $(this).data('index');
            that.$body.find('> tr[data-index="' + index + '"]').removeClass('hover');
        });
    };
    
    BootstrapTable.prototype.fitFooterColumns = function () {
        var that = this,
        	top = -(parseInt(this.$el.css('margin-top')) - 2),
        	visibleFields = this.getVisibleFields(),
        	height = this.$tableBody.find('table tfoot').height(),
            footerWidth = 0;
 
        this.$body.find('tr:first-child:not(.no-records-found) > *').each(function (i) {
            var $this = $(this),
                index = i;
 
            if (i >= that.options.fixedNumber) {
                return false;
            }
 
            if (that.options.detailView && !that.options.cardView) {
                index = i - 1;
            }
 
            that.$fixedHeader.find('th[data-field="' + visibleFields[index] + '"]')
                .find('.fht-cell').width($this.innerWidth());
            footerWidth += $this.outerWidth();
        });
        
        if (!this.options.height) {
            top = this.$fixedHeader.height() + this.$tableBody.find('table tbody').height();
        }
        
        this.$fixedFooter.css({
            width: footerWidth,
            height : height,
            top: top - 1
        }).show();
    };
 
})(jQuery);
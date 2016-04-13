/* 
    horizontalWaterfall.js
    图片横向瀑布流,基于zepto
    @params (id,ops)
    @容器 #wrap 
 */
;(function(factory){
    'use strict';

    if (typeof define === "function") {
        define(factory);
    } else { 
        factory(null, {}, {});
    }
}(function(require,exports,module){
    'use strict'; 

    function horizontalWaterfall(wrap,ops) {
        return new horizontalWaterfallCreator.prototype.init(wrap,ops);
    }
    function horizontalWaterfallCreator(ops){}

    //默认参数
    horizontalWaterfallCreator.defaults = {
        defaultH: 130, //预期高度，这个值决定了一行最多可以排几个
        itemClass:'J_itemImg',
        columnMargin: 4, //item左右距离
        data:[] //传入的图片数组
    }

    horizontalWaterfallCreator.prototype = {
        init:function(wrap,ops){
            var DEF = this.DEF = $.extend(true, horizontalWaterfallCreator.defaults, ops);
            this.$wrap      = $(wrap);
            this.winW       = $(window).width();
            this.totalW     = this.$wrap.width();
            this.winRatio   = this.winW/320;
            this.margin     = Math.ceil(this.winRatio*DEF.columnMargin);//等比放大距离
            
            var rows = this.createRows(DEF.data);
            this.render(rows);
        },
        render:function(rows){
            var htmls =[],
                DEF   = this.DEF,
                self  = this;

            $.each(rows,function(index,arr){
                var rowW=0;
                for(var i=0;i<arr.length;i++){
                    var img = data[arr[i]];
                    rowW = rowW+Math.floor(img.w/img.h*DEF.defaultH);
                }
                var minusW   = self.totalW - self.margin*arr.length,
                    currentW = 0, //用于存储累加的值来计算单行最后一张宽度,去除小数点误差
                    singleH  = Math.floor(minusW * DEF.defaultH/rowW);
                console.log(minusW,singleH)
                arr.map(function(j,n){
                    var singleW = Math.floor( data[j].w/data[j].h *singleH);

                    if(n==arr.length-1){
                        singleW = minusW -currentW;
                    }
                    currentW+=singleW;
                    htmls.push('<div class="item" style="width:'+singleW+'px;height:'+singleH+'px;"><img class="item-img '+DEF.itemClass+'" width="'+singleW+'" height="'+singleH+'" src="'+DEF.data[j].url+'"></div>')
                })
            })
            this.$wrap.append(htmls.join(''));
            this.animated();
        },
        createRows: function(data){
            var Rows           = [],//二维数组 存储照片行数和每行张数
                singleRowItems = [],//每行存储的item
                usedW          = 0;
            for(var i=0;i<data.length;i++){
                var img = data[i];
                var w = Math.floor(img.w/img.h*this.DEF.defaultH);
                usedW +=w+this.margin;

                if(this.totalW>=usedW){
                    singleRowItems.push(i);
                    if(i==data.length-1){
                        Rows.push(singleRowItems)
                    }
                    continue;
                }else{
                    if(singleRowItems.length){
                        i--;
                        Rows.push(singleRowItems);
                    }else{
                        Rows.push([i]);//单行只放得下一张的情况
                    }
                    usedW =0;
                    singleRowItems =[];
                }
            }
            return Rows
        },
        animated:function(){
            var DEF   = this.DEF,
                $wrap = this.$wrap;
            $wrap.find('.'+DEF.itemClass).on('load',function(){
                $(this).css({
                    opacity:1,
                    '-webkit-transform':'scale(1)',
                    'box-shadow':'0 0 0 rgba(0,0,0,.5)'
                })
            })
        }

    }
    horizontalWaterfallCreator.prototype.init.prototype = horizontalWaterfallCreator.prototype;
    module.exports = window.horizontalWaterfall = horizontalWaterfall;
})) ;

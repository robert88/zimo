// ==S index.html topic zl 2017/02/22

window.console = window.console || {log: function () {}};
/**
 * 外部调用
 * */
var CAROU = function (options) {

    //默认参数
    var defaluts = {
        oCon: '.J-carousel-wrap',//最外层div
        ulWrap: '.J-carousel-ul-wrap',//最ul包裹
        oul: '.J-carousel-ul',//ul
        oList: '.J-carousel-li',//li
        oPrev: '.J-carousel-prev',//前按钮
        oNext: '.J-carousel-next',//后按钮
        oConPoint: '.J-carousel-oconpoint',//数字
        oPoint: '.J-carousel-oconpoint>span',//点点
        showNum: 1,//切换的数量
        showWidth:null,//不按子类的数量来切换，按指定宽度来切换
        showHeight:null,
        topic_index:0,//当前播放index
        filterSize:null,//播放切换的尺寸
         dir:"horizontal"//垂直还是水平
    };

    $(options && options.oCon || defaluts.oCon).each(function () {

        //防止重复初始化
        if ($(this).data("init")) {
            return;
        }
        new Carousel($(this), options, defaluts);
        $(this).data("init", true);
    })

}
/**
 * 构造器
 * */
var Carousel = function ($target, options, defaluts) {

    if ($target.is(":hidden")) {
        console.log("target is hidden!");
    }

    var _this = this;

    _this.initOption($target, options, defaluts);

    _this.init();
    _this.initEvent();

    $target.on("resize", function () {
        _this.init("resize")
    });
    Carousel.prototype.target.push($target);
};
/**
 * 初始化参数
 * */
Carousel.prototype.initOption = function ($target, options, defaluts) {

    this.opts = $.extend({}, defaluts, options);

    //外部对象
    this.oCon = $target;

    //ulwrap带overflow:hidden;的容器;
    this.ulWrap = this.oCon.find(this.opts.ulWrap);
    if (this.ulWrap.length == 0) {
        this.ulWrap = this.oCon;
    }

    //当前切换值
    this.topic_per_index = this.topic_index = this.opts.topic_index || 0;
    this.li_point = 0;

    //list区
    this.oul = this.oCon.find(this.opts.oul);
    this.oList = this.oCon.find(this.opts.oList);

    //辅助切换
    this.oPrev = this.oCon.find(this.opts.oPrev);
    this.oNext = this.oCon.find(this.opts.oNext);
    this.oConPoint = this.oCon.find(this.opts.oConPoint);
    this.oPoint = this.oCon.find(this.opts.oPoint);

}

/**
 * 初始化
 * */
Carousel.prototype.init = function (type) {
    if (typeof this.opts.initBefore == "function") {
        this.opts.initBefore.call(this, this)
    }
    if (this.opts.dir == "vertical") {
        this.initVertical(type);
    } else {
        this.initHorizontal(type);
    }
}

/**
 * 获取切换的宽度
 * */
Carousel.prototype.getHorizontalSize = function () {

    if(typeof this.opts.filterSize=="function"){
        return this.opts.filterSize(this);
    }

    // 初始化
    var winW = $(window).width();
    var li_w = 0;
    // 根据不同尺寸显示不同数量
    if (this.opts.showNum == 4) {
        if (winW > 1366) {
            li_w = this.con_w / 4;
        } else if (winW > 1024) {
            li_w = this.con_w / 3;
        } else if (winW > 560) {
            li_w = this.con_w / 2;
        } else {
            li_w = this.con_w / 1;
        }
    };
    if (this.opts.showNum == 3) {
        if (winW > 1300) {
            li_w = this.con_w / 3;
        } else if (winW > 750) {
            li_w = this.con_w / 2;
        } else {
            li_w = this.con_w / 1;
        }
    }
    ;
    if (this.opts.showNum == 2) {
        if (winW > 1024) {
            li_w = this.con_w / 2;
        } else {
            li_w = this.con_w / 1;
        }
    }
    ;
    if (this.opts.showNum == 1) {
        li_w = this.con_w / 1;
    }
    ;
    return li_w;
}
/**
 *初始化宽度
 * */
Carousel.prototype.initWidth =function(){
    var _this = this;
    var li_length = this.oList.length;
    var dw,itemw;
    this.con_w = this.ulWrap.width();

    if(this.opts.showWidth){
        this.ulw = 0;
        this.oList.each(function(){
            _this.ulw += $(this).width();
        });
        //保证切换的长度要小于可见容器的大小
        dw = this.con_w - this.opts.showWidth;
        itemw = dw>=0?this.opts.showWidth:this.con_w;
        dw = dw>=0?dw:0;
        this.li_point = Math.ceil((this.ulw-dw) / itemw);
        this.animateWidth =  this.opts.showWidth;
    }else{
        this.liw  = this.getHorizontalSize();
        //获取点数量并添加到页面
        this.li_point = Math.ceil(li_length / (this.con_w / this.liw ));
        this.ulw = Math.ceil(this.liw * li_length);
        this.oList.width(this.liw);
        this.animateWidth =  this.con_w;
    }

    this.maxAnimateWidth  = this.ulw - this.con_w;
    this.maxAnimateWidth = this.maxAnimateWidth<0?0:this.maxAnimateWidth;

    this.oul.width(this.ulw);
}
/**
 *初始化水平轮播
 * */
Carousel.prototype.initHorizontal = function (type) {

    if(type=="resize"){
        if(this.ulWrap.width()==this.con_w){
            return;
        }
    }

    this.initWidth();

    this.initPoint();

    this.initBtn();

    //加了class影响到容器的宽度
    this.initWidth();

    //resize的时候不会改变当前的状态
    this.setMargin("css",this.topic_index);

    if (typeof this.opts.initCallback == "function") {
        this.opts.initCallback.call(this, this)
    }
}
/**
 *设置margin，type=animate 动画方式
 * */
Carousel.prototype.setMargin=function(type,num){
    var animateSize
    if(this.opts.dir=="vertical"){
        animateSize = this.animateHeight*num;
        this.oul.stop()[type]({'marginTop': -(animateSize>this.maxAnimateHeight?this.maxAnimateHeight:animateSize)});
    }else{
        animateSize = this.animateWidth*num;
        this.oul.stop()[type]({'marginLeft': -(animateSize>this.maxAnimateWidth?this.maxAnimateWidth:animateSize)});
    }
}
/**
 *初始化高度
 * */
Carousel.prototype.initHeight = function () {
    var _this = this;
    var li_length = this.oList.length;
    this.con_h = this.ulWrap.height();
    var dh,itemh;

    if(this.opts.showHeight){
        this.ulh = 0;
        this.oList.each(function(){
            _this.ulh += $(this).height();
        });
        //保证切换的长度要小于可见容器的大小
        dh = this.con_h - this.opts.showHeight;
        itemh = dh>=0?this.opts.showHeight:this.con_h;
        dh = dh>=0?dh:0;
        this.li_point = Math.ceil((this.ulh-dh) / itemh);
        this.animateHeight = this.opts.showHeight;
    }else{
        this.lih  = this.con_h / this.opts.showNum;
        //获取点数量并添加到页面
        this.li_point = Math.ceil(li_length / (this.con_h /  this.lih  ));
        this.oList.height(this.lih );
        this.ulh = this.lih*li_length;
        this.animateHeight =  this.con_h;
    }
    this.maxAnimateHeight = this.ulh - this.con_h;
    this.maxAnimateHeight =this.maxAnimateHeight<0?0:this.maxAnimateHeight;
    this.oul.height(this.ulh);
}
/**
 *垂直
 * */
Carousel.prototype.initVertical = function (type) {

    if(type=="resize"){
        if(this.ulWrap.height()==this.con_h){
            return;
        }
    }

    this.initHeight();

    this.initPoint();

    this.initBtn();

    this.initHeight();

    this.oul.css('marginTop', this.con_h * this.topic_index);

    if (typeof this.opts.initCallback == "function") {
        this.opts.initCallback.call(this, this)
    }
}
/**
 *初始化按钮
 * */
Carousel.prototype.initBtn = function () {
    this.oPrev.removeClass('notClick');
    this.oNext.removeClass('notClick');
    if (this.li_point <= 1) {
        this.oPrev.hide();
        this.oNext.hide();
    }else{
        if(this.topic_index<=0){
            this.oPrev.addClass('notClick');
        }else if(this.topic_index>=this.li_point-1){
            this.oNext.addClass('notClick');
        }
    }
}
/**
 *初始化水平轮播点点
 * */
Carousel.prototype.initPoint = function () {
    var point_span = '';
    if (this.li_point <= 1) {
        this.oPoint.hide();
        this.oCon.addClass("oneCarousel");
    } else {
        this.oCon.removeClass("oneCarousel");
        var len = this.li_point
        for (var i = 0; i < len; i++) {
            point_span += '<span><em></em></span>';
        }
        this.oConPoint.empty().append(point_span);
        this.oPoint = this.oCon.find(this.opts.oPoint);
    }
    // 获取点的对象
    this.oPoint.removeClass('hover').eq(this.topic_index).addClass('hover');
}
/**
 *初始化切换动画
 * */
Carousel.prototype.carouselAnimate = function (num) {
    var _this = this;
    this.oPrev.removeClass('notClick');
    this.oNext.removeClass('notClick');
    if (num >= this.li_point - 1) {
        num = this.li_point - 1;
        this.oNext.addClass('notClick');
    } else if (num <= 0) {
        num = 0;
        this.oPrev.addClass('notClick');
    }
    //切换的时候点击两次topic_index实际已经改变，应放到return的前面
    this.topic_index = num;
    if(num==this.topic_per_index&&this.oul.is(":animated")){
        return;
    }
    //动画
    _this.setMargin("animate",num);
    _this.topic_per_index = num;
    this.oPoint.removeClass('hover').eq(num).addClass('hover');

}

/**
 *选择文字操作
 * */
var documentSelectEvent =document.onselectstart;
function stopSelect(){
    document.onselectstart=function () {
        return false
    }
}
function resetSelect(){
    document.onselectstart= documentSelectEvent;
}
/**
 *初始化滑动切换
 * */
Carousel.prototype.initMobileEvent = function () {
    var _this = this;
    var moveLeft, moveTop, $videoPlay,isLockA, checkDir, startDir,$downTarget;
    var isPressed,downX,downY,marginLeft,marginTop,isMobile,turnHorizontal,turnVertical;
    if ((navigator.userAgent.match(/(iPhone|iPod|Android|ios|SymbianOS)/i))){
        isMobile = true;
    }
    function clearOption(){
        moveLeft = 0;
        moveTop = 0;

        $videoPlay = null;
        $downTarget = null;


        checkDir = false;
        startDir = "";

        _this.isPressed = isPressed = false;
        resetSelect();
        turnHorizontal = false;
        turnVertical = false;

    }


    this.oCon.on("click", function (e) {

    }).on("touchstart mousedown", function (e) {

        //防止某些机型抛出错误事件
        if (isMobile && e.type == "mousedown") {
            return;
        }

        if (e.originalEvent.touches) {
            e = e.originalEvent.touches[0];
        }

        clearOption();

        _this.isPressed = isPressed  = true;

        Carousel.prototype.activeCarousel = _this;

        downX = e.pageX;
        downY = e.pageY;

        $(".J-dragElement").removeClass("J-dragElement");
        isLockA = false;
        $downTarget = $(e.target);

        if ($(e.target).hasClass("J-videoPlay")) {
            $videoPlay = $(e.target);
        } else {
            $videoPlay = $(e.target).parents(_this.opts.oList)
        }
        if (!$videoPlay.hasClass("J-videoPlay")) {
            $videoPlay = $videoPlay.find(".J-videoPlay")
        }
        marginLeft = parseFloat(_this.oul.css("marginLeft"), 10) || 0;
        marginTop = parseFloat(_this.oul.css("marginTop"), 10) || 0;

    }).on("touchmove mousemove", function (e) {

        if (isPressed) {
            if (isMobile && e.type == "mousemove") {
                return;
            }
            if (e.originalEvent.touches) {
                e = e.originalEvent.touches[0];
            }

            moveLeft = e.pageX - downX;
            moveTop = e.pageY - downY;

            if (!checkDir) {
                var angleValue = Math.abs(moveLeft/moveTop) ;//介意30度45度之间一个度数
                var angleValue2 = Math.abs(moveTop/moveLeft) ;//介意45度60度之间一个度数
                if (angleValue> 1.5 && moveLeft > 0) {// right
                    startDir = 'right';
                }
                else if (angleValue> 1.5 && moveLeft < 0) {// left
                    startDir = 'left';
                }
                else if (angleValue2> 1.5 && moveTop > 0) {// down
                    startDir = 'down';
                }
                else if (angleValue2>1.5 && moveTop < 0) {// up
                    startDir = 'up';
                }else{
                    //四个斜角
                }

                turnHorizontal = (_this.opts.dir!="vertical"&&(startDir == 'right' || startDir == 'left'));
                turnVertical = (_this.opts.dir=="vertical"&&(startDir == 'down' || startDir == 'up'));

                if (turnHorizontal || turnVertical){
                    checkDir = true;
                    stopSelect();
                }

            }

            if (turnHorizontal) {
                _this.oul.css("marginLeft", marginLeft + moveLeft);
                isLockA = true;
                return false;
            }
            if (turnVertical) {
                _this.oul.css("marginTop", marginTop + moveTop);
                isLockA = true;
                return false;
            }

        }
    }).on("touchend mouseup", function (e) {
        handlerUp();
    });

    /**
     *初始化按钮事件
     * */
    function handlerUp(){
        if (isPressed ) {
            //懒加载
            if (!_this.oul.data("img-appear")) {
                _this.oul.find("img").trigger("appear");
            }
            _this.oul.data("img-appear", true);

            if((turnHorizontal && moveLeft < -20) || (turnVertical&&moveTop <-20)) {
                _this.topic_index++;

                _this.carouselAnimate(_this.topic_index);
            }else if((turnHorizontal&&moveLeft >20) || (turnVertical&&moveTop >20)) {
                _this.topic_index--;
                _this.carouselAnimate(_this.topic_index);
            }else{
                //还原原来的位置
                if ( (turnHorizontal&&moveLeft!=0) || (turnVertical&&moveTop!=0)) {
                    _this.carouselAnimate(_this.topic_index);
                }
            }
            //拖动不是点击
            if((Math.abs(moveLeft) > 20) || ( Math.abs(moveTop) > 20)) {
                if ($videoPlay.length) {
                    $videoPlay.data("lockplay", true);
                }
                //表示点击的对象处于轮播中
                $downTarget.addClass("J-dragElement")
                clearOption();
                return false;
            }
            clearOption();
        }
    }

    this.oCon.on("click", "a", function () {
        if (isLockA) {
            return false;
        }
    }).on("clearCarousel",function () {
        handlerUp();
    })

}

/**
 *初始化按钮事件
 * */
Carousel.prototype.initEvent = function () {

    var _this = this;
    if ($(window).width() > 750 || this.opts.dir=="vertical") {
        //如果用click的话 两次点击时间差会大于100，这样会导致触发两次动画
        this.oNext.on('mousedown touchstart', function () {
            _this.topic_index++;
            _this.carouselAnimate(_this.topic_index);
            return false;
        })

        this.oPrev.on('mousedown touchstart', function () {
            _this.topic_index--;
            _this.carouselAnimate(_this.topic_index);
            return false;
        })
        this.oConPoint.on('click', 'span', function () {
            _this.topic_index = $(this).index()||0;
            _this.carouselAnimate(_this.topic_index);
            return false;
        })

    }

    if (!navigator.userAgent.match('MSIE')) {
        this.initMobileEvent()
    }

}
/**
 * 性能优化，resize事件
 * */
;(function () {

        //只针对宽
        var  timer,perWidth,$win = $(window);
        $win.on("resize.carousel",function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
            if($win.width()!=perWidth){
                var target = Carousel.prototype.target;
                for(var i=0;i<target.length;i++){
                    target[i].trigger("resize");
                }
            }
        },200)
    });

    Carousel.prototype.target = [];
    Carousel.prototype.activeCarousel = null;
    $(document).on("touchend mouseup", function (e) {
        var carousel = Carousel.prototype.activeCarousel;
        //如果触发
        if(carousel&&carousel.isPressed){
            carousel.oCon.trigger("clearCarousel");
            Carousel.prototype.activeCarousel = null;
        }
    });
})()


    

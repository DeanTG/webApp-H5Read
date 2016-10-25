(function () {
    // 闭包封装localstorage方法
    var H5Storage = (function (key, val) {
        var prefix = 'h5Reader_';
        var getStorage = function (key) {
            return localStorage.getItem(prefix + key);
        };
        var setStorage = function (key,val) {
            return localStorage.setItem(prefix + key, val);
        };
        return {
            getStorage: getStorage,
            setStorage: setStorage
        };
    })();

    var body = $('body'),
        topNav = $('.topNav'),
        bottomNav = $('.bottomNav'),
        win = $(window),
        controls = $('.control'),
        font_control = $('#font_control'),
        content = $('#content'),
        content_font = $('#content p'),
        timeSwitch = $('#timeSwitch'),
        colorBtn = $('.color-btn'),
        fontSize = H5Storage.getStorage('fontSize') ? H5Storage.getStorage('fontSize') : 14,
        initialBg = H5Storage.getStorage('bg') ? H5Storage.getStorage('bg') : "#e9dfc7",
        bgIndex = H5Storage.getStorage('index') ? H5Storage.getStorage('index') : 0,
        switchState = H5Storage.getStorage('state') ? H5Storage.getStorage('state') : "白天";

    function main() {
        // 整个项目的入口函数
        readerInitial();
        eventHandle();
    }
    function readModel() {
        // 实现数据交互
    }
    function readerInitial() {
        // 渲染基本的ui结构
        fontSize = parseInt(fontSize);
        content_font.css('fontSize',fontSize);
        body.css('background-color', initialBg);
        colorBtn.removeClass('current').eq(bgIndex).addClass('current');
        timeSwitch.text(switchState);
    }
    function eventHandle() {
        // 交互事件绑定
            // 唤起边栏
        $('#action_mid').on('touchend', function() {
            if (topNav.css('display') == "block") {
                topNav.hide();
                bottomNav.hide();
            }else{
                topNav.show();
                bottomNav.show();
            }
        });
        win.on('scroll', function () {
            topNav.hide();
            bottomNav.hide();
            controls.hide();
            font_control.removeClass('current');
        });
        // 唤起字体控制
        font_control.on('touchend', function(){
            if ($(this).hasClass('current')) {
                $(this).removeClass('current');
                controls.hide();
            }else{
                $(this).addClass('current');
                controls.show();
            }
        });
        // 字体大小
        $('#large_font').on('touchend', function(){
            fontSize += 1;
            if (fontSize > 20) {
                return;
            }
            content_font.css('fontSize',fontSize);
            H5Storage.setStorage('fontSize', fontSize);
        });
        $('#small_font').on('touchend', function(){
            fontSize -= 1;
            if (fontSize < 12) {
                return;
            }
            content_font.css('fontSize',fontSize);
            H5Storage.setStorage('fontSize', fontSize);
        });
        // 背景色
        colorBtn.on('touchend', function(){
            bgIndex = $(this).index() - 1;
            initialBg = $(this).css('background-color');
            colorBtn.removeClass('current');
            $(this).addClass('current');
            body.css('backgroundColor', initialBg);
            H5Storage.setStorage('bg', initialBg);
            H5Storage.setStorage('index', bgIndex);
        });
        // 夜晚模式
        timeSwitch.on('touchend', function(){
            if ($(this).hasClass('day')) {
                initialBg = '#273644';
                switchState = '夜间';
                $(this).removeClass('day').text(switchState);
                body.css('backgroundColor', initialBg);
            }else{
                initialBg = '#fff';
                switchState = '白天';
                $(this).addClass('day').text(switchState);
                body.css('backgroundColor', initialBg);
            }
            H5Storage.setStorage('bg', initialBg);
            H5Storage.setStorage('state', switchState);
        });
    }

    main();

})();
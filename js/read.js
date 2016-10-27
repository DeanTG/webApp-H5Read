(function () {
    // 闭包封装localstorage方法
    var Util = (function (key, val) {
        var prefix = 'h5Reader_';
        var getStorage = function (key) {
            return localStorage.getItem(prefix + key);
        };
        var setStorage = function (key,val) {
            return localStorage.setItem(prefix + key, val);
        };
        var getJsonData = function (url, callback) {
            return $.jsonp({ //jsonp插件方法
                url: url,
                cache: true,
                callback: 'duokan_fiction_chapter',
                success: function(result){
                    var data = $.base64.decode(result); //返回的result需要decode为json格式数据
                    var json = decodeURIComponent(escape(data)); //json格式数据escape，decodeURIComponent解码
                    callback(json); 
                }
            });
        };
        return {
            getJsonData: getJsonData,
            getStorage: getStorage,
            setStorage: setStorage
        };
    })();

    var readmodel,
        readData,
        body = $('body'),
        topNav = $('.topNav'),
        bottomNav = $('.bottomNav'),
        win = $(window),
        controls = $('.control'),
        font_control = $('#font_control'),
        content = $('#content'),
        content_font = $('#content p'),
        timeSwitch = $('#timeSwitch'),
        colorBtn = $('.color-btn'),
        fontSize = Util.getStorage('fontSize') ? Util.getStorage('fontSize') : 14,
        initialBg = Util.getStorage('bg') ? Util.getStorage('bg') : "#e9dfc7",
        bgIndex = Util.getStorage('index') ? Util.getStorage('index') : 0,
        switchState = Util.getStorage('state') ? Util.getStorage('state') : "白天";

    function main() {
        // 整个项目的入口函数
        readmodel = readModel();
        readData = dataController(content);
        readmodel.init(function(data){
            readData(data);
        });
        readerInitial();
        eventHandle();
    }
    function readModel() {
        // 获取数据
        var chapter_ID,
            chapterTotal;
        var init = function(UIcallback){
            chapter_ID = parseInt(chapter_ID, 10);
            getChapterInfo(function(){
                getChapterContent(chapter_ID, function(data){
                    UIcallback && UIcallback(data);
                });
            });
        };
        var getChapterInfo = function (callback) {
            $.getJSON('http://localhost/server/webApp-H5Read/data/chapter.json', function(data) {
                chapter_ID = Util.getStorage('chapter_ID') ? Util.getStorage('chapter_ID') : data.chapters[1].chapter_id; //获取章节id （这里的章节id是随便取的）
                chapterTotal = data.chapters.length;
                callback && callback();
            });
        };
        var getChapterContent = function (chapter_ID,callback) {
            $.getJSON('http://localhost/server/webApp-H5Read/data/data'+chapter_ID+'.json', function(data) {
                var url;
                if (data.result === 0) {
                    url = data.jsonp;
                    Util.getJsonData(url, function(data){
                        callback && callback(data);
                    });
                }
            });
        };
        var prevChapter = function (callback){
            chapter_ID = parseInt(chapter_ID,10);
            if (chapter_ID == 1) {
                return;
            }
            chapter_ID -= 1;
            getChapterContent(chapter_ID, callback);
            Util.setStorage('chapter_ID', chapter_ID);
        };
        var nextChapter = function (callback){
            chapter_ID = parseInt(chapter_ID,10);
            if (chapter_ID == chapterTotal) {
                return;
            }
            chapter_ID += 1;
            getChapterContent(chapter_ID, callback);
            Util.setStorage('chapter_ID', chapter_ID);
        };
        return{
            init: init,
            prevChapter: prevChapter,
            nextChapter: nextChapter
        };
    }
    function dataController(dataContainer){
        //数据交互
        function parseChapterData(jsonData){
            var jsonObj = JSON.parse(jsonData);
            var html = '<h3 id="title">'+jsonObj.t+'</h3>';
            for (var i = 0; i < jsonObj.p.length; i++) {
                html+= '<p>'+jsonObj.p[i]+'</p>';
            }
            return html;
        }
        return function(data){
            dataContainer.html(parseChapterData(data));
        };
    }
    function readerInitial() {
        // 渲染基本的ui结构
        fontSize = parseInt(fontSize);
        content.css('fontSize',fontSize);
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
            content.css('fontSize',fontSize);
            Util.setStorage('fontSize', fontSize);
        });
        $('#small_font').on('touchend', function(){
            fontSize -= 1;
            if (fontSize < 12) {
                return;
            }
            content.css('fontSize',fontSize);
            Util.setStorage('fontSize', fontSize);
        });
        // 背景色
        colorBtn.on('touchend', function(){
            bgIndex = $(this).index() - 1;
            initialBg = $(this).css('background-color');
            colorBtn.removeClass('current');
            $(this).addClass('current');
            body.css('backgroundColor', initialBg);
            Util.setStorage('bg', initialBg);
            Util.setStorage('index', bgIndex);
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
            Util.setStorage('bg', initialBg);
            Util.setStorage('state', switchState);
        });
        //上下翻页
        $('#prev').on('touchend', function(){
            readmodel.prevChapter(function(data){
                readData(data);
            });
        });
        $('#next').on('touchend', function(){
            readmodel.nextChapter(function(data){
                readData(data);
            });
        });
    }

    main();

})();
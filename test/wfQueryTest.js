require(['../wfQuery'], function ($) {
    var search = 'a=1&b=2&c=3&c=4';
    var serializeArray = [
        {name:'a',value:'1'},
        {name:'b',value:'2'},
        {name:'c',value:'3'},
        {name:'c',value:'4'},
    ];
    var dataObj = {
        a: '1',
        b: '2',
        c: ['3','4']
    };

    QUnit.module('原型测试');
    QUnit.test('init', function (assert) {
        assert.ok( $.fn instanceof Array );
    });

    QUnit.module('选择器');
    QUnit.test('query', function (assert) {
        assert.ok( $('#main').length === 1 );
        assert.ok( $('#main p').length === 3 );
        assert.ok( $('#main').find('p').length === 3 );
        assert.ok( $('#main > p').length === 2 );
        assert.ok( $('#main > *').first().text() === 'title', $('#main > *').first()[0].outerHTML);
        assert.ok( $('#main > *').eq(1).text() === 'p1', $('#main > *').eq(1).text());
        assert.ok( $('#p2').index() === 2, $('#p2').index());
    });

    QUnit.module('关联选择');
    QUnit.test('query+', function (assert) {
        assert.ok( $('#main').children().length === 5 );
        assert.ok( $('#main').parent()[0] === document.body );
        assert.ok( $('#p2').prev().text() === 'p1' );
        assert.ok( $('#p3').parents('div').length === 2 );
        assert.ok( $('#p3').parents('#main').length === 1 );
    });

    QUnit.module('工具测试');
    QUnit.test('util', function (assert) {
        var base = {a:1,b:[1,2,3],d:{d1:1,d2:2}};
        
        var result1 = $.extend( true, base, {b:[2,5]}, {c:3}, {c:4,d:{d3:3}}, {c:6,a:7} );
        assert.ok( base === result1, 'base === extend()' );
        assert.ok( result1.b.join(',') === '2,5,3', 'clone in deep: '+JSON.stringify(result1) );

        var result2 = $.extend( base, {b:2}, {c:3}, {c:4,d:5}, {c:6,a:7} );
        assert.ok( result2.d === 5, 'clone simple: ' + JSON.stringify(result2) );

        assert.ok( $.param(serializeArray) === search, $.param(serializeArray) );
        assert.ok( $.param(dataObj) === search, $.param(dataObj) );
        assert.ok( $.obj2array(dataObj)[2].name === serializeArray[2].name, JSON.stringify($.obj2array(dataObj)) );
        assert.ok( $.array2obj(serializeArray).c.join(',') === dataObj.c.join(','), JSON.stringify($.array2obj(serializeArray)) );
        assert.ok( $('#myForm').serializeArray()[2].name === serializeArray[2].name, JSON.stringify($('#myForm').serializeArray()) );
    });

    QUnit.module('属性和数据绑定');
    QUnit.test('attr', function (assert) {
        assert.ok( $('#myForm').attr('method') === 'post' );
        $('#myForm').attr('enctype','multipart/form-data');
        assert.ok( $('#myForm').attr('enctype') === 'multipart/form-data' );
        // data 测试
        assert.ok( $('#myForm').data('init') === true );
        assert.ok( $('#myForm').data('valid').required === true, JSON.stringify($('#myForm').data('valid')) );
        assert.ok( $('#myForm').data().init === true, JSON.stringify($('#myForm').data()) );
    });

    QUnit.module('CSS测试');
    QUnit.test('css', function (assert) {
        $('#main h2').css({
            transition: 'line-height 2s ease-out'
        }).css({
            lineHeight: '100px'
        });
        assert.ok( $('#main h2').css('lineHeight') === 30, $('#main h2').css('lineHeight') );
        setTimeout(function(){
            assert.ok( $('#main h2').css('lineHeight') === 100, $('#main h2').css('lineHeight') );
            $('#main h2').css({
                lineHeight: 30
            });
        },2100);
    });

    QUnit.module('事件测试');
    QUnit.test('event', function (assert) {
        var i = 0;
        $('#main p').on('click', function(e){
            i++;
        }).trigger('click');
        assert.ok( i === $('#main p').length, i );

        $('#main p').first().trigger('click').trigger('click').trigger('click');
        assert.ok( i === $('#main p').length + 3, 'plus trigger' );
        $('#main p').off('click');
        $('#main p').trigger('click').trigger('click').trigger('click');
        assert.ok( i === $('#main p').length + 3, 'off click' );
        
    });

    QUnit.module('Ajax');
    QUnit.test('ajax', function (assert) {
        $.ajax({
            url: 'data/data.json',
            data: dataObj,
            dataType: "text",
            success: function(text){
                assert.ok( text === '{"a":"1","b":"2","c":["3","4"]}' );
            },
            error: function(e){
                assert.ok( true, 'error:' )
            }
        });
        $.ajax({
            url: 'data/data.json',
            async: false,
            data: dataObj,
            dataType: "json",
            success: function(json){
                assert.ok( json.a === $('[name=a]').val(), 'async:false' );
            }
        });

        $.post('data/data.json',dataObj,function(json){
            assert.ok( json.a === dataObj.a, 'post ok!');
        },'json');

        $.jsonp('data/jsonp.js',dataObj,function(json){
            assert.ok( json.a === dataObj.a, 'jsonp ok!');
        });

    });

    $('#myForm').on('submit', function(e){
        e.preventDefault();
    });

    QUnit.load();

});


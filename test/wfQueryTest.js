require(["../js/wfQuery"], function ($) {
    var search = "a=1&b=2&c=3&c=4";
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


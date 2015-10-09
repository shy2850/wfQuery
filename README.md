wfQuery
=======

like jQuery but just for HTML5 or 

依赖: [f2e-server](https://github.com/shy2850/node-server) 开发、运行、测试和打包。

DEMO: [http://shy2850.github.io/wfQuery/](http://shy2850.github.io/wfQuery/)

下载
===

<form action="http://webfuture.cn/wfQuery/wfQuery.js" target="_blank">
    <ul>
        <li>
            <input type="checkbox" name="m" id="query" value="query">
            <label for="query">query</label>
            <span>包括first/last/prev/next/find/children/parent等</span>
        </li>
        <li>
            <input type="checkbox" name="m" id="dom" value="dom">
            <label for="dom">dom</label>
            <span>包括append/prepend/before/after/remove等</span>
        </li>
        <li>
            <input type="checkbox" name="m" id="event" value="evnet">
            <label for="event">event</label>
            <span>包括on/off/trigger等</span>
        </li>
        <li>
            <input type="checkbox" name="m" id="css" value="css">
            <label for="css">css</label>
            <span>包括css/show/hide等,不含animate</span>
        </li>
        <li>
            <input type="checkbox" name="m" id="attr" value="attr">
            <label for="attr">attr</label>
            <span>包括attr/addClass/removeClass/data等</span>
        </li>
        <li>
            <input type="checkbox" name="m" id="serialize" value="serialize">
            <label for="serialize">serialize</label>
            <span>包括serialize/serializeArray等</span>
        </li>
        <li>
            <input type="checkbox" name="m" id="ajax" value="ajax">
            <label for="ajax">ajax</label>
            <span>包括ajax/jsonp/get/post等</span>
        </li>
    </ul>
    <p>
        <input type="submit" value="下载wfQuery"> <span>不选即为下载全部</span>
    </p>
</form>
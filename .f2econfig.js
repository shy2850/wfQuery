const path = require('path')

module.exports = {
    livereload: true,
    gzip: true,
    middlewares: [
        // lodash 模板引擎
        () => {
            const _ = require('lodash')
            return {
                // 中间件置顶位置 include 之后
                setBefore: 1,
                onSet (pathname, data) {
                    // data 目录下面的文本资源需要经过模板引擎编译
                    if (pathname.match(/^(test\/.*|wfQuery\.js)/)) {
                        let str = data.toString()
                        try {
                            str = _.template(str)({__dirname, require})
                        } catch (e) {
                            console.log(pathname, e)
                        }
                        return str
                    }
                }
            }
        }
    ],
    output: path.resolve(__dirname, '../wfQuery-output')
}

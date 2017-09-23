const path = require('path')
const { argv } = process
const build = argv[argv.length - 1] === 'build'
module.exports = {
    host: !build ? undefined : 'wfquery.top',
    port: !build ? undefined : 80,
    livereload: !build,
    build,
    gzip: true,
    onRoute: pathname => pathname || 'index.html',
    middlewares: [
        {
            setBefore: 1,
            middleware: 'template'
        }
    ],
    output: path.resolve(__dirname, '../wfQuery-output')
}

const Koa = require('koa');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
const router = require('./server/routes/index.js');
const jwt = require('koa-jwt');
const secret = require('./server/config/secret.json');
const err = require('./server/middleware/error.js');
const app = new Koa();
const cors = require('koa2-cors'); // 跨域
const koaBody = require('koa-body'); //解析上传文件的插件

app
    .use(logger())
    .use(koaBody({
        multipart: true,
        formidable: {
            maxFileSize: 2000 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
        }
    }))
    .use(cors({
        origin: function (ctx) {
            return '*';
        },
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        maxAge: 5,
        credentials: true,
        allowMethods: ['GET', 'POST', 'DELETE'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    }))
    .use(err())
    .use(jwt({secret: secret.sign}).unless({
        path: [
            /^\/api\/login/, 
            /^\/api\/login_out/, 
            /^\/api\/see/,
            /^\/api\/pageview/,
            /^\/api\/comment/
        ]
    }))
  
app.use(router.routes())
   .use(router.allowedMethods())  
app.listen(9527, ()=> {
	console.log(`server running success`)
})

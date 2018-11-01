const Router = require('koa-router');
const UserController = require('../controller/user.js');
const ArticleController = require('../controller/article.js');
const router = new Router({
	prefix: '/api'
});
//用户处理
router.post('/', UserController.postLogin)
router.post('/login', UserController.postLogin)
router.post('/login_out', UserController.loginOut)
//前端文章处理
router.post('/see/articles', ArticleController.queryArticle)
//后台文章处理
router.post('/edit/articles', ArticleController.createArticle)
router.delete('/edit/articles', ArticleController.deleteArticle)
router.put('/edit/articles', ArticleController.updateArticle)
router.post('/query/articles', ArticleController.queryArticle)

router.post('/test', UserController.test)

module.exports = router;
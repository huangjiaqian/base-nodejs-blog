/**
 * 文章相关路由器
 */
let express = require('express');
let router = express.Router();
let async = require('async');

let Article = require('../db/articleDao.js');
let Dao = require('../db/dao.js');
let Comment = require('../db/commentDao.js');
let Zambia = require('../db/zambiaDao');

router.get('/list/:page/:rows', function (req, res, next) {
    let pageNum = parseInt(req.params.page);
    let rowsNum = parseInt(req.params.rows);

    Dao.getPage(Article, Article.find({}), pageNum, rowsNum, function (rs, result) {
        res.send({
            rows: rs,
            total: result.length
        });
    }, function (err) {
        res.send(err);
    });
});
router.get('/one/:articleId', function (req, res, next) {
    let articleId = req.params.articleId;

    Article.findById(articleId, function (err, article) {
        res.send(article);
    });
});
router.post('/update', function (req, res, next) {

    let article = req.body.article;
    //console.log(article);
    if (article._id) {
        Article.update({
            _id: article._id
        }, {
            title: article.title,
            content: article.content,
            tags: article.tags,
            column: article.column,
            fromSource: article.fromSource,
            updateTime: new Date()
        }, function (err, result) {
            res.send('success');
        });
    } else {
        new Article({
            title: article.title,
            content: article.content,
            tags: article.tags,
            column: article.column,
            fromSource: article.fromSource,
            createTime: new Date()
        }).save(function (err, result) {
            res.send('success');
        });
    }

});

router.post('/delete/:articleId', function (req, res, next) {
    let articleId = req.params.articleId;
    Article.remove({
        _id: articleId
    }, function (err, result) {
        res.send('success');
    });
});


// 文章查看
router.get('/:articleId', function (req, res, next) {
    let articleId = req.params.articleId;
    Article.findById(articleId, function (err, article) {
        if (err) {
            res.send(err);
        } else {
            if (!article) {
                return res.send('<h1>文章不存在！</h1>');
            }
            let newReadNum = article.readNum ? article.readNum + 1 : 1;

            async.series([function (nextFun) {
                    // 更新阅读量
                    Article.update({
                        _id: articleId
                    }, {
                        readNum: newReadNum
                    }, function (err, result) {
                        nextFun(err, result);
                    });
                },
                function (nextFun) {
                    //获取评论
                    Comment.find({
                        articleId: articleId
                    }).sort({
                        createTime: 1
                    }).exec(function (err, comments) {
                        nextFun(err, comments);
                    });
                },
                function (nextFun) {
                    Article.find({
                        _id: {
                            $gt: articleId
                        }
                    }).sort({
                        _id: 1
                    }).limit(1).exec(function (err, result) {
                        let sypArticle = result && result.length > 0 ? result[0] : null;
                        nextFun(err, sypArticle);
                    });
                },
                function (nextFun) {
                    Article.find({
                        _id: {
                            $lt: articleId
                        }
                    }).sort({
                        _id: -1
                    }).limit(1).exec(function (err, result) {
                        let xypArticle = result && result.length > 0 ? result[0] : null;
                        nextFun(err, xypArticle);
                    });
                },
                function (nextFun) {
                    let tagIds =  [];
                    article.tags.forEach(function(tag){
                        tagIds.push(tag._id);
                    });
                    Article.find({'tags._id':{$in:tagIds}}).sort({createTime:-1}).limit(8).exec(function(err,result){
                        nextFun(err,result);
                    });
                }
            ], function (err, values) {
                if (err) {
                    res.send('<h1>文章不存在！</h1>');
                } else {
                    article.readNum = newReadNum;
                    // 获取上一篇，下一篇
                    res.render('article', {
                        article: article,
                        comments: values[1],
                        sypArticle: values[2], //上一篇
                        xypArticle: values[3], //下一篇
                        xgArticles: values[4] //相关推荐
                    });

                }
            });
        }
    });
});
router.post('/zambia/:articleId', function (req, res, next) {
    let articleId = req.params.articleId;
    if (articleId) {
        let ip = req.connection.remoteAddress; // 用户ip地址
        Zambia.find({
            ip: ip,
            articleId: articleId
        }).exec(function (err, zambia) {
            if (zambia && zambia.length > 0) {
                // 不能赞
                res.send({
                    status: 'false',
                    text: ''
                });
            } else {
                Article.findById(articleId, function (err, article) {
                    let newNiceNum = article.niceNum ? article.niceNum + 1 : 1;
                    Article.update({
                        _id: articleId
                    }, {
                        niceNum: newNiceNum
                    }, function (err, result) {
                        new Zambia({
                            ip: ip,
                            articleId: articleId
                        }).save(function (err, result) {
                            res.send({
                                status: 'true',
                                text: ' <span class="glyphicon glyphicon-thumbs-up"></span> 赞（' + newNiceNum + '）'
                            });
                        });
                    });
                });
            }
        });

    } else {
        res.send('非法的操作');
    }

});

module.exports = router;
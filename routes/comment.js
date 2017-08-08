let express = require('express');
let router = express.Router();

let Comment = require('../db/commentDao.js');
let Article = require('../db/articleDao.js');
let Dao = require('../db/dao.js');

router.get('/', function (req, res, next) {
    res.send('11');
});

//  评论
router.post('/toComment.do', function (req, res, next) {
    let commentName = req.body.commentName;
    let commentEmail = req.body.commentEmail;
    let commentContent = req.body.commentContent;
    let articleId = req.body.articleId;
    if(!articleId) return res.send('评论操作非法');
    if (!commentContent || commentContent == '' || commentContent.length < 6 || commentContent.length > 600) {;
        return res.redirect('/article/'+articleId);
    }
    if (!commentName || commentName == '') {
        return res.redirect('/article/'+articleId);
    }
    if (!commentEmail || commentEmail == '') {
        return res.redirect('/article/'+articleId);
    }

    new Comment({
        name: commentName,
        email: commentEmail,
        content: commentContent,
        createTime: new Date(),
        articleId: articleId
    }).save(function (err, result) {
        Article.findById(articleId, function (err, article) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                let newCommentNum = article.commentNum ? article.commentNum + 1 : 1;
                Article.update({
                    _id: articleId
                }, {
                    commentNum: newCommentNum
                }, function (err, result) {
                    res.redirect('/article/' + articleId);
                });
            }
        });

    });
});
module.exports = router;
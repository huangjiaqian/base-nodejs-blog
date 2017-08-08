let express = require('express');
let router = express.Router();
let Article = require('../db/articleDao.js');
let Message = require('../db/messageDao.js');
let Tag = require('../db/tagDao.js');
let Dao = require('../db/dao.js');


/* GET home page. */
router.get('/index.html', function (req, res, next) {
  let page = parseInt(req.query.page ? req.query.page : 1);
  let rows = parseInt(req.query.rows ? req.query.rows : 10);
  Article.find({}).sort({
    createTime: -1
  }).limit(10).exec(function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.render('index', {
        title: '小钱的博客',
        author: '小钱',
        articles: result
      });
    }
  });
});

router.get('/more-article.html', function (req, res, next) {
  let page = parseInt(req.query.page ? req.query.page : 1);
  let rows = parseInt(req.query.rows ? req.query.rows : 15);

  let lm = req.query.lm;
  let splitPathUrl = '/more-article.html?';
  let where = {};
  let listName = '文章列表';

  if (req.query.search) {
    where.title = new RegExp(req.query.search); //模糊查询参数
    splitPathUrl += 'search=' + req.query.search + '&';
    listName = '查询结果';
  }
  if (req.query.tag) {
    where = {
      'tags._id': req.query.tag
    };
    splitPathUrl += 'tag=' + req.query.tag + '&';
    listName = '文章列表';
  }
  //tags: { $all: [ "appliances", "school", "book" ] }
  if (lm) { //如果栏目不为空
    where.column = lm;
    splitPathUrl += 'lm=' + lm + '&';
    listName += '（' + (lm == 'webfront' ? '网站前端' : '后端技术') + '）';
  }



  Dao.getPage(Article, Article.find(where).sort({
    createTime: -1
  }), page, rows, function (rs, result) {
    let totalPage = parseInt(result.length / rows);
    res.render('more-article', {
      title: '小钱的博客',
      author: '小钱',
      articles: rs,
      total: result.length,
      splitPathUrl: splitPathUrl,
      current: page,
      totalPage: totalPage,
      listName: listName
    });
  }, function (err) {
    res.send(err);
  });
});


router.get('/about.html', function (req, res, next) {
  let page = parseInt(req.query.page ? req.query.page : 1);
  let rows = parseInt(req.query.rows ? req.query.rows : 20);
  Dao.getPage(Message, Message.find({}).sort({
    _id: 1
  }), page, rows, function (rs, result) {
    let totalPage = parseInt(result.length / rows);
    res.render('about', {
      title: '小钱的博客',
      author: '小钱',
      messages: rs,
      total: result.length,
      current: page,
      totalPage: totalPage
    });
  }, function (err) {
    res.send(err);
  });
});

router.get('/friendly.html', function (req, res, next) {
  res.render("friendly");
});
router.get('/tags.html', function (req, res, next) {
  Tag.find({}).sort({
    createTime: 1
  }).exec(function (err, tags) {
    console.log('输出：' + tags);
    res.render("tags", {
      tags: tags
    });
  });
});
router.get('/tags/list', function (req, res, next) {
  Tag.find({}).sort({
    createTime: 1
  }).exec(function (err, tags) {
    res.send(tags);
  });
});
router.get('/readerWall.html', function (req, res, next) {
  res.render("readerWall");
});


router.get('/', function (req, res, next) {
  res.redirect('/index.html');
});


module.exports = router;
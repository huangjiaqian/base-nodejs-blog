/**
 * 前置执行
 */
let Diary = require('../db/diaryDao');
let Article = require('../db/articleDao');
let async = require('async');
let dateFormat = require('dateformat');

let frontFilter = {
    globalFilter: function (req, res, next) {
        let url = req.originalUrl;

        async.series([function (nextFun) {
            // 每日一句
            Diary.findOne({}).sort({ createTime: 1 }).exec(function (err, diary) {
                nextFun(err, diary);
            });
        }, function (nextFun) {
            // 热门推荐
            Article.find({}).sort({readNum:-1}).limit(5).exec(function(err,hotArticles){
                nextFun(err,hotArticles);    
            });
        }, function (nextFun) {

            nextFun();
        }], function (err, values) {
            if (err) {
                res.send(err);
            } else {
                res.locals.diary = values[0];
                res.locals.hotArticles = values[1];
                res.locals.dateFormat = dateFormat;
                res.locals.utils = {};
                res.locals.contextPath = '';
                res.locals.utils.date2Week = function (date) {
                    let weekStr = ['日', '一', '二', '三', '四', '五', '六'];
                    return weekStr[date.getDay()];
                };
                next();
            }
        });
    }
}
module.exports = frontFilter;
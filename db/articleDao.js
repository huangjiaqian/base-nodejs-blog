/**
 * 用户信息
 */
let mongoose = require('./db.js'),
    Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String
    },
    content: {
        type: String
    },
    createTime: {
        type: Date
    },
    updateTime: {
        type: Date
    },
    readNum: {
        type: Number
    }, // 阅读数
    niceNum: {
        type: Number
    }, // 被赞数
    commentNum: {
        type: Number
    }, // 评论数
    tags: {
        type: Array
    }, //标签
    userId: {
        type: String
    },
    column: { //栏目
        type: String
    },
    fromSource: { //来源
        type: String
    }
});
module.exports = mongoose.model('Article', ArticleSchema);
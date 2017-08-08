/**
 * 用户信息
 */
let mongoose = require('./db.js'),
    Schema = mongoose.Schema;

let CommentSchema = new Schema({
    name: {
        type: String
    },
    email: {
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
    niceNum: {
        type: Number
    }, // 被赞数
    userId: {
        type: String
    },
    articleId: {
        type: String
    },
});
module.exports = mongoose.model('Comment', CommentSchema);
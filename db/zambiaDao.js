/**
 * 用户信息
 */
let mongoose = require('./db.js'),
    Schema = mongoose.Schema;

let ZambiaSchema = new Schema({
    articleId: {
        type: String
    },
    ip: {
        type: String
    },
    createTime: {
        type: Date
    },
    userId: {
        type: String
    }
});
module.exports = mongoose.model('Zambia', ZambiaSchema);
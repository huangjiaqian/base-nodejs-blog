/**
 * 用户信息
 */
let mongoose = require('./db.js'),
    Schema = mongoose.Schema;

let TagSchema = new Schema({
    name: {
        type: String
    },
    content: {
        type: String
    },
    createTime: {
        type: Date
    }
});
module.exports = mongoose.model('Tag', TagSchema);
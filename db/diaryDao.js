/**
 * 每日一句
 */
let mongoose = require('./db.js'),
    Schema = mongoose.Schema;

let DiarySchema = new Schema({
    content: {
        type: String
    },
    createTime: {
        type: Date
    },
    userId: {
        type: String
    }
});
module.exports = mongoose.model('Diary', DiarySchema);
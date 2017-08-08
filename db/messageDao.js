/**
 * 留言
 */
let mongoose = require('./db.js'),
    Schema = mongoose.Schema;

let MessageSchema = new Schema({
    name: {
        type: String
    },
    content: {
        type: String
    },
    email: {
        type: String
    },
    createTime: {
        type: Date
    },
    userId: {
        type: String
    }
});
module.exports = mongoose.model('Message', MessageSchema);
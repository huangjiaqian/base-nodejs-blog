/**
 * 用户信息
 */
let mongoose = require('./db.js'),Schema = mongoose.Schema;

let UserSchema = new Schema({          
    name : { type: String },                    //用户账号
    password: {type: String}                        //密码
    /*
    ,userage: {type: Number},                        //年龄
    logindate : { type: Date}                       //最近登录时间
    */
});
module.exports = mongoose.model('User',UserSchema);
let express = require('express');
let router = express.Router();
let Message = require('../db/messageDao.js');
let Dao = require('../db/dao.js');

router.get('/list', function (req, res, next) {
    res.send('messgae');
});
router.post('/commit.do', function (req, res, next) {
    let name = req.body.messageName;
    let email = req.body.messageEmail;
    let content = req.body.messageContent;
    if (!content || content == '' || content.length < 6 || content.length > 600) {
        res.redirect('/about.html');
        return;
    }
    if (!name || name == '') {
        res.redirect('/about.html');
        return;
    }
    if (!email || email == '') {
        res.redirect('/about.html');
        return;
    }

    let message = new Message({
        name: name,
        content: content,
        createTime: new Date(),
        email: email
    });


    console.log("输出：：：" + message);

    message.save(function (err, result) {
        if (err) { }
        res.redirect('/about.html');
    });

    //res.redirect('/about.html');
});

module.exports = router;
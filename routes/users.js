let express = require('express');
let router = express.Router();

let User = require("../db/userDao.js");

/* GET users listing. */
router.get('/', function (req, res, next) {

    let count = 0;
    let page = req.body.page;
    let rows = req.body.rows;

    if (page == null) page = 1;
    if (rows == null) rows = 10;

    console.log("page:" + page + ",rows:" + rows);

    let query=User.find({});
    query.skip((page-1)*rows);
    query.limit(rows);
    //计算分页数据
    query.exec(function(err,rs){
        if(err){
            res.send(err);
        }else{
            //计算数据总数
            User.find(function(err,result){
                let jsonArray={rows:rs,total:result.length};
                res.json(jsonArray);
            });
             
        }
    });
  
});

module.exports = router;

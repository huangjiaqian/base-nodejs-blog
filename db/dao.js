let dao = {
    getPage: function(Schema,query,page,rows,successRollback,errorRollBack){
        query.skip((page-1)*rows);
        query.limit(rows);

        //计算分页数据
        query.exec(function(err,rs){
            if(err){
                errorRollBack(err);
            }else{
                //计算数据总数
                Schema.find(function(err,result){
                    successRollback(rs,result);
                });   
            }
        });
        
       // successRollback(11,33);
    },
    test: function(Schema,rollback){
        Schema.find(function(err,result){
            console.log(result.length);
            rollback();
        });
        
    }
}
module.exports = dao;
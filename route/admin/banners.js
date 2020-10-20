const express = require('express');
const mysql = require('mysql');
var db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'learn'
});
module.exports=function(){
    var router = express.Router();
    router.get('/',(req,res)=>{
        var act = req.query.act;
        switch (act) {
            case 'mod':
                db.query(`select id,title,description,href from banner_table where ID=${req.query.id}`,(err,data)=>{
                    if(err){
                        console.log(err);
                        res.status(500).send('database error').end;
                    }else{
                        //刷新页面
                        db.query(`select * from banner_table`,(err,banners)=>{
                            if(err){
                                console.log(err);
                                res.status(400).send('database error').end();
                            }else{
                                res.render('admin/banners.ejs',{mod_data:data[0],banners});
                            }
                        });
                    }
                });
                break;
            case 'del':
                db.query(`delete from banner_table where ID=${req.query.id}`,(err,data)=>{
                    if(err){
                        console.log(err);
                        res.status(500).send('database error').end;
                    }else{
                        //刷新页面
                        res.redirect('/admin/banners');
                    }
                });
                break;
            default:
                //加载数据
                db.query(`select * from banner_table`,(err,banners)=>{
                    if(err){
                        console.log(err);
                        res.status(400).send('database error').end();
                    }else{
                        res.render('admin/banners.ejs',{banners});
                    }
                });
        }
    });
    router.post('/',(req,res)=>{
        var title = req.body.title;
        var description = req.body.description;
        var href = req.body.href;
        if(!title || !description || !href){
            res.status(500).send('args error').end();
        }else{
            console.log(req.body.mod_id);
            if(req.body.mod_id){
                //修改
                db.query(`update banner_table set title='${req.body.title}',description='${req.body.description}',href='${req.body.href}' where ID = '${req.body.mod_id}'`,(err,data)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else{
                        //重定向到此页面
                        res.redirect('/admin/banners');
                    }
                });
            }else{
                //新增
                //插入数据
                db.query(`INSERT INTO BANNER_TABLE(TITLE,DESCRIPTION,HREF) VALUES ('${title}','${description}','${href}')`,(err,data)=>{
                    if(err){
                        console.log(err);
                        res.status(400).send('database error').end();
                    }else{
                        //重定向到本页面
                        res.redirect('/admin/banners');
                    }
                });
            }
        }
    });
    return router;
}
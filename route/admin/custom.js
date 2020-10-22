const express = require('express');
const mysql = require('mysql');
const pathLib = require('path');
const fs = require('fs');
var db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'1234',
    database:'learn'
});
module.exports=function() {
    var router = express.Router();
    router.get('/',(req,res)=>{
        var act = req.query.act;
        switch (act) {
            case 'mod'://修改
                db.query(`select id,title,description,src from custom_evaluation_table where ID=${req.query.id}`,(err,data)=>{
                    if(err){
                        console.log(err);
                        res.status(500).send('database error').end;
                    }else{
                        //刷新页面
                        db.query(`select * from custom_evaluation_table`,(err,evalutions)=>{
                            if(err){
                                console.log(err);
                                res.status(400).send('database error').end();
                            }else{
                                res.render('admin/custom.ejs',{mod_data:data[0],evalutions});
                            }
                        });
                    }
                });
                break;
            case 'del'://删除
                //先删除图片
                db.query(`select * from custom_evaluation_table where ID=${req.query.id}`,(err,data)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else{
                        if(data.length == 0){
                            console.error(err);
                            res.status(400).send('no this evalution').end();
                        }else{
                            fs.unlink('static/upload/'+data[0].src,(err)=>{
                                if(err){
                                    console.error(err);
                                    res.status(400).send('fs operation error').end();
                                }else{
                                    db.query(`delete from custom_evaluation_table where ID=${req.query.id}`,(err,data)=>{
                                        if(err){
                                            console.log(err);
                                            res.status(500).send('database error').end;
                                        }else{
                                            res.redirect('/admin/custom');
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
                break;
            default://正常加载数据
                db.query(`select * from custom_evaluation_table`,(err,evalutions)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else{
                        res.render('admin/custom.ejs',{evalutions});
                    }
                });
                break;
        }
    });
    router.post('/',(req,res)=>{
        var title = req.body.title;
        var description = req.body.description;
        if(req.files.length != 0){
            //上传了文件
            //处理上传文件
            var oldPath = req.files[0].path;
            var ext = pathLib.parse(req.files[0].originalname).ext;
            var newPath = oldPath + ext;
            var newFileName = req.files[0].filename + ext;
            fs.rename(oldPath,newPath,(err)=>{
                if(err){
                    console.error(err);
                    res.status(400).send('fs operation error').end();
                }  else{
                    if(!title || !description){
                        res.status(400).send('args error').end();
                    }else{
                        if(req.body.mod_id){
                            //修改
                            //先删除旧文件
                            db.query(`select * from custom_evaluation_table where id = '${req.body.mod_id}'`,(err,data)=>{
                                if(err){
                                    console.error(err);
                                    res.status(500).send('database error').end();
                                }else{
                                    fs.unlink('static/upload/'+data[0].src,(err)=>{
                                        if(err){
                                            res.status(400).send('fs operation error').end();
                                        }else{
                                            db.query(`update custom_evaluation_table set title='${title}',description = '${description}',src = '${newFileName}' where id = '${req.body.mod_id}'`,(err,mod_data)=>{
                                                if(err){
                                                    console.error(err);
                                                    res.status(500).send('database error').end();
                                                }else{
                                                    res.redirect('/admin/custom');
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }else {
                            //新增
                            db.query(`insert into custom_evaluation_table(title,description,src) values ('${title}','${description}','${newFileName}')`,(err,data)=>{
                                if(err){
                                    console.error(err);
                                    res.status(500).send('database error').end();
                                }else{
                                    res.redirect('/admin/custom');
                                }
                            });
                        }
                    }
                }
            });
        }else {
            if(req.body.mod_id){
                //修改
                //先删除旧文件
                db.query(`select * from custom_evaluation_table where id = '${req.body.mod_id}'`,(err,data)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else{
                        db.query(`update custom_evaluation_table set title='${title}',description = '${description}' where id = '${req.body.mod_id}'`,(err,mod_data)=>{
                            if(err){
                                console.error(err);
                                res.status(500).send('database error').end();
                            }else{
                                res.redirect('/admin/custom');
                            }
                        });
                    }
                });
            }else {
                //新增
                db.query(`insert into custom_evaluation_table(title,description) values ('${title}','${description}')`,(err,data)=>{
                    if(err){
                        console.error(err);
                        res.status(500).send('database error').end();
                    }else{
                        res.redirect('/admin/custom');
                    }
                });
            }
        }

    });
    return router;
}
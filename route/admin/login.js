const express = require('express');
const common = require('../../libs/common')
const mysql = require('mysql');
var db = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'root',
    database:'learn'
});
module.exports=function(){
    var router = express.Router();
    //get方式请求就直接展示页面
    router.get('/',(req,res)=>{
        res.render('admin/login.ejs',{});
    });
    //校验用户名和密码
    router.post('/',(req,res)=>{
        var username = req.body.username;
        var password = common.md5(req.body.password+common.MD5_SALT);
        console.log(username);
        console.log(password);
        //查询数据库中的admin账号密码
        db.query(`SELECT * FROM ADMIN_TABLE WHERE USERNAME = '${username}'`,(err,data)=>{
            if(err){
                console.log(err);
                res.status(500).send('error in database').end();
            }else{
                if(data.length == 0){
                    res.status(500).send('no such admin which username is '+username).end();
                }else{
                    if(data[0].password != password){
                        res.status(400).send('password is inreccorect').end();
                    }else{
                        req.session['admin_id'] = data[0].id;
                        res.redirect('/admin/');
                    }
                }
            }
        });
    });
    return router;
}
const express = require('express');
const common = require('../libs/common');
const mysql = require('mysql');
var db = mysql.createPool({
	host:'localhost',
	user:'root',
	password:'1234',
	database:'learn'
});
module.exports = function() {
	var router = express.Router();
	//检查登录状态
	router.use((req,res,next)=>{
		if(!req.session['admin_id'] && req.url != '/login'){
			res.redirect('/admin/login');
		}else{
			next();
		}
	});
	//get方式请求就直接展示页面
	router.get('/login',(req,res)=>{
		res.render('admin/login.ejs',{});
	});
	//校验用户名和密码
	router.post('/login',(req,res)=>{
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

	//处理登录成功后的页面跳转
	router.get('/',(req,res)=>{
		res.render('admin/index.ejs',{});
	});


	return router;
};

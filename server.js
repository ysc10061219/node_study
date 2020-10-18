const express = require('express');
const expressStatic = require('express-static');
const bodyParser = require('body-parser');
const multer = require('multer');
const multerObj = multer({desc:'./static/upload'});
const mysql = require('mysql');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const consolidate = require('consolidate');
const expressRoute = require('express-router');
const dateTool = require('./libs/DateUtil');

var server = express();
server.listen(9090,function(){
  console.log('Server start at 9090 in '+dateTool.fmtCurrentDateTime());
});

//1.获取请求数据
server.use(multerObj.any());
server.use(bodyParser.urlencoded());
//2.cookie、session
server.use(cookieParser());
(function(){
  var keys = [];
  for(var i=0;i<100000;i++){
    keys[i] = 'a_' + Math.random();
  }
  server.use(cookieSession({
    name:'sess_id',
    keys:keys,
    maxAge : 20 * 60 * 1000//20min
  }));
})();

//3.模板
server.engine('html',consolidate.ejs);
server.set('views','template');
server.set('view engine','html');

//4.route
server.use('/',require('./route/web.js')());
server.use('/admin/',require('./route/admin.js')());

//5.default
server.use(expressStatic('./static/'));
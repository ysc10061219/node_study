module.exports.fmtCurrentDateTime = function(){
   var times = new Date().getTime().toString();
   var obj = times.substr(0,10);
    var time = new Date(parseInt(obj) * 1000);
    var y = time.getFullYear();  //年
    var m = time.getMonth() + 1;  //月
    if(m < 10){ m = '0' + m }
    var d = time.getDate();  //日
    if(d < 10){ d = '0' + d }
    var h = time.getHours();  //时
    if(h < 10){ h = '0' + h }
    var mm = time.getMinutes();  //分
    if(mm < 10){ mm = '0' + mm }
    var s = time.getSeconds();  //秒
    if(s < 10){ s = '0' + s }
    var timeStr = y+"-"+m+"-"+d+" "+h+":"+mm+":"+s;
    return timeStr;
};

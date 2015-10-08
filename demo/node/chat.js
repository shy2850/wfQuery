var fs = require("fs"),
	http = require("http"),
	url = require("url"),
	querystring = require("querystring");

var list = JSON.parse( fs.readFileSync( "data.json", 'utf-8') ),
	ctime = +new Date,	//初始时间
	mtime = ctime,		//修改时间
	stime = mtime;		//存储时间

http.createServer(function (req, resp){
	var repeat = 0,
		res = querystring.parse( url.parse(req.url).query );
		resp.writeHead(200, {"Content-Type": 'application/javascript'});
	
	res.name = res.name ? res.name.trim() : "(匿名)";
	if(req.url.toString() === "/favicon.ico"){
		var expires = new Date();
        expires.setFullYear( expires.getFullYear() + 1 );
		resp.writeHead(200, {"Content-Type": 'image/x-icon',"Expires": expires});
		resp.end("");
	}else if( !res.time || req.method === "POST" || !res.method ){ //不接收POST请求
		res.msg = res.msg || "加入聊天室";
		res.msgList = [];
		saveMsg(res);
		out(res,resp);
	}else if( "push" === res.method ){
		saveMsg(res);
		out(res,resp);
	}else if( "exit" === res.method ){
		res.msg = "离开聊天室";
		saveMsg(res);
		out(res,resp);
	}else{
		getMsg();
	}
	function getMsg(){
		if( res.time != mtime){
			res.msgList = list.filter(function(m){
				return m.time > res.time;
			});
			res.time = mtime;
			out(res,resp);
		}else if(repeat >= 60){
			res.msgList = [];
			out(res,resp);
		}else{
			repeat++;
			setTimeout(getMsg,500);
		}
	}
}).listen(8973);

function out(res, resp){
	resp.end( (res.callback || "callback") + '('+JSON.stringify(res)+');' );
}

function saveMsg(msg){
	mtime = msg.time = +new Date;
	list.push({
		name: msg.name,
		msg: msg.msg,
		time: mtime
	});
}

function saveList(){
	if( mtime === stime ){
		// 如果最新修改都已经保存,等待下次保存
	}else{	//否则更新存储时间为最新修改时间
		stime = mtime; 
		var n = 0, tmp;
		while(list.length > 100){
			tmp = list.splice(0,100);
			fs.writeFile( "data/"+stime+"-"+(n++)+".json", JSON.stringify(tmp,null,4) );
		}
		fs.writeFile( "data.json", JSON.stringify(list,null,4) );
	}
	setTimeout(saveList, 1000*60*2);
}
saveList();

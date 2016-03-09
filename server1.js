//导入核心模块http
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var mime = require('mime');


var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/mydb');


// db.on('error',console.error.bind(console,'连接错误:'));
// db.once('open',function(){
//   console.log('open db');
// });


// console.log(db);
var Schema = mongoose.Schema;
var weeklyItemSchema = new Schema({
	projectName:String,
	task:String,
	progress:String
});

var WeeklyItemModel = db.model('weekly',weeklyItemSchema);

// var tempobj = {name:'wzw',password:'123456'};

// var userEntity = new UserModel(tempobj);

// userEntity.save();


// UserModel.find(tempobj, function (err, docs) { 

// 	console.log(docs);

// });


// UserModel.findOne(tempobj, function (err, docs) { 

// 	console.log(docs);

// });




var weeklys = [];
var server = http.createServer(function(request, response) {

	// console.log(db);
	var urlObj = url.parse(request.url, true);
	// console.log(urlObj);

	if (urlObj.pathname == '/') {
		response.writeHead(200, {
			'Content-Type': 'text/html;charset=utf-8'
		});
		fs.readFile('./weekly.html', function(err, data) {
			response.end(data);
		})
	} else if (urlObj.pathname == '/weekly') {

		if(request.method == 'GET')
		{

			WeeklyItemModel.find(function (err, docs) { 

				// console.log(docs);
				response.end(JSON.stringify(docs));

			});			
			// response.end(JSON.stringify(weeklys));
		}
		else if (request.method == 'POST')
		{
			//每当服务器收到客户端发过来的一段数据的时候就会触发data事件
			var str = '';
			request.on('data', function(data) {

				str += data.toString();
			});

			//当所有的数据全部接收完毕的时候会会触发end事件，这时请求体的数据就接收完整了
	        request.on('end',function(){
	            // console.log(str);
	            //转成对象追加到用户列表里
	            


				var tempobj = JSON.parse(str);
				console.log(tempobj);
				var weeklyEntity = new WeeklyItemModel(tempobj);
				weeklyEntity.save();
				
				weeklys.push(tempobj);

	            //最后返回用户列表
	            response.end(str);
	            // response.end('{"result":"1"}');

	        })
		}

	}



	// response.end('hello world');
	// console.log();


})


server.listen(8080, '10.106.139.18');
console.log('url:localhost:8080');









var express = require('express');
var app = express();
var http = require('http');
var serveStatic = require('serve-static');
var compression = require('compression');
var monk = require('monk');
var db = monk('localhost:27017/mysite'); 

app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);

app.use(serveStatic(__dirname + '/stackedit/public'));
app.use(serveStatic(__dirname + '/public'));
app.use(compression());

app.use(function(req, res, next) {
	res.renderDebug = function(page) {
		return res.render(page, {
			cache: !req.query.hasOwnProperty('debug')
		});
	};
	next();
});

var userlist = function(db) {
    return function(req, res) {
        var collection = db.get('blogList');
        collection.find({},{},function(e,docs){
            res.render('blog-list.html', {
                "blogList" : docs
            });//使用页面引擎渲染
        });
    };
};


app.get('/', function(req, res) {
	console.log(req);
	res.renderDebug('index.html');
	//console.log(res);
});
app.get('/write',function(req,res){
	res.renderDebug('editor.html');
	
});

app.get('/blog-list.html',userlist(db));

/*
app.get('/blog-list.html',function(req,res){
	
	res.renderDebug('blog-list.html');
	
});
*/

var port = 3000;
	
var httpServer = http.createServer(app);	
httpServer.listen(port, null, function() {
	console.log('HTTP server started: http://localhost:' + port);
});
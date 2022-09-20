var express = require('express');
var ejs = require("ejs");
var app = express();

app.engine('ejs',ejs.renderFile);
app.use(express.static('public'));

var multer = require('multer');

var filename;

var storage = multer.diskStorage({
    //ファイルの保存先を指定
    destination: function(req, file, cb){
        cb(null, './public/images')
    },
    //ファイル名を指定
    filename: function(req, file, cb){
        var extention = file.originalname;
        filename = Date.now() + '.' + extention.split('.').pop();
        cb(null, filename)
    }
})

var upload = multer({storage:storage})

var mysql = require('mysql');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

var mysql_setting = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'image_chat'
};

// get
app.get("/", (req, res) => {
    var connection = mysql.createConnection(mysql_setting);

    connection.connect();    
    connection.query('SELECT * from chats',function (error, results, fields){
        if (error == null){
            res.render('main.ejs',
            {
                chats:results
            });
        }
    });
    connection.end();
});

app.get("/ch:chatlink", (req, res) => {
    var chatlink = req.params.chatlink
    var chats
    var images

    var connection = mysql.createConnection(mysql_setting);

    connection.connect();  
    connection.query('SELECT * from chats',function (error, results, fields){
        if (error == null){
            chats=results
        }
    });
    connection.query('SELECT * from contents where chat_id= ?', chatlink,function (error, results, fields){
        if (error == null){
            images=results
        }
    });
    connection.query('SELECT * from chats where item_id= ?',chatlink ,function (error, results, fields){
        if (error == null){
            res.render('contents.ejs',{
                nowchat:results[0],
                chats:chats,
                images:images
            });
        }
    });
    connection.end();
});

app.get("/make", (req, res) => {
    var connection = mysql.createConnection(mysql_setting);

    connection.connect();
    connection.query('SELECT * from chats',function (error, results, fields){
        if (error == null){
            res.render('make.ejs',{
                chats:results
            });
        }
    });
    connection.end();
});

// post
app.post("/upload_contents", upload.single('file'), (req, res) => {
    var date = new Date();

    var name = req.body.name;
    var title = req.body.title;
    var update_date = date.getFullYear()
    + '/' + ('0' + (date.getMonth() + 1)).slice(-2)
    + '/' + ('0' + date.getDate()).slice(-2)
    + ' ' + ('0' + date.getHours()).slice(-2)
    + ':' + ('0' + date.getMinutes()).slice(-2)
    + ':' + ('0' + date.getSeconds()).slice(-2);
    var chat_id = req.body.chat_id;
    var data = {'name':name, 'title':title, 'update_date': update_date, 'image_name':filename, 'chat_id':chat_id}

    var connection = mysql.createConnection(mysql_setting);

    connection.connect();
    connection.query('insert into contents set ?', data, function (error, results, fields){
        res.redirect('/ch'+chat_id);
    });
    
    connection.end();
});

app.post("/makechat", (req, res) => {
    var name = req.body.name;
    var data = {'name':name}

    var connection = mysql.createConnection(mysql_setting);

    connection.connect();
    connection.query('insert into chats set ?', data, function (error, results, fields){
        res.redirect('/');
    });
    
    connection.end();
});

var server = app.listen(3000, () => {
    console.log('Port Number is 3000.');
})

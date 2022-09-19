var express = require('express');
var ejs = require("ejs");
var app = express();

app.engine('ejs',ejs.renderFile);
app.use(express.static('public'));

// get
app.get("/", (req, res) => {
    res.render('main.ejs',{

    });
});

app.get("/contents", (req, res) => {
    res.render('contents.ejs',{

    });
});

app.get("/make", (req, res) => {
    res.render('make.ejs',{

    });
});

var server = app.listen(3000, () => {
    console.log('Port Number is 3000.');
})

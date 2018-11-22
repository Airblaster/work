var express = require('express');
var router = express.Router();


var http = require('http');
var io = new require('socket.io')(http);



var connection = function () {
    let mysql = require('mysql');
    let con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "mydb"
    });
    return con;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    let con = connection();
    con.connect(function(err) {
        if (err) throw err;
        let sql = "SELECT * FROM tasks";
        con.query(sql,function (err, result) {
            if (err) throw err;
            res.render('dashboard', {data1: result});
        });
    });

});

router.get('/tasks', function(req, res, next) {
    res.render('tasks');
});

router.get('/chat', function(req, res, next) {
    res.render('chat');
});




router.post("/select_marks", function(req,res){
    let con = connection();
    con.connect(function(err) {
        if (err) throw err;
        let sql;
        let id2 = req.body.id1;
        sql = "SELECT * FROM marks LIMIT 25";
        con.query(sql,function (err, result) {
            if (err) throw err;
            else {
                return res.send(result);
            }

        });
    });
});


router.post("/select_tasks", function(req,res){
    let con = connection();
    con.connect(function(err) {
        if (err) throw err;
        let sql = "SELECT * FROM tasks";
        con.query(sql,function (err, result) {
            if (err) throw err;
            else {
                for (var i=0;i<result.length;i++) {
                    if (result[i].parent == 'null') {
                        result[i].padding = 'normal';
                        result[i].clname = '"add_subtask"';

                    }
                    else {
                        result[i].padding = 'nested';
                        result[i].clname = 'btn btn-info btn-xs edit_data';

                    }
                }
                return res.send(result);
            }

        });
    });
});






router.post('/insert_mark', function (req, res) {
    let results = [];
    const fs = require('fs');
    fs.readdir('C:/Users/User/WebstormProjects/untitled1/public/images',function (err,files) {
       if (err) throw err;
        let res;
        let counter = 1;
        let img;
        for (let i=0; i<files.length; i++) {
            res = files[i].replace('.png','');
            results.push([counter,res, '/images/'+files[i]]);
            counter = counter + 1;
        }
    });

    let con = connection();

    con.connect(function(err) {
        if (err) throw err;
        sql = "DELETE FROM marks";
        con.query(sql,function (err, result) {
            if (err) throw err;
        });

        sql = "INSERT INTO marks (id,name,image) VALUES ?";
        con.query(sql, [results],function (err, result) {
            if (err) throw err;
        });
    con.end();

    });
});






module.exports = router;

var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

let environment = null;

if(!process.env.ON_HEROKU){
    console.log("Cargando variables desde archivo");
    const env = require('node-env-file'); // .env file
    env(__dirname + '/.env');
}

environment = {
    DBMONGOUSER: process.env.DBMONGOUSER,
    DBMONGOPASS: process.env.DBMONGOPASS,
    DBMONGOSERV:  process.env.DBMONGOSERV,
    DBMONGO: process.env.DBMONGO,
};

var TaskModel = require('./task_schema');

// Connecting to database 
var query = 'mongodb+srv://' + environment.DBMONGOUSER + ':' + environment.DBMONGOPASS + '@' + environment.DBMONGOSERV + '/' + environment.DBMONGO + '?retryWrites=true&w=majority';
console.log(query)
const db = (query);
mongoose.Promise = global.Promise;

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (error) {
    if (error) {
        console.log("Error!" + error);
    } else {
        console.log("Conexion a base de datos exitosa");
    }
});

router.get('/all-tasks', function (req, res) {
    TaskModel.find(function (err, data) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(data);
        }
    });
});

router.get('/get-task/:TaskId', function (req, res) {
    TaskModel.findOne({ TaskId: req.params.TaskId }, function (err, data) {
        if (err) {
            console.log(err);
            res.send("Internal error");
        } else {
            res.send(data);
        }
    });
});


router.post('/create-task', function (req, res) {
    let task_id = req.body.TaskId;
    let name = req.body.Name;
    let deadline = req.body.Deadline;

    let task = {
        TaskId: task_id,
        Name: name,
        Deadline: deadline
    }

    var newTask = new TaskModel(task);

    newTask.save(function (err, data) {
        if (err) {
            console.log(error);
        }
        else {
            res.send("Data inserted");
        }
    });
});

router.post('/update-task', function (req, res) {
    TaskModel.updateOne({ TaskId: req.body.TaskId }, {
        Name: req.body.Name,
        DeadLine: req.body.DeadLine
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send(data); console.log("Data Updated!");
        }
    });
});


router.delete("/delete-task", function (req, res) {
    TaskModel.deleteOne({ TaskId: req.body.TaskId }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.send(data); console.log("Data Deleted!");
        }
    });
});

module.exports = router;

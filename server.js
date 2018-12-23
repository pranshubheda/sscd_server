const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const db = require('./database.js');
let PostModel = require("./model/post");
let UserModel = require("./model/user");
let UserLocationModel = require("./model/user_location");

var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const port = process.env.PORT || 5656;
var cors = require("cors");
// var https = require('https');
// var fs = require('fs');

// var options = {
//     key: fs.readFileSync("./ssl/localhost.key"),
//     cert: fs.readFileSync("./ssl/localhost.cert"),
// }

// var server = https.createServer( options, app );

app.listen( port, function () {
    console.log( 'SSCD server listening on port ' + port );
} );

app.use(cors());

app.post("/api/post", jsonParser, (req, res) => {
  console.log("pranshu", req.body);
  let newPost = new PostModel(req.body);

  newPost
    .save()
    .then(doc => {
        console.log('success db call',doc);
        res.send(JSON.stringify(doc));
    })
    .catch(err => {
        console.error('failure db call',err);
    });

});

app.post("/api/login", jsonParser, (req, res) => {

    var loginCredentials = req.body;

    UserModel.findOne(loginCredentials, '_id', (error, user_id) => {
        if (error) {
            console.error('Login query FAILED. ',loginCredentials,' error: ', error);
            var error = {
                error_msg : 'Login failed. Contact Admin.'
            }
            res.status(500).send(JSON.stringify(error));
        }
        else {
            console.log(user_id);
            if(user_id != null) {
                res.send(user_id);
            }
            else{
                var error = {
                    error_msg : 'Login credentials did not match. Contact Admin.'
                }
                res.status(404).send(JSON.stringify(error));
            }
        }
    });
});

app.post("/api/location/update", jsonParser, (req, res) => {
    var location = req.body;
    console.log(location.user_id);
    // UserLocationModel.findOne({user_id: '5c1e70331c9d440000f26865'}, (err, userLocation) => {
    //     console.log(userLocation);
    // });

    var query = {user_id  : location.user_id};

    UserLocationModel.findOneAndUpdate(query,
         {  $set: {
                latitude: location.latitude,
                longitude: location.longitude,
            }
         },
        (error, updated_user_location) => {
            if (error) {
                console.error('Location update FAILED. ',loginCredentials,' error: ', error);
                var error = {
                    error_msg : 'Location update failed. Contact Admin.'
                }
                res.status(500).send(JSON.stringify(error));
            }
            else {
                res.send(JSON.stringify({
                    message: updated_user_location
                }));            
            }
        }
    );
});

app.get("/api/test", jsonParser, (req, res) => {
    console.log('test');
    res.send('hello');
});
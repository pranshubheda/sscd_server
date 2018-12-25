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

app.get("/api/users", jsonParser, (req, res) => {
    console.log('all users requested');
    UserModel.find({}, function(err, users) {
        var usersArray = [];
    
        users.forEach(function(user) {
          userObj = {
              user_id: user._id,
              username: user.username,
          };
          usersArray.push(userObj);
        });
        
        res.send(JSON.stringify({
            data: usersArray
        }));  
    });
});

app.post("/api/userlocation", jsonParser, (req, res) => {
    var reqBody = req.body;

    var query = {user_id  : reqBody.user_id};

    UserLocationModel.findOne(query,
        (error, user_location) => {
            if (error) {
                console.error('UserLocation fetch FAILED. for ',user_id,' error: ', error);
                var error = {
                    error_msg : 'UserLocation fetch FAILED. Contact Admin.'
                }
                res.status(500).send(JSON.stringify(error));
            }
            else {
                if (user_location !== null) {
                    latitude = user_location.latitude;
                    longitude = user_location.longitude;
    
                    res.send(JSON.stringify({
                        latitude: user_location.latitude,
                        longitude: user_location.longitude,
                    }));            
                }
                else {
                    console.error('UserLocation document not found UserLocation:'+user_location);
                }
            }
        }
    );
});

app.post("/api/create/user", jsonParser, (req, res) => {
    var reqBody = req.body;

    var query = {username  : reqBody.username};
    message = '';
    status = 200;

    UserModel.findOne(query, (error, user) => {
        if (error) {
            console.error('User fetch FAILED. for ',user_id,' error: ', error);
            var error = {
                error_msg : 'User fetch FAILED. Contact Admin.'
            }
            res.status(500).send(JSON.stringify(error));
        }
        else {
            if(user == null) {
                createNewUser(req).then((new_user_id) =>{
                    if (new_user_id != null) {
                        createUserLocation(new_user_id);
                    }
                    else {
                        message = 'failure db call for User Create. New User ID:-'+new_user_id;
                        status = 500;
                        console.err(message);
                    }
                }).catch(err => {
                    console.error(err);
                }); 
            }
            else {
                message = 'User already exists with this username: '+user;
                console.log(message);
                status = 409;
            }
        }
    });
    
    res.status(status).send(JSON.stringify({
        'message': message
    }));      
});

var createNewUser = (req) => {
    return new Promise((resolve, reject) => {
        new_user_id = null;
        var newUser = new UserModel(req.body);
        const error = false;
        newUser.save()
        .then(newUser => {
            new_user_id = newUser._id;
            message = 'success db call for User Create '+newUser
            console.log(message);
            resolve(new_user_id);
        })
        .catch(err => {
            message = 'failure db call for User Create. Error:'+err;
            console.error(message);
            reject(err);
        });    
    });
}

var createUserLocation = (new_user_id) => {
    console.log('creating UserLocation for user_id:- '+new_user_id);
    message = '';
    let query = {
        user_id: new_user_id,
        latitude: '0',
        longitude: '0',
    };
    let newUserLocationModel =  new UserLocationModel(query);
    
    newUserLocationModel
    .save()
    .then(newUSerLocation => {
        message = 'success db call for new NewUSerLocation '+new_user_id;
        console.log(message+newUSerLocation);
    })
    .catch(err => {
        message = 'failure db call for NewUSerLocation. Error:' +err;
        console.error(message);
    });
}
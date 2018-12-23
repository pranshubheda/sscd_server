let mongoose = require("mongoose");
const database = 'sscd_db';
const password = 'MfeQbp7NYqhs8Yr';
const uri =
  'mongodb://root:MfeQbp7NYqhs8Yr@sscd-shard-00-00-incyn.mongodb.net:27017,sscd-shard-00-01-incyn.mongodb.net:27017,sscd-shard-00-02-incyn.mongodb.net:27017/sscd_db?ssl=true&replicaSet=sscd-shard-0&authSource=admin&retryWrites=true';

class Database {
  constructor() {
    this._connect();
  }
  
  _connect() {

    mongoose.connect(uri, null)
        .then(() => {
            console.log("DB connection successful")
        }, (err) => {
            console.log("DB connection failed "+err)
        });
    
    // var db = mongoose.connection;
    
    // db.on("error", console.error.bind(console, "connection error:"));

  }
}

module.exports = new Database();

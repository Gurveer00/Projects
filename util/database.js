const mongodb= require('mongodb');
const mongoclient= mongodb.MongoClient;

let _db;

const mongoconnect= (callback)=>{
    mongoclient.connect('mongodb+srv://guri:v7C12jELZQeUJZ42@cluster0.ciflxib.mongodb.net/?retryWrites=true&w=majority')
.then(client=>{
    console.log('connected');
    _db= client.db();
    callback();
})
.catch(err=>{
    console.log(err);
    throw err;
})
}

const getdb= ()=>{
    if(_db){
        return _db;
    }
    throw 'no database found';
}

exports.mongoconnect= mongoconnect;
exports.getdb= getdb;
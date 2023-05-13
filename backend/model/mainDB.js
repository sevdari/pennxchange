/* eslint-disable */
const { MongoClient, ObjectId } = require('mongodb');

// Connection URL
const url = 'mongodb+srv://pennxchange:ojoXSvWLfyJQLUiC@pennxchange.yxi0omk.mongodb.net/pennXchange?retryWrites=true&w=majority';

/**
 * This functionn connect to the database
 */
let client;
const connect = async () => {
  try{
    client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true});
    // console.log('Connecting to the database...', client.db().databaseName);
    await client.connect();
    // console.log('Connected to the database...', client.db().databaseName);
    return client;
  }
  catch(err){
    console.log(err);
  }
}

/**
 * This function close the connection to the database
 */

const close = async () => {
  try{
    await client.close();
    // console.log("Connection closed to the database...", client.db().databaseName);
    client = undefined;
  }
  catch(err){
    console.log(err);
  }
}

/**
 * Conncets to mongoDB and returns the DB
 */

// pass the client as a parameter
const getDB = async () => {
  // console.log('client undefined:', client === undefined);
  if(!client){
    client = await connect();
  }
  return client.db();
}

module.exports = {
  connect,
  close,
  getDB,
};
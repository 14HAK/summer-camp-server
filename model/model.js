const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const uri = process.env.MONGODB_CONNECTION_STRING;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});


const db = client.db('summer_camp');

const userCollection = db.collection('allUser');
const rawCoursesCollection = db.collection('raw_courses');
const cartCollection = db.collection('userCart');

module.exports = {
  userCollection,
  rawCoursesCollection,
  cartCollection,
}
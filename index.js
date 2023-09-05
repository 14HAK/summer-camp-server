const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const router = require('./router/router');




const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_CONNECTION_STRING;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get('/', (req, res) => {
  res.send('Summer-Camp-Server: Running...');
});



async function run() {
  try {
    await client.connect();
    app.use('/', router);
  } catch (error) {
    console.log(error.message);
  } finally {
    await client.close();
  }
}
run()

app.listen(port, () => {
  console.log(`server running at port: http://localhost:${port}`);
});








// // ----------------------------------------------

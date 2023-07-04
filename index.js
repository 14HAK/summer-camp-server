require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const uri = process.env.MONGODB_CONNECTION_STRING;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// jwt authenticate middleware function:
const verifyJWT = (req, res, next) => {
  const authorization = req?.headers?.authorization;
  // console.log(authorization);
  // console.log('------------');

  if (!authorization) {
    return res
      .status(400)
      .send({ error: true, message: 'authorization fails!' });
  }
  // bearer token:
  const token = authorization.split(' ')[1];
  // console.log(token);

  jwt.verify(token, process.env.ACCESS_TOKEN_CLIENT_SECRET, (err, decoded) => {
    if (err) {
      return res
        .status(400)
        .send({ error: true, message: 'authorization fails!' });
    }
    req.decoded = decoded;
    next();
  });
};

let connection;
// function read or write to database
async function run() {
  try {
    //
    // Connect the client to the server	(optional starting in v4.7)
    connection = await client.connect();
    //
    //
    // create collection
    const userCollection = client.db('summer_camp').collection('allUser');
    const rawCoursesCollection = client
      .db('summer_camp')
      .collection('raw_courses');
    //
    // jwt authentication create access token:
    app.post('/jwt', async (req, res) => {
      const userEmail = await req?.body;
      const token = jwt.sign(
        userEmail,
        process.env.ACCESS_TOKEN_CLIENT_SECRET,
        { expiresIn: '2h' }
      );
      // console.log(token);
      res.send({ token });
    });
    //
    //post all user information after user exist
    app.post('/alluser', async (req, res) => {
      const userMatched = await req?.body?.email;
      const query = { email: userMatched };
      const findUser = await userCollection.findOne(query);
      if (findUser) {
        res.status(406).send({ message: 'user not acceptable, already exist' });
      } else {
        const data = await req?.body;
        const result = await userCollection.insertOne(data);
        res.send(result);
      }
    });
    //
    //get single user:
    app.get('/alluser', verifyJWT, async (req, res) => {
      const userEmail = req?.query?.email;
      const decodedEmail = await req?.decoded?.email;

      if (userEmail !== decodedEmail) {
        return res
          .status(400)
          .send({ error: true, message: 'authorization fails!' });
      }

      const query = { email: userEmail };

      const result = await userCollection.findOne(query);
      // console.log(result);
      res.send(result);
    });
    //
    //add post req to post any course by instructor:
    app.post('/rawcourse', verifyJWT, async (req, res) => {
      const data = await req?.body;
      const result = await rawCoursesCollection.insertOne(data);
      console.log(result);

      res.send(result);
    });
    //
    //get all courses that add by instructor:
    app.get('/rawcourse', verifyJWT, async (req, res) => {
      const userEmail = req?.query?.email;

      const query = { instructor_email: userEmail };
      const result = await rawCoursesCollection.find(query).toArray();
      // console.log(result);

      res.send(result);
    });
    //
    //verify that admin is admin:
    const verifyAdmin = async (req, res, next) => {
      const userEmail = await req?.query?.email;
      const query = { email: userEmail };

      const findUser = await userCollection.findOne(query);

      if (findUser?.user_role !== 'admin') {
        return res
          .status(401)
          .send({ error: true, message: 'notfound, user is not an admin!' });
      } else {
        next();
      }
    };
    //
    //admin get all users:
    app.get('/manageUser', verifyJWT, verifyAdmin, async (req, res) => {
      const result = await userCollection.find({}).toArray();
      // console.log(result);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
    //
    //
    //admin manage course all users:
    app.get('/managecourse', verifyJWT, verifyAdmin, async (req, res) => {
      const result = await rawCoursesCollection.find({}).toArray();
      // console.log(result);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
    //
  } finally {
    // Ensures that the client will close when you finish/error
    // connection = await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`server running at port: http://localhost:${port}`);
});

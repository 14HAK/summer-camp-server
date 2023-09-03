const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { userCollection, rawCoursesCollection, cartCollection } = require('../model/model');

express.json()

const verifyUser = async (req, res) => {
  const userEmail = await req?.body;
  const token = jwt.sign(
    userEmail,
    process.env.ACCESS_TOKEN_CLIENT_SECRET,
    { expiresIn: '2h' }
  );
  // console.log(process.env.ACCESS_TOKEN_CLIENT_SECRET);
  // console.log(token)
  res.send({ token });
}

const verifyJWT = (req, res, next) => {
  const authorization = req?.headers?.authorization;

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

const getCourses = async (req, res) => {
  const query = { course_status: 'approved' };
  const result = await rawCoursesCollection.find(query).toArray();
  res.send(result);
}

const getSingleCourse = async (req, res) => {
  const courseId = req?.params?.id;
  console.log(courseId);
  const query = { _id: new ObjectId(courseId) };
  const result = await rawCoursesCollection.findOne(query);
  res.send(result).status(200);
}

const getInstructor = async (req, res) => {
  const result = await userCollection.find({}).toArray();
  res.send(result);
}

const postUser = async (req, res) => {
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
}

const getUser = async (req, res) => {
  const userEmail = req?.query?.email;
  const decodedEmail = await req?.decoded?.email;

  if (userEmail !== decodedEmail) {
    return res
      .status(400)
      .send({ error: true, message: 'authorization fails!' });
  }
  const query = { email: userEmail };
  const result = await userCollection.findOne(query);
  res.send(result);
}

const postCourse = async (req, res) => {
  const data = await req?.body;
  const result = await rawCoursesCollection.insertOne(data);
  console.log(result);
  res.send(result);
}

const getCourse = async (req, res) => {
  const userEmail = req?.query?.email;
  const query = { instructor_email: userEmail };
  const result = await rawCoursesCollection.find(query).toArray();
  res.send(result);
}

const manageUsers = async (req, res) => {
  const result = await userCollection.find({}).toArray();
  res.send(result);
}

const manageCourses = async (req, res) => {
  const result = await rawCoursesCollection.find({}).toArray();
  res.send(result);
}

const courseApproved = async (req, res) => {
  const id = req?.query?.id;
  const status = req?.params?.status;
  const filter = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updates = {
    $set: { course_status: status },
  };
  const result = await rawCoursesCollection.updateOne(
    filter,
    updates,
    options
  );
  res.send(result).status(200);
}

const addCart = async (req, res) => {
  const data = await req?.body;
  const result = await cartCollection.insertOne(data);
  res.send(result).status(200);
}

const getCart = async (req, res) => {
  const queryEmail = req?.query?.email;
  const result = await cartCollection.find({ email: queryEmail }).toArray();
  res.send(result).status(200);
}


module.exports = {
  verifyUser,
  verifyJWT,
  getCourses,
  getSingleCourse,
  addCart,
  getCart,
  getInstructor,
  postUser,
  getUser,
  postCourse,
  getCourse,
  verifyAdmin,
  manageUsers,
  manageCourses,
  courseApproved

}
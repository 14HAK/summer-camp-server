const express = require('express');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const { userCollection, rawCoursesCollection, cartCollection } = require('../model/model');


express.json()

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

const manageUsers = async (req, res) => {
  const result = await userCollection.find({}).toArray();
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




module.exports = {
  postUser,
  getUser,
  manageUsers,
  postCourse,
  getCourse,
  getCourses,
  getSingleCourse,
}
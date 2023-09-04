const express = require('express');
require('dotenv').config();
const { ObjectId } = require('mongodb');
const { userCollection, rawCoursesCollection, cartCollection } = require('../model/model');



express.json()


const getInstructor = async (req, res) => {
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
  addCart,
  getCart,
  getInstructor,
  manageCourses,
  courseApproved,
};
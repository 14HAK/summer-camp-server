const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { userCollection, rawCoursesCollection, cartCollection } = require('../model/model');

const stripe = require("stripe")(process.env.STRIP_SK);

express.json()


const stripPayment = async (req, res) => {
  const { totalPrice } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalPrice * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
}

const paymentHistory = async (req, res) => {
  res.send({ "paymentHistory": "success" })
}

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


module.exports = {
  stripPayment,
  paymentHistory,
  verifyUser,
  verifyJWT,
  verifyAdmin,
}
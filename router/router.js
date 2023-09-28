const express = require('express');

const { manageCourses, courseApproved, getCart, getInstructor, addCart, } = require('../controller/controller');
const { verifyUser, verifyJWT, verifyAdmin, stripPayment, paymentHistory, } = require('../controller/verify');

const { postUser, getUser, getCourses, getSingleCourse, postCourse, getCourse, manageUsers, deleteItem } = require('../controller/userController');

const router = express.Router();

router.post('/jwt', verifyUser);
router.get('/cart', verifyJWT, getCart);
router.post('/alluser', postUser);
router.get('/alluser', verifyJWT, getUser);
router.post('/rawcourse', verifyJWT, postCourse);
router.get('/rawcourse', verifyJWT, getCourse);
router.get('/manageUser', verifyJWT, verifyAdmin, manageUsers);
router.get('/managecourse', verifyJWT, verifyAdmin, manageCourses);
router.patch('/course-approved/:status', verifyJWT, courseApproved);
router.get('/courses', getCourses);
router.get('/course/details:id', getSingleCourse);
router.post('/addcart', verifyJWT, addCart);
router.get('/instructors', getInstructor);
router.post('/create-payment-intent', stripPayment);
router.get('/payhistory', paymentHistory);
router.delete('/delete/:id', deleteItem)





module.exports = router;



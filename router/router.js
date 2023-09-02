const express = require('express');
const { verifyUser, postUser, verifyJWT, getUser, postCourse, getCourse, verifyAdmin, manageUsers, manageCourses, courseApproved, getCourses, getCart, getInstructor, getSingleCourse, addCart } = require('../controller/controller');

const router = express.Router();

router.get('/courses', getCourses);
router.get('/course/details:id', getSingleCourse);
router.get('/instructors', getInstructor);
router.get('/jwt', verifyUser);
router.post('/alluser', postUser);
router.get('/alluser', verifyJWT, getUser);
router.post('/rawcourse', verifyJWT, postCourse);
router.get('/rawcourse', verifyJWT, getCourse);
router.get('/manageUser', verifyJWT, verifyAdmin, manageUsers);
router.get('/managecourse', verifyJWT, verifyAdmin, manageCourses);
router.patch('/course-approved/:status', verifyJWT, courseApproved);
router.post('/addcart', verifyJWT, addCart);
router.get('/cart', verifyJWT, getCart);


module.exports = router;



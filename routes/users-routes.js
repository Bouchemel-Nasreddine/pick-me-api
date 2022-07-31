const express = require('express');
const {check} = require('express-validator');

const usersController = require('../controllers/users-controller');
const fileUpload = require('../middleware/file-upload');
const check_auth = require('../middleware/check_auth');

const router = express.Router();

router.post('/register',
fileUpload.single('image'),
    [
        check('email').not().isEmpty().withMessage('Email is required'),
        check('email').isEmail().withMessage('Email is not valid'),
        check('password').not().isEmpty().withMessage('Password is required'),
        check('password').isLength({min: 8}).withMessage('Password must be at least 8 characters long'),
        // check('password').isLength({max: 24}).withMessage('Password must be at max 24 characters long'),        
        check('name').not().isEmpty().withMessage('Name is required'),
], 
    usersController.registerUser);

router.post('/login',
[
    check('email').not().isEmpty().withMessage('Email is required'),
    check('email').isEmail().withMessage('Email is not valid'),
    check('password').not().isEmpty().withMessage('Password is required'),
] , usersController.login);

router.use(  check_auth );

router.get('/users', usersController.getUsers);

router.get('/user/:id', usersController.getUserInfo);

module.exports = router;
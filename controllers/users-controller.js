const { validationResult } = require('express-validator');
const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');
const bcryptJs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpErrors = require('../models/http-error');
const { use } = require('../routes/users-routes');
const User = require('../models/users-schema');

const getUsers = async (req, res, next) => {

    const users = await User.find().exec();

    res.json({message: 'users fetched!', users: users});


 };

 const login = async (req, res, next) => {

    const result = validationResult(req);

    if (!result.isEmpty()) {
        res.status(422).json({ message: result.array()[0]["msg"]});
    }

    try {
        const user = await User.findOne({email: req.body.email});

        if (!user) {
            return next(new HttpErrors('User not found', 404));
        }

        let isValidPassword;

        try {
        isValidPassword = await bcryptJs.compare(req.body.password, user.password);
        } catch (err) {
            console.log(err);
            return next(new HttpErrors('Something went wrong, try again', 500));
        }

        if (!isValidPassword) {
            return next(new HttpErrors('Password is incorrect', 401));
        }

        // const token = user.generateToken();

        let token;
        
        try {
        token = jwt.sign( 
            { userId: user.id}, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
    } catch (err) {
        console.log(err);
        return next(new HttpErrors('Something went wrong, try again', 500));
    }

    const data = {
        'id': user.id,
        'email' : user.email,
        'name' : user.name,
    }

        res.json({message: 'user logged in!', token: token, user: data});

    } catch (error) {
        console.log(error);
        return next(new HttpErrors('Something went wrong', 500));
    }
 };

 const registerUser = async (req, res, next) => {
    console.log(req.body);
    let hashedPass;

    try {
        hashedPass = await bcryptJs.hash(req.body.password, 12);
    } catch (error) {
        console.log(error);
        return next(new HttpErrors('Something went wrong, try again', 500));
    }

    try {
        const createdUser = User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPass,
            image: 'http://localhost:5000/' + req.file.path.replace('\\', '/').replace('\\', '/')
        });

        const result = await createdUser.save();

        let token;

        try {
            token = jwt.sign( 
                { userId: createdUser.id}, 
                process.env.JWT_SECRET, 
                { expiresIn: '1h' }
            );
        } catch (err) {
            console.log(err);
            return next(new HttpErrors('Something went wrong, try again', 500));
        }

        
    const data = {
        'id': createdUser.id,
        'email' : createdUser.email,
        'name' : createdUser.name,
    }

        res.json({message: 'user registered!', token: token, user: data});
    } catch (error) {
        console.log(error);
        return next(new HttpErrors('Something went wrong, try again', 500));
    }
 };

 
const getUserInfo = async (req, res, next) => {

    const user = await User.findById(req.params.id).exec();

    const data = {
        'id': user.id,
        'email' : user.email,
        'name' : user.name,
        'image' : user.image,
    }

    console.log(user);

    res.json({message: 'user fetched!', users: data});


 };



 exports.getUsers = getUsers;
 exports.registerUser = registerUser;
 exports.login = login;    
 exports.getUserInfo = getUserInfo;
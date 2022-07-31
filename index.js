const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const usersRoutes = require('./routes/users-routes');
const HttpErrors = require('./models/http-error');

const PORT = process.env.PORT || '5000';

const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@pickmecluster.gjkcj78.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();


app.use(express.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

app.get('/', (req, res, next) => {
    res.send("welcome to <b>pick me</b> project by Nasro");
} );

app.use(usersRoutes);

app.use((req, res, next) => {
    throw new HttpErrors('Route Not found', 404);
});

app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        } );
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});
});



mongoose.connect(dbUrl).then(() => {
    console.log('Connected to MongoDB');
}).then( () => {
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
} ).catch((err) => {
    console.log(PORT);
});

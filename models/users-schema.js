const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 8  },
        image: { type: String},
    }
);

userSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', userSchema);
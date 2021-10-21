const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true, unique: true},
    first: String,
    last: String,
}, {
  timestamps: true
});

userSchema.set('toJSON', {
  transform: function (doc, ret) {
    // remove the password property when serializing doc to JSON
    delete ret.password;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
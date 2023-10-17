const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose); //adauga la UserSchema un field pt username si pt password, si adauga anumite functii care pot fi folosite ulterior

module.exports = mongoose.model('User', UserSchema);


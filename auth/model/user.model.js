//Khai bao mongoose
const mongoose = require('mongoose');
const { testConnection, UserConnection } = require('../helpers/connections_mutil_mongodb')
const bcrypt = require('bcrypt')
//Khai bao schema

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    require: true
  },
  password: {
    type: String,
    required: true,
  }
})

UserSchema.pre('save', async function (next) {
  try {
    //Su dung thuat tuan ma hoa / xu li truoc khi luu vao database
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt)
    this.password = hashPassword;
    next()

  } catch (error) {
    next(error);
  }
})

UserSchema.methods.isCheckPassword =async function(password) {
  try {
    return await bcrypt.compare(password, this.password)
  } catch (error) {
    next(error);
  }
}

module.exports = testConnection.model('users', UserSchema)

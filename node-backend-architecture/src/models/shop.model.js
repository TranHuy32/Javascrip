'use strict'

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Shop';
const COLECTION_NAME = "Shops";

var shopSchema = new Schema({
  name: {
    type: String,
    trim: true,
    maxLength: 150,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },

  password: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: "inactive"
  },

  verify: {
    type: Schema.Types.Boolean,
    default: false
  },

  roles: {
    type: Array,
    default: []
  },

}, {
  collection: COLECTION_NAME,
  timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);
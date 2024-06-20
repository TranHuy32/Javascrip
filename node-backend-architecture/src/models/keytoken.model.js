
'use strict'

const { model, Schema, Types } = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLECTION_NAME = "Keys";

var keyTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "Shop"
  },

  publicKey: {
    type: String,
    required: true,
  },

  privateKey: {
    type: String,
    required: true,
  },

  refreshTokensUsed: {
    type: Array,
    default: [] // nhung RT nay da dc su dung
  },

  refreshToken: {
    type: String,
    required: true,
  },

}, {
  collection: COLECTION_NAME,
  timestamps: true
});

//Export the model
module.exports = model(DOCUMENT_NAME, keyTokenSchema);
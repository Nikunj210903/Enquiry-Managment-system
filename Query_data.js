var mongoose = require('mongoose');

var Query_data = mongoose.model('Query_data', {
  Name: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state:{
    type:String,
  },
  zip: {
    type: String,
  },
  contact_no: {
    type: String,
  },
  country: {
    type: String,
  },
  dob:{
    type:String,
  },
  email: {
    type: String,
  },
  ed: {
    type: String,
  },
  un: {
    type: String,
  },
  yop:{
    type:String,
  },
  ans1: {
    type: String,
  },
  ans2:{
    type:String,
  },
  Answer:{
    type:String,
  }
});

module.exports = {Query_data};

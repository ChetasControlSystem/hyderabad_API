const mongoose = require('mongoose');

const KnrSpareAdvm = mongoose.Schema(
  {
    D1:{
        type : Number,
        require : true
    },
    D2:{
        type : Number,
        require : true
    },
    D3:{
        type : Number,
        require : true
    },
    D4:{
        type : Number,
        require : true
    },
    D5:{
        type : Number,
        require : true
    },
   D6:{
        type : Number,
        require : true
    },
   D7:{
        type : Number,
        require : true
    },
   D8:{
        type : Number,
        require : true
    },
   D9:{
        type : Number,
        require : true
    },
   D10:{
        type : Number,
        require : true
    },
   D11:{
        type : Number,
        require : true
    },
   D12:{
        type : Number,
        require : true
    },
   D13:{
        type : Number,
        require : true
    },
   D14:{
        type : Number,
        require : true
    },
   D15:{
        type : Number,
        require : true
    },
   D16:{
        type : Number,
        require : true
    },
   D17:{
        type : Number,
        require : true
    },
   D18:{
        type : Number,
        require : true
    },
   D19:{
        type : Number,
        require : true
    },
   D20:{
        type : Number,
        require : true
    },
    D21: {
        type: Number,
        require: true
    },
    D22: {
        type: Number,
        require: true
    },
    D23: {
        type: Number,
        require: true
    },
    D24: {
        type: Number,
        require: true
    },
    D25: {
        type: Number,
        require: true
    },
    D26: {
        type: Number,
        require: true
    },
    D27: {
        type: Number,
        require: true
    },
    D28: {
        type: Number,
        require: true
    },
    D29: {
        type: Number,
        require: true
    },
    D30: {
        type: Number,
        require: true
    },

    D31: {
        type: Number,
        require: true
    },
    D32: {
        type: Number,
        require: true
    },
    D33: {
        type: Number,
        require: true
    },
    D34: {
        type: Number,
        require: true
    },
    D35: {
        type: Number,
        require: true
    },
    D36: {
        type: Number,
        require: true
    },
    D37: {
        type: Number,
        require: true
    },
    D38: {
        type: Number,
        require: true
    },
    D39: {
        type: Number,
        require: true
    },
    D40: {
        type: Number,
        require: true
    },
    D41: {
        type: Number,
        require: true
    },
    D42: {
        type: Number,
        require: true
    },
    dateTime:{
        type: Date,
        require : true
    },
  },
  {
    timestamps: true, versionKey: false
  }
);


const SDO = mongoose.model('Knr_Spare_Advm', KnrSpareAdvm);

module.exports = SDO;

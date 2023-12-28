const mongoose = require('mongoose');

const knrDamOverviewDischarge = mongoose.Schema(
  {
    gate1Discharge:{
        type : Number,
        require : true
    },
   gate2Discharge:{
        type : Number,
        require : true
    },
   gate3Discharge:{
        type : Number,
        require : true
    },
   gate4Discharge:{
        type : Number,
        require : true
    },
   gate5Discharge:{
        type : Number,
        require : true
    },
   gate6Discharge:{
        type : Number,
        require : true
    },
   gate7Discharge:{
        type : Number,
        require : true
    },
   gate8Discharge:{
        type : Number,
        require : true
    },
   gate9Discharge:{
        type : Number,
        require : true
    },
   gate10Discharge:{
        type : Number,
        require : true
    },
   gate11Discharge:{
        type : Number,
        require : true
    },
   gate12Discharge:{
        type : Number,
        require : true
    },
   gate13Discharge:{
        type : Number,
        require : true
    },
   gate14Discharge:{
        type : Number,
        require : true
    },
   gate15Discharge:{
        type : Number,
        require : true
    },
   gate16Discharge:{
        type : Number,
        require : true
    },
   gate17Discharge:{
        type : Number,
        require : true
    },
   gate18Discharge:{
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


const SDO = mongoose.model('knr_Dam_Overview_Discharge', knrDamOverviewDischarge);

module.exports = SDO;

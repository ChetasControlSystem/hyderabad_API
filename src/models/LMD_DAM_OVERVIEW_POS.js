const mongoose = require('mongoose');

const LmdDamOverviewPosition = mongoose.Schema(
  {
    gate1Position:{
        type : Number,
        require : true
    },
   gate2Position:{
        type : Number,
        require : true
    },
   gate3Position:{
        type : Number,
        require : true
    },
   gate4Position:{
        type : Number,
        require : true
    },
   gate5Position:{
        type : Number,
        require : true
    },
   gate6Position:{
        type : Number,
        require : true
    },
   gate7Position:{
        type : Number,
        require : true
    },
   gate8Position:{
        type : Number,
        require : true
    },
   gate9Position:{
        type : Number,
        require : true
    },
   gate10Position:{
        type : Number,
        require : true
    },
   gate11Position:{
        type : Number,
        require : true
    },
   gate12Position:{
        type : Number,
        require : true
    },
   gate13Position:{
        type : Number,
        require : true
    },
   gate14Position:{
        type : Number,
        require : true
    },
   gate15Position:{
        type : Number,
        require : true
    },
   gate16Position:{
        type : Number,
        require : true
    },
   gate17Position:{
        type : Number,
        require : true
    },
   gate18Position:{
        type : Number,
        require : true
    },
   gate19Position:{
        type : Number,
        require : true
    },
   gate20Position:{
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


const SDO = mongoose.model('Lmd_Dam_Overview_Position', LmdDamOverviewPosition);

module.exports = SDO;

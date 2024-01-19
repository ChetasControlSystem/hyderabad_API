const mongoose = require('mongoose');
const moment = require('moment');

const SanjayHrDamOverviewDich = mongoose.Schema(
    {
        hrkGate1Discharge: {
            type: Number,
            require: true
        },
        hrkGate2Discharge: {
            type: Number,
            require: true
        },
        hrkGate3Discharge: {
            type: Number,
            require: true
        },
        hrkGate4Discharge: {
            type: Number,
            require: true
        },
        hrsGate1Discharge: {
            type: Number,
            require: true
        },
        hrsGate2Discharge: {
            type: Number,
            require: true
        },
        hrfGate1Discharge: {
            type: Number,
            require: true
        },
        hrfGate2Discharge: {
            type: Number,
            require: true
        },
        hrfGate3Discharge: {
            type: Number,
            require: true
        },
        hrfGate4Discharge: {
            type: Number,
            require: true
        },
        hrfGate5Discharge: {
            type: Number,
            require: true
        },
        hrfGate6Discharge: {
            type: Number,
            require: true
        },
        hrlManGate1Discharge: {
            type: Number,
            require: true
        },
        hrlManGate2Discharge: {
            type: Number,
            require: true
        },
        D15: {
            type: Number,
            require: true
        },
        D16: {
            type: Number,
            require: true
        },
        D17: {
            type: Number,
            require: true
        },
        D18: {
            type: Number,
            require: true
        },
        D19: {
            type: Number,
            require: true
        },
        D20: {
            type: Number,
            require: true
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
        dateTime: {
            type: Date,
            require: true
        },
        date: {
            type: String,
            // required: true
        },
        time: {
            type: String,
            // required: true
        },
        year: {
            type: Number,
            // required: true
        },
        week: {
            type: Number,
            // required: true
        },
        month: {
            type: Number,
            // required: true
        },
        quarter: {
            type: Number,
            // required: true
        },
    },
    {
        timestamps: true, versionKey: false
    }
);

// SanjayHrDamOverviewDich.pre('save', function (next) {
//     console.log('Middleware triggered!');
//     this.date = moment(this.dateTime).format('YYYY-MM-DD');
//     this.time = moment(this.dateTime).format('HH:mm:ss');
//     this.year = moment(this.dateTime).year();
//     this.week = moment(this.dateTime).week();
//     this.month = moment(this.dateTime).month() + 1;
//     this.quarter = moment(this.dateTime).quarter();
//     next();
// });


const SDO = mongoose.model('Sanjay_Hr_Dam_Overview_Discharge', SanjayHrDamOverviewDich);

module.exports = SDO;

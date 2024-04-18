const mongoose = require('mongoose');
const moment = require('moment');

const SanjayDamPondLevel = mongoose.Schema(
    {
        inflow1Level: {
            type: Number,
            require: true
        },
        inflow2Level: {
            type: Number,
            require: true
        },
        D3: {
            type: Number,
            require: true
        },
        inflow1Discharge: {
            type: Number,
            require: true
        },
        inflow2Discharge: {
            type: Number,
            require: true
        },
        D6: {
            type: Number,
            require: true
        },
        damDownstreamLevel: {
            type: Number,
            require: true
        },
        damDownstreamDischarge: {
            type: Number,
            require: true
        },
        hrkDownstreamLevel: {
            type: Number,
            require: true
        },
        hrkDownstreamDischarge: {
            type: Number,
            require: true
        },
        hrsDownstreamLevel: {
            type: Number,
            require: true
        },
        hrsDownstreamDischarge: {
            type: Number,
            require: true
        },
        hrfDownstreamLevel: {
            type: Number,
            require: true
        },
        hrfDownstreamDischarge: {
            type: Number,
            require: true
        },
        hrlDownstreamLevel: {
            type: Number,
            require: true
        },
        hrlDownstreamDischarge: {
            type: Number,
            require: true
        },
        liveCapacity: {
            type: Number,
            require: true
        },
        grossStorage: {
            type: Number,
            require: true
        },
        catchmentArea: {
            type: Number,
            require: true
        },
        contourArea: {
            type: Number,
            require: true
        },
        ayacutArea: {
            type: Number,
            require: true
        },
        filling: {
            type: Number,
            require: true
        },
        fullReservoirLevel: {
            type: Number,
            require: true
        },
        instantaneousGateDischarge: {
            type: Number,
            require: true
        },
        instantaneousCanalDischarge: {
            type: Number,
            require: true
        },
        totalDamDischarge: {
            type: Number,
            require: true
        },
        cumulativeDamDischarge: {
            type: Number,
            require: true
        },
        pondLevel: {
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
            require: true,
            index : true
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

// SanjayDamPondLevel.pre('save', function (next) {
//     console.log('Middleware triggered!');
//     this.date = moment(this.dateTime).format('YYYY-MM-DD');
//     this.time = moment(this.dateTime).format('HH:mm:ss');
//     this.year = moment(this.dateTime).year();
//     this.week = moment(this.dateTime).week();
//     this.month = moment(this.dateTime).month() + 1;
//     this.quarter = moment(this.dateTime).quarter();
//     next();
// });

SanjayDamPondLevel.index({dateTime : 1})
const SDO = mongoose.model('Sanjay_Dam_Pond_Level_Overview', SanjayDamPondLevel);

module.exports = SDO;

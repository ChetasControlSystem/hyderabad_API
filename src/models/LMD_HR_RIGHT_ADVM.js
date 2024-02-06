const mongoose = require('mongoose');

const lmdHrDamRightAdvm = mongoose.Schema(
    {
        hrrFlowRate: {
            type: Number,
            require: true
        },
        hrrTotalizer: {
            type: Number,
            require: true
        },
        hrrCDQ: {
            type: Number,
            require: true
        },
        hrrLDQ: {
            type: Number,
            require: true
        },
        hrrMQ: {
            type: Number,
            require: true
        },
        hrrVelocity: {
            type: Number,
            require: true
        },
        hrrAdvmSpare1: {
            type: Number,
            require: true
        },
        hrrAdvmSpare2: {
            type: Number,
            require: true
        },
        hrrAdvmSpare3: {
            type: Number,
            require: true
        },
        hrrAdvmSpare4: {
            type: Number,
            require: true
        },
        hrrAdvmSpare5: {
            type: Number,
            require: true
        },
        hrrAdvmSpare6: {
            type: Number,
            require: true
        },
        D13: {
            type: Number,
            require: true
        },
        D14: {
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

lmdHrDamRightAdvm.index({dateTime : 1})
const SDO = mongoose.model('lmd_Hr_Dam_Right_Advm', lmdHrDamRightAdvm);

module.exports = SDO;

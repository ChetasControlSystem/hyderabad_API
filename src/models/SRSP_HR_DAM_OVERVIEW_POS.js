const mongoose = require('mongoose');

const SanjayHrDamOverviewPos = mongoose.Schema(
    {
        hrkGate1Position: {
            type: Number,
            require: true
        },
        hrkGate2Position: {
            type: Number,
            require: true
        },
        hrkGate3Position: {
            type: Number,
            require: true
        },
        hrkGate4Position: {
            type: Number,
            require: true
        },
        hrsGate1Position: {
            type: Number,
            require: true
        },
        hrsGate2Position: {
            type: Number,
            require: true
        },
        hrfGate1Position: {
            type: Number,
            require: true
        },
        hrfGate2Position: {
            type: Number,
            require: true
        },
        hrfGate3Position: {
            type: Number,
            require: true
        },
        hrfGate4Position: {
            type: Number,
            require: true
        },
        hrfGate5Position: {
            type: Number,
            require: true
        },
        hrfGate6Position: {
            type: Number,
            require: true
        },
        hrlManGate1Position: {
            type: Number,
            require: true
        },
        hrlManGate2Position: {
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
        }
    },
    {
        timestamps: true, versionKey: false
    }
);

SanjayHrDamOverviewPos.index({dateTime : 1})
const SDO = mongoose.model('Sanjay_Hr_Dam_Overview_Position', SanjayHrDamOverviewPos);

module.exports = SDO;

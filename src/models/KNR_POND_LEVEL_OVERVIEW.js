const mongoose = require('mongoose');

const knrPondLevelOverview = mongoose.Schema(
    {
        inflow1Level: {
            type: Number,
            require: true
        },
        inflow2Level: {
            type: Number,
            require: true
        },
        inflow3Level: {
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
        inflow3Discharge: {
            type: Number,
            require: true
        },
        damOuflowLevel: {
            type: Number,
            require: true
        },
        damOuflowDischarge: {
            type: Number,
            require: true
        },
        hrrDownstreamLevel: {
            type: Number,
            require: true
        },
        hrrDownstreamDischarge: {
            type: Number,
            require: true
        },
        D11: {
            type: Number,
            require: true
        },
        D12: {
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

const SDO = mongoose.model('knr_Pond_Level_Overview', knrPondLevelOverview);

module.exports = SDO;

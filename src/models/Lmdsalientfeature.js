const mongoose = require('mongoose');

const LmdSalientFeature = mongoose.Schema(
    {
       
        location: {
            type: String
        },
        typeofGates: {
            type: String
        },
        designDischargeCapacityOfSpillway: {
            type: String
        },
        noAndSizeOfGates: {
            type: String
        },
        lengthOfDamAtTopTotal_M: {
            type: String
        },
        maximumWaterLevel_MWL: {
            type: String
        },
        fullReservoirLevel_FRL: {
            type: String
        },
        spillwayCrestLevel: {
            type: String
        },
        minimumDrawdownlevel_MDDL: {
            type: String
        },
        operationOfGates: {
            type: String
        },
        aCMotorOnGates: {
            type: String
        },
        powerSupplyAvailAbility: {
            type: String
        },
        existingStarterPanelDetails: {
            type: String
        },
        anyExistingGateSensors: {
            type: String
        },
        anyExistingLevelSensorForMonitoringDam: {
            type: String
        },
        locationAndDistanceOfControlRoomFrom: {
            type: String
        },
        hrLocation: {
            type: String
        },
        hrTypeGates: {
            type: String
        },
        hrNoAndSizeOfGatesWesternRMC_HR : {
            type: String
        },
        hrBedLevelAtEastern_WesternHead: {
            type: String
        },
        hrFSLLevelEastern_WesternHeadRegulator: {
            type: String
        },
        hrDesignDischargeCapacityCusecs: {
            type: String
        },
        hrOperationOfGatesACMotorsOnGates: {
            type: String
        },
        hrPowerSupplyAvailabilityDistanceOfHeadRegulators: {
            type: String
        },
        hrDesignDischargeCapacity: {
            type: String
        },
        hrDistanceOfHeadRegulatorsFromDam: {
            type: String
        },
        Inflow1: {
            type: String
        },
        Inflow2: {
            type: String
        },
        Inflow3: {
            type: String
        },
        Outflow:{
            type : String
        }
    },
    {
        timestamps: true, versionKey: false
    }
);


const SDO = mongoose.model('LmdSalientFeature', LmdSalientFeature);

module.exports = SDO;

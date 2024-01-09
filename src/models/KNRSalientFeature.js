const mongoose = require('mongoose');

const KNRSalientFeature = mongoose.Schema(
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
        locationAndDistanceOfControlRoomFromDamGate: {
            type: String
        },
        hrLeftBankLocation: {
            type: String
        },
        hrLeftBankTypeGates: {
            type: String
        },
        hrLeftBankNoAndSizeOfGatesWesternRMC_HR : {
            type: String
        },
        hrLeftBankBedLevelAtEastern_WesternHead: {
            type: String
        },
        hrLeftBankFSLLevelEastern_WesternHeadRegulator: {
            type: String
        },
        hrLeftBankDesignDischargeCapacityCusecs: {
            type: String
        },
        hrLeftBankOperationOfGatesACMotorsOnGates: {
            type: String
        },
        hrLeftBankPowerSupplyAvailabilityDistanceOfHeadRegulators: {
            type: String
        },
        hrLeftBankDistanceOfHeadRegulatorsFromDam: {
            type: String
        },
        hrRightBankLocation: {
            type: String
        },
        hrRightBankTypeGates: {
            type: String
        },
        hrRightBankNoAndSizeOfGatesWesternRMC_HR : {
            type: String
        },
        hrRightBankBedLevelAtEastern_WesternHead: {
            type: String
        },
        hrRightBankFSLLevelEastern_WesternHeadRegulator: {
            type: String
        },
        hrRightBankDesignDischargeCapacityCusecs: {
            type: String
        },
        hrRightBankOperationOfGatesACMotorsOnGates: {
            type: String
        },
        hrRightBankPowerSupplyAvailabilityDistanceOfHeadRegulators: {
            type: String
        },
        hrRightBankDistanceOfHeadRegulatorsFromDam: {
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
        Outflow: {
            type: String
        },
    },
    {
        timestamps: true, versionKey: false
    }
);


const SDO = mongoose.model('KNR_SalientFeature', KNRSalientFeature);

module.exports = SDO;

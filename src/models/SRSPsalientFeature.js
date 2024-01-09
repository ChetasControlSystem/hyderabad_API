const mongoose = require('mongoose');

const SrspSalientFeature = mongoose.Schema(
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
        hrKakatiyaLocation: {
            type: String
        },
        hrKakatiyaTypeGates: {
            type: String
        },
        hrKakatiyaNoAndSizeOfGatesWesternRMC_HR : {
            type: String
        },
        hrKakatiyaBedLevelAtEastern_WesternHead: {
            type: String
        },
        hrKakatiyaFSLLevelEastern_WesternHeadRegulator: {
            type: String
        },
        hrKakatiyaDesignDischargeCapacityCusecs: {
            type: String
        },
        hrKakatiyaOperationOfGates: {
            type: String
        },
        hrKakatiyaACMotorsOnGates: {
            type: String
        },
        hrKakatiyaPowerSupplyAvailability: {
            type: String
        },
        hrKakatiyaDistanceOfHeadRegulatorsFromDam: {
            type: String
        },
        hrKakatiyaBedwidthofcanal: {
            type: String
        },
        hrFloodFlowLocation: {
            type: String
        },
        hrFloodFlowTypeGates: {
            type: String
        },
        hrFloodFlowNoAndSizeOfGatesWesternRMC_HR : {
            type: String
        },
        hrFloodFlowBedLevelAtEastern_WesternHead: {
            type: String
        },
        hrFloodFlowFSLLevelEastern_WesternHeadRegulator: {
            type: String
        },
        hrFloodFlowDesignDischargeCapacityCusecs: {
            type: String
        },
        hrFloodFlowOperationOfGatesACMotorsOngates: {
            type: String
        },
        hrFloodFlowPowerSupplyAvailabilityDistanceOfHeadRegulators: {
            type: String
        },
        hrFloodFlowDesignDischargeCapacity: {
            type: String
        },
        hrFloodFlowDistanceOfHeadRegulatorsFromDam: {
            type: String
        },
        hrFloodFlowBedwidthofcanal: {
            type: String
        },
        hrSaraswatiLocation: {
            type: String
        },
        hrSaraswatiTypeGates: {
            type: String
        },
        hrSaraswatiNoAndSizeOfGatesWesternRMC_HR : {
            type: String
        },
        hrSaraswatiBedLevelAtEastern_WesternHead: {
            type: String
        },
        hrSaraswatiFSLLevelEastern_WesternHeadRegulator: {
            type: String
        },
        hrSaraswatiDesignDischargeCapacityCusecs: {
            type: String
        },
        hrSaraswatiOperationOfGates: {
            type: String
        },
        hrSaraswatiACMotorsOngates: {
            type: String
        },
        hrSaraswatiPowerSupplyAvailability: {
            type: String
        },
        hrSaraswatiDistanceOfHeadRegulatorsFromDam: {
            type: String
        },
        hrLakshmiLocation: {
            type: String
        },
        hrLakshmiTypeGates: {
            type: String
        },
        hrLakshmiNoAndSizeOfGatesWesternRMC_HR : {
            type: String
        },
        hrLakshmiBedLevelAtEastern_WesternHead: {
            type: String
        },
        hrLakshmiFSLLevelEastern_WesternHeadRegulator: {
            type: String
        },
        hrLakshmiDesignDischargeCapacityCusecs: {
            type: String
        },
        hrLakshmiOperationOfGates: {
            type: String
        },
        hrLakshmiACMotorsOngates: {
            type: String
        },
        hrLakshmiPowerSupplyAvailability: {
            type: String
        },
        hrLakshmiDistanceOfHeadRegulatorsFromDam: {
            type: String
        },
        Inflow1: {
            type: String
        },
        Inflow2: {
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


const SDO = mongoose.model('SrspSalientFeature', SrspSalientFeature);

module.exports = SDO;

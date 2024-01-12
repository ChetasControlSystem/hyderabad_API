const httpStatus = require('http-status');
const { LMDS, LMD_POND_LEVEL_OVERVIEW, LMD_HR_RIGHT_ADVM, LMD_HR_DAM_OVERVIEW_POS, LMD_HR_DAM_OVERVIEW_DICH, LMD_DAM_OVERVIEW_POS, LMD_DAM_OVERVIEW_DICH } = require('../models');

const ApiError = require('../utils/ApiError');


const createSalientFeature = async (userBody) => {
    try {
      return LMDS.create(userBody);
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  const getSalientFeature = async()=>{
    try {
        const showOneSalientFeature = await LMDS.findOne();
        return showOneSalientFeature
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message); 
    }
  }



  const getLastDataLmdDamPondLevelOverview = async () => {
    try {
      const getLastDataLmdDamPondLevelOverview = await LMD_POND_LEVEL_OVERVIEW.findOne()
      .select("pondLevel liveCapacIty grossStorage fullReservoirLevel contourArea catchmentArea ayacutArea filling instantaneousGateDischarge instantaneousCanalDischarge totalDamDischarge cumulativeDamDischarge inflow1Level inflow2Level inflow3Level inflow1Discharge inflow2Discharge inflow3Discharge damDownstreamLevel damDownstreamDischarge hrrDownstreamLevel hrrDownstreamDischarge")
      .sort({ dateTime: -1 });
      return getLastDataLmdDamPondLevelOverview
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
  
  const getLastDataLmdDamOverviewPos = async () => {
    try {
      const getLastDataLmdDamOverviewPos = await LMD_DAM_OVERVIEW_POS.findOne()
      .select("gate1Position gate2Position gate3Position gate4Position gate5Position gate6Position gate7Position gate8Position gate9Position gate10Position gate11Position gate12Position gate13Position gate14Position gate15Position gate16Position gate17Position gate18Position gate19Position gate20Position")
      .sort({ dateTime: -1 });
      return getLastDataLmdDamOverviewPos
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
  
  const getLastDataLmdDamOverviewDish = async () => {
    try {
      const getLastDataLmdDamOverviewDish = await LMD_DAM_OVERVIEW_DICH.findOne()
      .select("gate1Discharge gate2Discharge gate3Discharge gate4Discharge gate5Discharge gate6Discharge gate7Discharge gate8Discharge gate9Discharge gate10Discharge gate11Discharge gate12Discharge gate13Discharge gate14Discharge gate15Discharge gate16Discharge gate17Discharge gate18Discharge  gate19Discharge gate20Discharge")
      .sort({ dateTime: -1 });
      return getLastDataLmdDamOverviewDish
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
  
  const getLastDataLmdHrDamOverviewPos = async () => {
    try {
      const getLastDataLmdHrDamOverviewPos = await LMD_HR_DAM_OVERVIEW_POS.findOne()
      .select("hrrGate1Position hrrGate2Position")
      .sort({ dateTime: -1 });
      return getLastDataLmdHrDamOverviewPos
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
  
  const getLastDataLmdHrDamOverviewDish = async () => {
    try {
      const getLastDataLmdHrDamOverviewDish = await LMD_HR_DAM_OVERVIEW_DICH.findOne()
      .select("hrrGate1Discharge hrrGate2Discharge")
      .sort({ dateTime: -1 });
      return getLastDataLmdHrDamOverviewDish
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }
   
  const getLastDataLmdDamSpareAdvm = async () => {
    try {
      const getLastDataLmdDamSpareAdvm = await LMD_HR_RIGHT_ADVM.findOne().sort({ dateTime: -1 });
      return getLastDataLmdDamSpareAdvm
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }



  module.exports = {
    createSalientFeature,
    getSalientFeature,
    getLastDataLmdDamPondLevelOverview,
    getLastDataLmdDamOverviewPos,
    getLastDataLmdDamOverviewDish,
    getLastDataLmdHrDamOverviewPos,
    getLastDataLmdHrDamOverviewDish,
    getLastDataLmdDamSpareAdvm
  };
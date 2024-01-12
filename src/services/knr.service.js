const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const { KNRS, KNR_DAM_OVERVIEW_DICH, KNR_DAM_OVERVIEW_POS, KNR_HR_DAM_OVERVIEW_DICH, KNR_HR_DAM_OVERVIEW_POS,
  KNR_POND_LEVEL_OVERVIEW, KNR_SPARE_ADVM } = require('../models');


const createSalientFeature = async (userBody) => {
  try {
    return KNRS.create(userBody);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}

const getSalientFeature = async () => {
  try {
    const showOneSalientFeature = await KNRS.findOne();
    return showOneSalientFeature
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}


const getLastDataKadamDamPondLevelOverview = async () => {
  try {
    const getLastDataKadamDamPondLevelOverview = await KNR_POND_LEVEL_OVERVIEW.findOne()
    .select("pondLevel liveCapacIty grossStorage fullReservoirLevel contourArea catchmentArea ayacutArea filling instantaneousGateDischarge instantaneousCanalDischarge totalDamDischarge cumulativeDamDischarge")
    .sort({ dateTime: -1 });
console.log(getLastDataKadamDamPondLevelOverview);
    return getLastDataKadamDamPondLevelOverview
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}

const getLastDataKadamDamOverviewPos = async () => {
  try {
    const getLastDataKadamDamOverviewPos = await KNR_DAM_OVERVIEW_POS.findOne()
    .select("gate1Position gate2Position gate3Position gate4Position gate5Position gate6Position gate7Position gate8Position gate9Position gate10Position gate11Position gate12Position gate13Position gate14Position gate15Position gate16Position gate17Position gate18Position")
    .sort({ dateTime: -1 });
    return getLastDataKadamDamOverviewPos
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}

const getLastDataKadamDamOverviewDish = async () => {
  try {
    const getLastDataKadamDamOverviewDish = await KNR_DAM_OVERVIEW_DICH.findOne()
    .select("gate1Discharge gate2Discharge gate3Discharge gate4Discharge gate5Discharge gate6Discharge gate7Discharge gate8Discharge gate9Discharge gate10Discharge gate11Discharge gate12Discharge gate13Discharge gate14Discharge gate15Discharge gate16Discharge gate17Discharge gate18Discharge")
    .sort({ dateTime: -1 });
    return getLastDataKadamDamOverviewDish
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}

const getLastDataKadamHrDamOverviewPos = async () => {
  try {
    const getLastDataKadamHrDamOverviewPos = await KNR_HR_DAM_OVERVIEW_POS.findOne()
    .select("hrklManGate1Position hrklManGate2Position hrklManGate3Position hrklManGate4Position hrklManGate5Position")
    .sort({ dateTime: -1 });
    return getLastDataKadamHrDamOverviewPos
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}

const getLastDataKadamHrDamOverviewDish = async () => {
  try {
    const getLastDataKadamHrDamOverviewDish = await KNR_HR_DAM_OVERVIEW_DICH.findOne()
    .select("hrklManGate1Discharge hrklManGate2Discharge hrklManGate3Discharge hrklManGate4Discharge hrklManGate5Discharge")
    .sort({ dateTime: -1 });
    return getLastDataKadamHrDamOverviewDish
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}


const getLastDataKadamDamSpareAdvm = async () => {
  try {
    const getLastDataKadamDamSpareAdvm = await KNR_SPARE_ADVM.findOne().sort({ dateTime: -1 });
    return getLastDataKadamDamSpareAdvm
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}


module.exports = {
  createSalientFeature,
  getSalientFeature,
  getLastDataKadamDamOverviewDish,
  getLastDataKadamDamOverviewPos,
  getLastDataKadamHrDamOverviewDish,
  getLastDataKadamHrDamOverviewPos,
  getLastDataKadamDamPondLevelOverview,
  getLastDataKadamDamSpareAdvm
};
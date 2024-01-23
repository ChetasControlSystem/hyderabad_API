const httpStatus = require('http-status');
const {
  SRSPS,
  SRSP_HR_DAM_OVERVIEW_DICH,
  SRSP_HR_DAM_OVERVIEW_POS,
  SRSP_HR_KAKATIYA_ADVM,
  SRSP_POND_LEVEL_OVERVIEW,
  SRSP_SSD_DAM_OVERVIEW_DICH,
  SRSP_SSD_DAM_OVERVIEW_POS,
} = require('../models');
const ApiError = require('../utils/ApiError');

const createSalientFeature = async (userBody) => {
  try {
    return SRSPS.create(userBody);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getSalientFeature = async () => {
  try {
    const showOneSalientFeature = await SRSPS.findOne();
    return showOneSalientFeature;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataSrspDamPondLevelOverview = async () => {
  try {
    const getLastDataSrspDamPondLevelOverview = await SRSP_POND_LEVEL_OVERVIEW.findOne()
      .select(
        'pondLevel liveCapacity grossStorage fullReservoirLevel contourArea catchmentArea ayacutArea filling instantaneousGateDischarge instantaneousCanalDischarge totalDamDischarge cumulativeDamDischarge inflow1Level inflow2Level inflow1Discharge inflow2Discharge damDownstreamLevel damDownstreamDischarge'
      )
      .sort({ dateTime: -1 });
    return getLastDataSrspDamPondLevelOverview;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataSrspDamOverviewPos = async () => {
  try {
    const getLastDataSrspDamOverviewPos = await SRSP_SSD_DAM_OVERVIEW_POS.findOne()
      .select(
        'gate1Position gate2Position gate3Position gate4Position gate5Position gate6Position gate7Position gate8Position gate9Position gate10Position gate11Position gate12Position gate13Position gate14Position gate15Position gate16Position gate17Position gate18Position gate19Position gate20Position gate21Position gate22Position gate23Position gate24Position gate25Position gate26Position gate27Position gate28Position gate29Position gate30Position gate31Position gate32Position gate33Position gate34Position gate35Position gate36Position gate37Position gate38Position gate39Position gate40Position gate41Position gate42Position'
      )
      .sort({ dateTime: -1 });
    return getLastDataSrspDamOverviewPos;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataSrspDamOverviewDish = async () => {
  try {
    const getLastDataSrspDamOverviewDish = await SRSP_SSD_DAM_OVERVIEW_DICH.findOne()
      .select(
        'gate1Discharge gate2Discharge gate3Discharge gate4Discharge gate5Discharge gate6Discharge gate7Discharge gate8Discharge gate9Discharge gate10Discharge gate11Discharge gate12Discharge gate13Discharge gate14Discharge gate15Discharge gate16Discharge gate17Discharge gate18Discharge gate19Discharge gate20Discharge gate21Discharge gate22Discharge gate23Discharge gate24Discharge gate25Discharge gate26Discharge gate27Discharge gate28Discharge gate29Discharge gate30Discharge gate31Discharge gate32Discharge gate33Discharge gate34Discharge gate35Discharge gate36Discharge gate37Discharge gate38Discharge gate39Discharge gate40Discharge gate41Discharge gate42Discharge'
      )
      .sort({ dateTime: -1 });
    return getLastDataSrspDamOverviewDish;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataSrspHrDamOverviewPos = async () => {
  try {
    const getLastDataSrspHrDamOverviewPos = await SRSP_HR_DAM_OVERVIEW_POS.findOne()
      .select(
        'hrkGate1Position hrkGate2Position hrkGate3Position hrkGate4Position hrsGate1Position hrsGate2Position hrfGate1Position hrfGate2Position hrfGate3Position hrfGate4Position hrfGate5Position hrfGate6Position hrlManGate1Position hrlManGate2Position'
      )
      .sort({ dateTime: -1 });
    return getLastDataSrspHrDamOverviewPos;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataSrspHrDamOverviewDish = async () => {
  try {
    const getLastDataSrspHrDamOverviewDish = await SRSP_HR_DAM_OVERVIEW_DICH.findOne()
      .select(
        'hrkGate1Discharge hrkGate2Discharge hrkGate3Discharge hrkGate4Discharge hrsGate1Discharge hrsGate2Discharge hrfGate1Discharge hrfGate2Discharge hrfGate3Discharge hrfGate4Discharge hrfGate5Discharge hrfGate6Discharge hrlManGate1Discharge hrlManGate2Discharge'
      )
      .sort({ dateTime: -1 });
    return getLastDataSrspHrDamOverviewDish;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataSrspDamSpareAdvm = async () => {
  try {
    const getLastDataSrspDamSpareAdvm = await SRSP_HR_KAKATIYA_ADVM.findOne().sort({ dateTime: -1 });
    return getLastDataSrspDamSpareAdvm;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const sevenDayReport = async () => {
  try {
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    const pondLevelSevenDayReport = await SRSP_POND_LEVEL_OVERVIEW.find({
      dateTime: { $gte: sevenDaysAgo, $lte: currentDate },
    });

    const groupedByDate = {};
    pondLevelSevenDayReport.forEach((entry) => {
      const dateKey = entry.dateTime.toISOString().split('T')[0];
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {
          date: dateKey,
          maxPondLevel: entry.pondLevel,
          minPondLevel: entry.pondLevel,
          sumPondLevel: entry.pondLevel,
          count: 1,
          maxInflow1Level: entry.inflow1Level,
          minInflow1Level: entry.inflow1Level,
          sumInflow1Level: entry.inflow1Level,
          maxInflow2Level: entry.inflow2Level,
          minInflow2Level: entry.inflow2Level,
          sumInflow2Level: entry.inflow2Level,
        };
      } else {
        groupedByDate[dateKey].maxPondLevel = Math.max(groupedByDate[dateKey].maxPondLevel, entry.pondLevel);
        groupedByDate[dateKey].minPondLevel = Math.min(groupedByDate[dateKey].minPondLevel, entry.pondLevel);
        groupedByDate[dateKey].sumPondLevel += entry.pondLevel;
        groupedByDate[dateKey].count++;

        groupedByDate[dateKey].maxInflow1Level = Math.max(groupedByDate[dateKey].maxInflow1Level, entry.inflow1Level);
        groupedByDate[dateKey].minInflow1Level = Math.min(groupedByDate[dateKey].minInflow1Level, entry.inflow1Level);
        groupedByDate[dateKey].sumInflow1Level += entry.inflow1Level;

        groupedByDate[dateKey].maxInflow2Level = Math.max(groupedByDate[dateKey].maxInflow2Level, entry.inflow2Level);
        groupedByDate[dateKey].minInflow2Level = Math.min(groupedByDate[dateKey].minInflow2Level, entry.inflow2Level);
        groupedByDate[dateKey].sumInflow2Level += entry.inflow2Level;
      }
    });

    const result = [];
    const daysInRange = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + index);
      return date.toISOString().split('T')[0];
    });

    daysInRange.forEach((dateKey) => {
      if (groupedByDate[dateKey]) {
        const record = groupedByDate[dateKey];
        const avgPondLevel = record.sumPondLevel / record.count;
        const avgInflow1Level = record.sumInflow1Level / record.count;
        const avgInflow2Level = record.sumInflow2Level / record.count;

        result.push({
          date: record.date,
          maxPondLevel: record.maxPondLevel,
          minPondLevel: record.minPondLevel,
          avgPondLevel: avgPondLevel,
          maxInflow1Level: record.maxInflow1Level,
          minInflow1Level: record.minInflow1Level,
          avgInflow1Level: avgInflow1Level,
          maxInflow2Level: record.maxInflow2Level,
          minInflow2Level: record.minInflow2Level,
          avgInflow2Level: avgInflow2Level,
        });
      } else {
        result.push({
          date: dateKey,
          maxPondLevel: '',
          minPondLevel: '',
          avgPondLevel: '',
          maxInflow1Level: '',
          minInflow1Level: '',
          avgInflow1Level: '',
          maxInflow2Level: '',
          minInflow2Level: '',
          avgInflow2Level: '',
        });
      }
    });

    return result;
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  createSalientFeature,
  getSalientFeature,
  getLastDataSrspDamPondLevelOverview,
  getLastDataSrspDamOverviewPos,
  getLastDataSrspDamOverviewDish,
  getLastDataSrspHrDamOverviewPos,
  getLastDataSrspHrDamOverviewDish,
  getLastDataSrspDamSpareAdvm,
  sevenDayReport,
};

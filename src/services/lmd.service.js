const httpStatus = require('http-status');
const {
  LMDS,
  LMD_POND_LEVEL_OVERVIEW,
  LMD_HR_RIGHT_ADVM,
  LMD_HR_DAM_OVERVIEW_POS,
  LMD_HR_DAM_OVERVIEW_DICH,
  LMD_DAM_OVERVIEW_POS,
  LMD_DAM_OVERVIEW_DICH,
} = require('../models');

const ApiError = require('../utils/ApiError');

const createSalientFeature = async (userBody) => {
  try {
    return LMDS.create(userBody);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getSalientFeature = async () => {
  try {
    const showOneSalientFeature = await LMDS.findOne();
    return showOneSalientFeature;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataLmdDamPondLevelOverview = async () => {
  try {
    const getLastDataLmdDamPondLevelOverview = await LMD_POND_LEVEL_OVERVIEW.findOne()
      .select(
        'pondLevel liveCapacity grossStorage fullReservoirLevel contourArea catchmentArea ayacutArea filling instantaneousGateDischarge instantaneousCanalDischarge totalDamDischarge cumulativeDamDischarge inflow1Level inflow2Level inflow3Level inflow1Discharge inflow2Discharge inflow3Discharge damDownstreamLevel damDownstreamDischarge hrrDownstreamLevel hrrDownstreamDischarge'
      )
      .sort({ dateTime: -1 });
    return getLastDataLmdDamPondLevelOverview;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataLmdDamOverviewPos = async () => {
  try {
    const getLastDataLmdDamOverviewPos = await LMD_DAM_OVERVIEW_POS.findOne()
      .select(
        'gate1Position gate2Position gate3Position gate4Position gate5Position gate6Position gate7Position gate8Position gate9Position gate10Position gate11Position gate12Position gate13Position gate14Position gate15Position gate16Position gate17Position gate18Position gate19Position gate20Position'
      )
      .sort({ dateTime: -1 });
    return getLastDataLmdDamOverviewPos;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataLmdDamOverviewDish = async () => {
  try {
    const getLastDataLmdDamOverviewDish = await LMD_DAM_OVERVIEW_DICH.findOne()
      .select(
        'gate1Discharge gate2Discharge gate3Discharge gate4Discharge gate5Discharge gate6Discharge gate7Discharge gate8Discharge gate9Discharge gate10Discharge gate11Discharge gate12Discharge gate13Discharge gate14Discharge gate15Discharge gate16Discharge gate17Discharge gate18Discharge  gate19Discharge gate20Discharge'
      )
      .sort({ dateTime: -1 });
    return getLastDataLmdDamOverviewDish;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataLmdHrDamOverviewPos = async () => {
  try {
    const getLastDataLmdHrDamOverviewPos = await LMD_HR_DAM_OVERVIEW_POS.findOne()
      .select('hrrGate1Position hrrGate2Position')
      .sort({ dateTime: -1 });
    return getLastDataLmdHrDamOverviewPos;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataLmdHrDamOverviewDish = async () => {
  try {
    const getLastDataLmdHrDamOverviewDish = await LMD_HR_DAM_OVERVIEW_DICH.findOne()
      .select('hrrGate1Discharge hrrGate2Discharge')
      .sort({ dateTime: -1 });
    return getLastDataLmdHrDamOverviewDish;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataLmdDamSpareAdvm = async () => {
  try {
    const getLastDataLmdDamSpareAdvm = await LMD_HR_RIGHT_ADVM.findOne().sort({ dateTime: -1 });
    return getLastDataLmdDamSpareAdvm;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdHrRightAdvmReport = async (startDate, endDate) => {
  try {
    // const lmdHrRightAdvmReport = await LMD_HR_RIGHT_ADVM.find({
    //   dateTime: {
    //     $gte: new Date(new Date(startDate).setHours(00, 00, 00)),
    //     $lt: new Date(new Date(endDate).setHours(23, 59, 59))
    //   },
    // });

    // console.log(lmdHrRightAdvmReport.length);


    const lmdHrRightAdvmReport= await LMD_HR_RIGHT_ADVM.createIndexes({dateTime : 1})
    return lmdHrRightAdvmReport;
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const sevenDayReport = async () => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Calculate the date 7 days ago
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 7);

    // Find pond levels within the last 7 days
    const pondLevelSevenDayReport = await LMD_POND_LEVEL_OVERVIEW.find({
      dateTime: { $gte: sevenDaysAgo, $lte: currentDate }
    });

    // Group records by date
    const groupedByDate = {};
    pondLevelSevenDayReport.forEach(entry => {
      const dateKey = entry.dateTime.toISOString().split('T')[0]; // Extracting date part
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {
          date: dateKey,
          maxPondLevel: entry.pondLevel,
          minPondLevel: entry.pondLevel,
          sumPondLevel: entry.pondLevel,
          count: 1
        };
      } else {
        // Update max, min, and avg if a new record is found for the same date
        groupedByDate[dateKey].maxPondLevel = Math.max(groupedByDate[dateKey].maxPondLevel, entry.pondLevel);
        groupedByDate[dateKey].minPondLevel = Math.min(groupedByDate[dateKey].minPondLevel, entry.pondLevel);
        groupedByDate[dateKey].sumPondLevel += entry.pondLevel;
        groupedByDate[dateKey].count++;
      }
    });

    // Generate result array with null values for days without records
    const result = [];
    const daysInRange = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(sevenDaysAgo);
      date.setDate(sevenDaysAgo.getDate() + index);
      return date.toISOString().split('T')[0];
    });

    daysInRange.forEach(dateKey => {
      if (groupedByDate[dateKey]) {
        const record = groupedByDate[dateKey];
        const avgPondLevel = record.sumPondLevel / record.count;
        result.push({
          date: record.date,
          maxPondLevel: record.maxPondLevel,
          minPondLevel: record.minPondLevel,
          avgPondLevel: avgPondLevel
        });
      } else {
        result.push({
          date: dateKey,
          maxPondLevel: null,
          minPondLevel: null,
          avgPondLevel: null
        });
      }
    });

    return { records: result };

  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};







module.exports = {
  createSalientFeature,
  getSalientFeature,
  getLastDataLmdDamPondLevelOverview,
  getLastDataLmdDamOverviewPos,
  getLastDataLmdDamOverviewDish,
  getLastDataLmdHrDamOverviewPos,
  getLastDataLmdHrDamOverviewDish,
  getLastDataLmdDamSpareAdvm,
  lmdHrRightAdvmReport,
  sevenDayReport
};

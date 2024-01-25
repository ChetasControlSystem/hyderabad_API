const httpStatus = require('http-status');
const {
  LMDS,
  LMD_POND_LEVEL_OVERVIEW,
  LMD_HR_RIGHT_ADVM,
  LMD_HR_DAM_OVERVIEW_POS,
  LMD_HR_DAM_OVERVIEW_DICH,
  LMD_DAM_OVERVIEW_POS,
  LMD_DAM_OVERVIEW_DICH,
  Permission
} = require('../models');

const ApiError = require('../utils/ApiError');

const createSalientFeature = async (userBody) => {
  try {
    return LMDS.create(userBody);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getSalientFeature = async (user) => {
  try {
    const checkPermission = await Permission.findOne({ name: 'lmdSalientFeatures' });

    if ( user.role === 'admin' || user.role === 'lmdSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role)) ) {
    
    const showOneSalientFeature = await LMDS.findOne();
    return showOneSalientFeature;
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataLmdDamOverview = async (user) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'lmdDamOverview' });

    if ( user.role === 'admin' || user.role === 'lmdSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role)) ) {
    
    const getLastDataLmdDamPondLevelOverview = await LMD_POND_LEVEL_OVERVIEW.findOne()
      .select(
        'pondLevel liveCapacity grossStorage fullReservoirLevel contourArea catchmentArea ayacutArea filling instantaneousGateDischarge instantaneousCanalDischarge totalDamDischarge cumulativeDamDischarge inflow1Level inflow2Level inflow3Level inflow1Discharge inflow2Discharge inflow3Discharge damDownstreamLevel damDownstreamDischarge hrrDownstreamLevel hrrDownstreamDischarge'
      )
      .sort({ dateTime: -1 });
    const getLastDataLmdDamOverviewPos = await LMD_DAM_OVERVIEW_POS.findOne()
      .select(
        'gate1Position gate2Position gate3Position gate4Position gate5Position gate6Position gate7Position gate8Position gate9Position gate10Position gate11Position gate12Position gate13Position gate14Position gate15Position gate16Position gate17Position gate18Position gate19Position gate20Position'
      )
      .sort({ dateTime: -1 });
    const getLastDataLmdDamOverviewDish = await LMD_DAM_OVERVIEW_DICH.findOne()
      .select(
        'gate1Discharge gate2Discharge gate3Discharge gate4Discharge gate5Discharge gate6Discharge gate7Discharge gate8Discharge gate9Discharge gate10Discharge gate11Discharge gate12Discharge gate13Discharge gate14Discharge gate15Discharge gate16Discharge gate17Discharge gate18Discharge  gate19Discharge gate20Discharge'
      )
      .sort({ dateTime: -1 });
    const getLastDataLmdHrDamOverviewPos = await LMD_HR_DAM_OVERVIEW_POS.findOne()
      .select('hrrGate1Position hrrGate2Position')
      .sort({ dateTime: -1 });
    const getLastDataLmdHrDamOverviewDish = await LMD_HR_DAM_OVERVIEW_DICH.findOne()
      .select('hrrGate1Discharge hrrGate2Discharge')
      .sort({ dateTime: -1 });
    return {
      getLastDataLmdHrDamOverviewDish,
      getLastDataLmdHrDamOverviewPos,
      getLastDataLmdDamOverviewDish,
      getLastDataLmdDamOverviewPos,
      getLastDataLmdDamPondLevelOverview
    }
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataLmdDamSpareAdvm = async (user) => {
  try {
    const checkPermission = await Permission.findOne({ name: 'lmdDamOverview' });

    if ( user.role === 'admin' || user.role === 'lmdSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role)) ) {
    
    const getLastDataLmdDamSpareAdvm = await LMD_HR_RIGHT_ADVM.findOne().sort({ dateTime: -1 });
    return getLastDataLmdDamSpareAdvm;
  } else {
    return 'You are not authorized to access this data';
  }
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


    const lmdHrRightAdvmReport = await LMD_HR_RIGHT_ADVM.createIndexes({ dateTime: 1 })
    return lmdHrRightAdvmReport;
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const sevenDayReport = async (user) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'lmdReport' });

    if ( user.role === 'admin' || user.role === 'lmdSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role)) ) {
    
    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 6);

    const pondLevelSevenDayReport = await LMD_POND_LEVEL_OVERVIEW.find({
      dateTime: { $gte: sevenDaysAgo, $lte: currentDate }
    });

    const groupedByDate = {};
    pondLevelSevenDayReport.forEach(entry => {
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
          maxInflow3Level: entry.inflow3Level,
          minInflow3Level: entry.inflow3Level,
          sumInflow3Level: entry.inflow3Level,
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


        groupedByDate[dateKey].maxInflow3Level = Math.max(groupedByDate[dateKey].maxInflow3Level, entry.inflow3Level);
        groupedByDate[dateKey].minInflow3Level = Math.min(groupedByDate[dateKey].minInflow3Level, entry.inflow3Level);
        groupedByDate[dateKey].sumInflow3Level += entry.inflow3Level;
      }
    });

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
        const avgInflow1Level = record.sumInflow1Level / record.count;
        const avgInflow2Level = record.sumInflow2Level / record.count;
        const avgInflow3Level = record.sumInflow3Level / record.count;

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
          maxInflow3Level: record.maxInflow3Level,
          minInflow3Level: record.minInflow3Level,
          avgInflow3Level: avgInflow3Level
        });
      } else {
        result.push({
          date: dateKey,
          maxPondLevel: "",
          minPondLevel: "",
          avgPondLevel: "",
          maxInflow1Level: "",
          minInflow1Level: "",
          avgInflow1Level: "",
          maxInflow2Level: "",
          minInflow2Level: "",
          avgInflow2Level: "",
          maxInflow3Level: "",
          minInflow3Level: "",
          avgInflow3Level: ""
        });
      }
    });

    return result
  } else {
    return 'You are not authorized to access this data';
  }

  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};





module.exports = {
  createSalientFeature,
  getSalientFeature,
  getLastDataLmdDamOverview,
  getLastDataLmdDamSpareAdvm,
  lmdHrRightAdvmReport,
  sevenDayReport
};

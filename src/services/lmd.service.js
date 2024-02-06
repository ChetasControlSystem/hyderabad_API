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

const lmdDischargeGateReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex) => {
  try {
    const pipeline = [
      {
        $match: {
          dateTime: {
            $gte: new Date(new Date(startDate).setSeconds(0)),
            $lt: new Date(new Date(endDate).setSeconds(59)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [
                  { $toLong: "$dateTime" },
                  { $mod: [{ $toLong: "$dateTime" }, intervalMinutes * 60 * 1000] },
                ],
              },
            },
          },
          gate1Discharge: { $first: "$gate1Discharge" },
          gate2Discharge: { $first: "$gate2Discharge" },
          gate3Discharge: { $first: "$gate3Discharge" },
          gate4Discharge: { $first: "$gate4Discharge" },
          gate5Discharge: { $first: "$gate5Discharge" },
          gate6Discharge: { $first: "$gate6Discharge" },
          gate7Discharge: { $first: "$gate7Discharge" },
          gate8Discharge: { $first: "$gate8Discharge" },
          gate9Discharge: { $first: "$gate9Discharge" },
          gate10Discharge: { $first: "$gate10Discharge" },
          gate11Discharge: { $first: "$gate11Discharge" },
          gate12Discharge: { $first: "$gate12Discharge" },
          gate13Discharge: { $first: "$gate13Discharge" },
          gate14Discharge: { $first: "$gate14Discharge" },
          gate15Discharge: { $first: "$gate15Discharge" },
          gate16Discharge: { $first: "$gate16Discharge" },
          gate17Discharge: { $first: "$gate17Discharge" },
          gate18Discharge: { $first: "$gate18Discharge" },
          gate19Discharge: { $first: "$gate19Discharge" },
          gate20Discharge: { $first: "$gate20Discharge" },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          gate1Discharge: 1,
          gate2Discharge: 1,
          gate3Discharge: 1,
          gate4Discharge: 1,
          gate5Discharge: 1,
          gate6Discharge: 1,
          gate7Discharge: 1,
          gate8Discharge: 1,
          gate9Discharge: 1,
          gate10Discharge: 1,
          gate11Discharge: 1,
          gate12Discharge: 1,
          gate13Discharge: 1,
          gate14Discharge: 1,
          gate15Discharge: 1,
          gate16Discharge: 1,
          gate17Discharge: 1,
          gate18Discharge: 1,
          gate19Discharge: 1,
          gate20Discharge: 1,

        },
      },
      {
        $sort:{
          dateTime : 1
        }
      },
      {
        $facet: {
          data: [{ $skip: startIndex }, { $limit: perPage }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const lmdDischargeGateReport = await LMD_DAM_OVERVIEW_DICH.aggregate(pipeline);

    let totalCount = lmdDischargeGateReport[0]?.totalCount[0].count
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data : lmdDischargeGateReport[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage
    };
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdOpeningGateReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex) => {
  try {
    const pipeline = [
      {
        $match: {
          dateTime: {
            $gte: new Date(new Date(startDate).setSeconds(0)),
            $lt: new Date(new Date(endDate).setSeconds(59)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [
                  { $toLong: "$dateTime" },
                  { $mod: [{ $toLong: "$dateTime" }, intervalMinutes * 60 * 1000] },
                ],
              },
            },
          },
          gate1Position: { $first: "$gate1Position" },
          gate2Position: { $first: "$gate2Position" },
          gate3Position: { $first: "$gate3Position" },
          gate4Position: { $first: "$gate4Position" },
          gate5Position: { $first: "$gate5Position" },
          gate6Position: { $first: "$gate6Position" },
          gate7Position: { $first: "$gate7Position" },
          gate8Position: { $first: "$gate8Position" },
          gate9Position: { $first: "$gate9Position" },
          gate10Position: { $first: "$gate10Position" },
          gate11Position: { $first: "$gate11Position" },
          gate12Position: { $first: "$gate12Position" },
          gate13Position: { $first: "$gate13Position" },
          gate14Position: { $first: "$gate14Position" },
          gate15Position: { $first: "$gate15Position" },
          gate16Position: { $first: "$gate16Position" },
          gate17Position: { $first: "$gate17Position" },
          gate18Position: { $first: "$gate18Position" },
          gate19Position: { $first: "$gate19Position" },
          gate20Position: { $first: "$gate20Position" },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          gate1Position: 1,
          gate2Position: 1,
          gate3Position: 1,
          gate4Position: 1,
          gate5Position: 1,
          gate6Position: 1,
          gate7Position: 1,
          gate8Position: 1,
          gate9Position: 1,
          gate10Position: 1,
          gate11Position: 1,
          gate12Position: 1,
          gate13Position: 1,
          gate14Position: 1,
          gate15Position: 1,
          gate16Position: 1,
          gate17Position: 1,
          gate18Position: 1,
          gate19Position: 1,
          gate20Position: 1,

        },
      },
      {
        $sort:{
          dateTime : 1
        }
      },
      {
        $facet: {
          data: [{ $skip: startIndex }, { $limit: perPage }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const lmdOpeningGateReport = await LMD_DAM_OVERVIEW_POS.aggregate(pipeline);

    let totalCount = lmdOpeningGateReport[0]?.totalCount[0].count
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data : lmdOpeningGateReport[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage
    };
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdPondlevelGateReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex) => { 

  try {
    const pipeline = [
      {
        $match: {
          dateTime: {
            $gte: new Date(new Date(startDate).setSeconds(0)),
            $lt: new Date(new Date(endDate).setSeconds(59)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [
                  { $toLong: "$dateTime" },
                  { $mod: [{ $toLong: "$dateTime" }, intervalMinutes * 60 * 1000] },
                ],
              },
            },
          },
          inflow1Level: { $first: "$inflow1Level" },
          inflow2Level: { $first: "$inflow2Level" },
          inflow3Level: { $first: "$inflow3Level" },
          inflow1Discharge: { $first: "$inflow1Discharge" },
          inflow2Discharge: { $first: "$inflow2Discharge" },
          inflow3Discharge: { $first: "$inflow3Discharge" },
          damDownstreamLevel: { $first: "$damDownstreamLevel" },
          damDownstreamDischarge: { $first: "$damDownstreamDischarge" },
          pondLevel: { $first: "$pondLevel" }
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          inflow1Level: 1,
          inflow2Level: 1,
          inflow3Level: 1,
          inflow1Discharge: 1,
          inflow2Discharge: 1,
          inflow3Discharge: 1,
          damDownstreamLevel: 1,
          damDownstreamDischarge: 1,
          pondLevel: 1
        },
      },
      {
        $sort:{
          dateTime : 1
        }
      },
      {
        $facet: {
          data: [{ $skip: startIndex }, { $limit: perPage }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const lmdPondlevelGateReports = await LMD_POND_LEVEL_OVERVIEW.aggregate(pipeline);

    let totalCount = lmdPondlevelGateReports[0]?.totalCount[0].count
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data : lmdPondlevelGateReports[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage
    };

  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdGateParameterOverviewReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex) => { 

  try {
    const pipeline = [
      {
        $match: {
          dateTime: {
            $gte: new Date(new Date(startDate).setSeconds(0)),
            $lt: new Date(new Date(endDate).setSeconds(59)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [
                  { $toLong: "$dateTime" },
                  { $mod: [{ $toLong: "$dateTime" }, intervalMinutes * 60 * 1000] },
                ],
              },
            },
          },
          pondLevel: { $first: "$pondLevel" },
          liveCapacity: { $first: "$liveCapacity" },
          grossStorage: { $first: "$grossStorage" },
          fullReservoirLevel: { $first: "$fullReservoirLevel" },
          contourArea: { $first: "$contourArea" },
          catchmentArea: { $first: "$catchmentArea" },
          ayacutArea: { $first: "$ayacutArea" },
          filling: { $first: "$filling" },
          instantaneousGateDischarge: { $first: "$instantaneousGateDischarge" },
          instantaneousCanalDischarge: { $first: "$instantaneousCanalDischarge" },
          totalDamDischarge: { $first: "$totalDamDischarge" },
          cumulativeDamDischarge: { $first: "$cumulativeDamDischarge" },


        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          pondLevel: 1,
          liveCapacity: 1,
          grossStorage: 1,
          fullReservoirLevel: 1,
          contourArea: 1,
          catchmentArea: 1,
          ayacutArea: 1,
          filling: 1,
          instantaneousGateDischarge: 1,
          instantaneousCanalDischarge : 1,
          totalDamDischarge : 1,
          cumulativeDamDischarge : 1
        },
      },
      {
        $sort:{
          dateTime : 1
        }
      },
      {
        $facet: {
          data: [{ $skip: startIndex }, { $limit: perPage }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const lmdGateParameterOverviewReport = await LMD_POND_LEVEL_OVERVIEW.aggregate(pipeline);

    let totalCount = lmdGateParameterOverviewReport[0]?.totalCount[0].count
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data : lmdGateParameterOverviewReport[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage
    };

  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdGateReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex) => { 

  try {
    const pipeline = [
      {
        $match: {
          dateTime: {
            $gte: new Date(new Date(startDate).setSeconds(0)),
            $lt: new Date(new Date(endDate).setSeconds(59)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [
                  { $toLong: "$dateTime" },
                  { $mod: [{ $toLong: "$dateTime" }, intervalMinutes * 60 * 1000] },
                ],
              },
            },
          },
      
          hrrGate1Position: { $first: "$hrrGate1Position" },
          hrrGate2Position: { $first: "$hrrGate2Position" }
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          hrrGate1Position: 1,
          hrrGate2Position: 1,
        },
      },
      {
        $sort:{
          dateTime : 1
        }
      },
      {
        $facet: {
          data: [{ $skip: startIndex }, { $limit: perPage }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const pipeline1 = [
      {
        $match: {
          dateTime: {
            $gte: new Date(new Date(startDate).setSeconds(0)),
            $lt: new Date(new Date(endDate).setSeconds(59)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [
                  { $toLong: "$dateTime" },
                  { $mod: [{ $toLong: "$dateTime" }, intervalMinutes * 60 * 1000] },
                ],
              },
            },
          },
      
          hrrGate1Discharge: { $first: "$hrrGate1Discharge" },
          hrrGate2Discharge: { $first: "$hrrGate2Discharge" }
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          hrrGate1Discharge: 1,
          hrrGate2Discharge: 1,
        },
      },
      {
        $sort:{
          dateTime : 1
        }
      },
      {
        $facet: {
          data: [{ $skip: startIndex }, { $limit: perPage }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const lmdGateReportPos = await LMD_HR_DAM_OVERVIEW_POS.aggregate(pipeline);
    const lmdGateReportDis = await LMD_HR_DAM_OVERVIEW_DICH.aggregate(pipeline1);

    const mergedData = lmdGateReportPos[0]?.data.map(posItem => {
      const correspondingDisItem = lmdGateReportDis[0]?.data.find(disItem => disItem.dateTime === posItem.dateTime);
      return {
        ...posItem,
        hrrGate1Discharge: correspondingDisItem?.hrrGate1Discharge || 0,
        hrrGate2Discharge: correspondingDisItem?.hrrGate2Discharge || 0,
      };
    });

    let totalCount = lmdGateReportPos[0]?.totalCount[0].count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data : mergedData,
      currentPage,
      perPage,
      totalCount,
      totalPage
    };

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
  lmdDischargeGateReport,
  lmdOpeningGateReport,
  lmdPondlevelGateReport,
  lmdGateParameterOverviewReport,
  lmdGateReport,
  sevenDayReport
};

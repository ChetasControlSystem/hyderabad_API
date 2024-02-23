const httpStatus = require('http-status');
const {
  SRSPS,
  SRSP_HR_DAM_OVERVIEW_DICH,
  SRSP_HR_DAM_OVERVIEW_POS,
  SRSP_HR_KAKATIYA_ADVM,
  SRSP_POND_LEVEL_OVERVIEW,
  SRSP_SSD_DAM_OVERVIEW_DICH,
  SRSP_SSD_DAM_OVERVIEW_POS,
  Permission,
} = require('../models');
const ApiError = require('../utils/ApiError');

const createSalientFeature = async (userBody) => {
  try {
    return SRSPS.create(userBody);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getSalientFeature = async (user) => {
  try {
    const checkPermission = await Permission.findOne({ name: 'srspSalientFeatures' });

    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role)) ) {
      const showOneSalientFeature = await SRSPS.findOne();
      return showOneSalientFeature;
    } else {
      return 'You are not authorized to access this data';
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataSrspDamOverview = async (user) => {
  try {
    const checkPermission = await Permission.findOne({ name: 'srspDamOverview' });

    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role)) ) {

    const getLastDataSrspDamPondLevelOverview = await SRSP_POND_LEVEL_OVERVIEW.findOne()
      .select(
        'pondLevel liveCapacity grossStorage fullReservoirLevel contourArea catchmentArea ayacutArea filling instantaneousGateDischarge instantaneousCanalDischarge totalDamDischarge cumulativeDamDischarge inflow1Level inflow2Level inflow1Discharge inflow2Discharge damDownstreamLevel damDownstreamDischarge'
      )
      .sort({ dateTime: -1 });

    const getLastDataSrspDamOverviewPos = await SRSP_SSD_DAM_OVERVIEW_POS.findOne()
      .select(
        'gate1Position gate2Position gate3Position gate4Position gate5Position gate6Position gate7Position gate8Position gate9Position gate10Position gate11Position gate12Position gate13Position gate14Position gate15Position gate16Position gate17Position gate18Position gate19Position gate20Position gate21Position gate22Position gate23Position gate24Position gate25Position gate26Position gate27Position gate28Position gate29Position gate30Position gate31Position gate32Position gate33Position gate34Position gate35Position gate36Position gate37Position gate38Position gate39Position gate40Position gate41Position gate42Position'
      )
      .sort({ dateTime: -1 });

    const getLastDataSrspDamOverviewDish = await SRSP_SSD_DAM_OVERVIEW_DICH.findOne()
      .select(
        'gate1Discharge gate2Discharge gate3Discharge gate4Discharge gate5Discharge gate6Discharge gate7Discharge gate8Discharge gate9Discharge gate10Discharge gate11Discharge gate12Discharge gate13Discharge gate14Discharge gate15Discharge gate16Discharge gate17Discharge gate18Discharge gate19Discharge gate20Discharge gate21Discharge gate22Discharge gate23Discharge gate24Discharge gate25Discharge gate26Discharge gate27Discharge gate28Discharge gate29Discharge gate30Discharge gate31Discharge gate32Discharge gate33Discharge gate34Discharge gate35Discharge gate36Discharge gate37Discharge gate38Discharge gate39Discharge gate40Discharge gate41Discharge gate42Discharge'
      )
      .sort({ dateTime: -1 });

    const getLastDataSrspHrDamOverviewPos = await SRSP_HR_DAM_OVERVIEW_POS.findOne()
      .select(
        'hrkGate1Position hrkGate2Position hrkGate3Position hrkGate4Position hrsGate1Position hrsGate2Position hrfGate1Position hrfGate2Position hrfGate3Position hrfGate4Position hrfGate5Position hrfGate6Position hrlManGate1Position hrlManGate2Position'
      )
      .sort({ dateTime: -1 });

    const getLastDataSrspHrDamOverviewDish = await SRSP_HR_DAM_OVERVIEW_DICH.findOne()
      .select(
        'hrkGate1Discharge hrkGate2Discharge hrkGate3Discharge hrkGate4Discharge hrsGate1Discharge hrsGate2Discharge hrfGate1Discharge hrfGate2Discharge hrfGate3Discharge hrfGate4Discharge hrfGate5Discharge hrfGate6Discharge hrlManGate1Discharge hrlManGate2Discharge'
      )
      .sort({ dateTime: -1 });

    return {
      getLastDataSrspHrDamOverviewDish,
      getLastDataSrspHrDamOverviewPos,
      getLastDataSrspDamOverviewDish,
      getLastDataSrspDamOverviewPos,
      getLastDataSrspDamPondLevelOverview,
    };
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataSrspDamSpareAdvm = async (user) => {
  try {
    const checkPermission = await Permission.findOne({ name: 'srspDamOverview' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role)) ) {

    const getLastDataSrspDamSpareAdvm = await SRSP_HR_KAKATIYA_ADVM.findOne().sort({ dateTime: -1 });
    return getLastDataSrspDamSpareAdvm;
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspDischargeGate1TO21Report = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex) => {
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
          gate21Discharge: { $first: "$gate21Discharge" },
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
          gate21Discharge: 1,
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

    const srspDischargeGate1TO21Report = await SRSP_SSD_DAM_OVERVIEW_DICH.aggregate(pipeline);

    let totalCount = srspDischargeGate1TO21Report[0]?.totalCount[0]?.count
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data : srspDischargeGate1TO21Report[0]?.data,
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

const srspDischargeGate22TO42Report = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex) => {
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
          gate22Discharge: { $first: "$gate22Discharge" },
          gate23Discharge: { $first: "$gate23Discharge" },
          gate24Discharge: { $first: "$gate24Discharge" },
          gate25Discharge: { $first: "$gate25Discharge" },
          gate26Discharge: { $first: "$gate26Discharge" },
          gate27Discharge: { $first: "$gate27Discharge" },
          gate28Discharge: { $first: "$gate28Discharge" },
          gate29Discharge: { $first: "$gate29Discharge" },
          gate30Discharge: { $first: "$gate30Discharge" },
          gate31Discharge: { $first: "$gate31Discharge" },
          gate32Discharge: { $first: "$gate32Discharge" },
          gate33Discharge: { $first: "$gate33Discharge" },
          gate34Discharge: { $first: "$gate34Discharge" },
          gate35Discharge: { $first: "$gate35Discharge" },
          gate36Discharge: { $first: "$gate36Discharge" },
          gate37Discharge: { $first: "$gate37Discharge" },
          gate38Discharge: { $first: "$gate38Discharge" },
          gate39Discharge: { $first: "$gate39Discharge" },
          gate40Discharge: { $first: "$gate40Discharge" },
          gate41Discharge: { $first: "$gate41Discharge" },
          gate42Discharge: { $first: "$gate42Discharge" },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          gate22Discharge: 1,
          gate23Discharge: 1,
          gate24Discharge: 1,
          gate25Discharge: 1,
          gate26Discharge: 1,
          gate27Discharge: 1,
          gate28Discharge: 1,
          gate29Discharge: 1,
          gate30Discharge: 1,
          gate31Discharge: 1,
          gate32Discharge: 1,
          gate33Discharge: 1,
          gate34Discharge: 1,
          gate35Discharge: 1,
          gate36Discharge: 1,
          gate37Discharge: 1,
          gate38Discharge: 1,
          gate39Discharge: 1,
          gate40Discharge: 1,
          gate41Discharge: 1,
          gate41Discharge: 1,
          gate42Discharge: 1,
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

    const srspDischargeGate22TO42Report = await SRSP_SSD_DAM_OVERVIEW_DICH.aggregate(pipeline);

    let totalCount = srspDischargeGate22TO42Report[0]?.totalCount[0]?.count
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data : srspDischargeGate22TO42Report[0]?.data,
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

const srspOpeningGate1TO21Report = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex) => {
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
          gate21Position: { $first: "$gate21Position" },
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
          gate21Position: 1,
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

    const srspOpeningGate1TO21Report = await SRSP_SSD_DAM_OVERVIEW_POS.aggregate(pipeline);

    let totalCount = srspOpeningGate1TO21Report[0]?.totalCount[0]?.count
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data : srspOpeningGate1TO21Report[0]?.data,
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

const srspOpeningGate22TO42Report = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex) => {
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
          gate22Position: { $first: "$gate22Position" },
          gate23Position: { $first: "$gate23Position" },
          gate24Position: { $first: "$gate24Position" },
          gate25Position: { $first: "$gate25Position" },
          gate26Position: { $first: "$gate26Position" },
          gate27Position: { $first: "$gate27Position" },
          gate28Position: { $first: "$gate28Position" },
          gate29Position: { $first: "$gate29Position" },
          gate30Position: { $first: "$gate30Position" },
          gate31Position: { $first: "$gate31Position" },
          gate32Position: { $first: "$gate32Position" },
          gate33Position: { $first: "$gate33Position" },
          gate34Position: { $first: "$gate34Position" },
          gate35Position: { $first: "$gate35Position" },
          gate36Position: { $first: "$gate36Position" },
          gate37Position: { $first: "$gate37Position" },
          gate38Position: { $first: "$gate38Position" },
          gate39Position: { $first: "$gate39Position" },
          gate40Position: { $first: "$gate40Position" },
          gate41Position: { $first: "$gate41Position" },
          gate42Position: { $first: "$gate42Position" },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          gate22Position: 1,
          gate23Position: 1,
          gate24Position: 1,
          gate25Position: 1,
          gate26Position: 1,
          gate27Position: 1,
          gate28Position: 1,
          gate29Position: 1,
          gate30Position: 1,
          gate31Position: 1,
          gate32Position: 1,
          gate33Position: 1,
          gate34Position: 1,
          gate35Position: 1,
          gate36Position: 1,
          gate37Position: 1,
          gate38Position: 1,
          gate39Position: 1,
          gate40Position: 1,
          gate41Position: 1,
          gate41Position: 1,
          gate42Position: 1,
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

    const srspOpeningGate22TO42Report = await SRSP_SSD_DAM_OVERVIEW_POS.aggregate(pipeline);

    let totalCount = srspOpeningGate22TO42Report[0]?.totalCount[0]?.count
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data : srspOpeningGate22TO42Report[0]?.data,
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

const srspInflowOutflowPondLevelReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex) => {
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
          inflow1Discharge: { $first: "$inflow1Discharge" },
          inflow2Level: { $first: "$inflow2Level" },
          inflow2Discharge: { $first: "$inflow2Discharge" },
          damDownstreamLevel: { $first: "$damDownstreamLevel" },
          damDownstreamDischarge: { $first: "$damDownstreamDischarge" },
          pondLevel: { $first: "$pondLevel" },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          inflow1Level: 1,
          inflow1Discharge: 1,
          inflow2Level: 1,
          inflow2Discharge: 1,
          damDownstreamLevel : 1,
          damDownstreamDischarge : 1,
          pondLevel : 1
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

    const srspInflowOutflowPondLevelReport = await SRSP_POND_LEVEL_OVERVIEW.aggregate(pipeline);

    let totalCount = srspInflowOutflowPondLevelReport[0]?.totalCount[0]?.count
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data : srspInflowOutflowPondLevelReport[0]?.data,
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

const srspParameterOverviewReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex) => {
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
          pondLevel : 1,
          liveCapacity: 1,
          grossStorage: 1,
          fullReservoirLevel: 1,
          contourArea: 1,
          catchmentArea : 1,
          ayacutArea : 1,
          filling : 1,
          instantaneousGateDischarge : 1,
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

    const srspParameterOverviewReport = await SRSP_POND_LEVEL_OVERVIEW.aggregate(pipeline);

    let totalCount = srspParameterOverviewReport[0]?.totalCount[0]?.count
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data : srspParameterOverviewReport[0]?.data,
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

const srspHrDamGateReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex) => {
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
          hrkGate1Position: { $first: "$hrkGate1Position" },
          hrkGate2Position: { $first: "$hrkGate2Position" },
          hrkGate3Position: { $first: "$hrkGate3Position" },
          hrkGate4Position: { $first: "$hrkGate4Position" },
          hrsGate1Position: { $first: "$hrsGate1Position" },
          hrsGate2Position: { $first: "$hrsGate2Position" },
          hrfGate1Position: { $first: "$hrfGate1Position" },
          hrfGate2Position: { $first: "$hrfGate2Position" },
          hrfGate3Position: { $first: "$hrfGate3Position" },
          hrfGate4Position: { $first: "$hrfGate4Position" },
          hrfGate5Position: { $first: "$hrfGate5Position" },
          hrfGate6Position: { $first: "$hrfGate6Position" },
          hrlManGate1Position: { $first: "$hrlManGate1Position" },
          hrlManGate2Position: { $first: "$hrlManGate2Position" },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          hrkGate1Position: 1,
          hrkGate2Position: 1,
          hrkGate3Position: 1,
          hrkGate4Position: 1,
          hrsGate1Position : 1,
          hrsGate2Position : 1,
          hrfGate1Position : 1,
          hrfGate2Position : 1,
          hrfGate3Position : 1,
          hrfGate4Position : 1,
          hrfGate5Position : 1,
          hrfGate6Position : 1,
          hrlManGate1Position : 1,
          hrlManGate2Position : 1,
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
          hrkGate1Discharge: { $first: "$hrkGate1Discharge" },
          hrkGate2Discharge: { $first: "$hrkGate2Discharge" },
          hrkGate3Discharge: { $first: "$hrkGate3Discharge" },
          hrkGate4Discharge: { $first: "$hrkGate4Discharge" }, 
          hrsGate1Discharge: { $first: "$hrsGate1Discharge" },
          hrsGate2Discharge: { $first: "$hrsGate2Discharge" },
          hrfGate1Discharge: { $first: "$hrfGate1Discharge" },
          hrfGate2Discharge: { $first: "$hrfGate2Discharge" },
          hrfGate3Discharge: { $first: "$hrfGate3Discharge" },
          hrfGate4Discharge: { $first: "$hrfGate4Discharge" },
          hrfGate5Discharge: { $first: "$hrfGate5Discharge" },
          hrfGate6Discharge: { $first: "$hrfGate6Discharge" },
          hrlManGate1Discharge: { $first: "$hrlManGate1Discharge" },
          hrlManGate2Discharge: { $first: "$hrlManGate2Discharge" },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: "$_id.interval",
          hrkGate1Discharge: 1,
          hrkGate2Discharge: 1,
          hrkGate3Discharge: 1,
          hrkGate4Discharge: 1,
          hrsGate1Discharge : 1,
          hrsGate2Discharge : 1,
          hrfGate1Discharge : 1,
          hrfGate2Discharge : 1,
          hrfGate3Discharge : 1,
          hrfGate4Discharge : 1,
          hrfGate5Discharge : 1,
          hrfGate6Discharge : 1,
          hrlManGate1Discharge : 1,
          hrlManGate2Discharge : 1,
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

    const srspHrDamGateReportPos = await SRSP_HR_DAM_OVERVIEW_POS.aggregate(pipeline);
    const srspHrDamGateReportDis = await SRSP_HR_DAM_OVERVIEW_DICH.aggregate(pipeline1);


    let posData = srspHrDamGateReportPos[0]?.data || [];
    let disData = srspHrDamGateReportDis[0]?.data || [];
    
    let minLength = Math.max(posData.length, disData.length);
    
    let mergedData = Array.from({ length: minLength }, (_, index) => {
      const hrkGate1Discharge = disData[index]?.hrkGate1Discharge || 0;
      const hrkGate2Discharge = disData[index]?.hrkGate2Discharge || 0;
      const hrkGate3Discharge = disData[index]?.hrkGate3Discharge || 0;
      const hrkGate4Discharge = disData[index]?.hrkGate4Discharge || 0;
      const hrsGate1Discharge = disData[index]?.hrsGate1Discharge || 0;
      const hrsGate2Discharge = disData[index]?.hrsGate2Discharge || 0;
      const hrfGate1Discharge = disData[index]?.hrfGate1Discharge || 0;
      const hrfGate2Discharge = disData[index]?.hrfGate2Discharge || 0;
      const hrfGate3Discharge = disData[index]?.hrfGate3Discharge || 0;
      const hrfGate4Discharge = disData[index]?.hrfGate4Discharge || 0;
      const hrfGate5Discharge = disData[index]?.hrfGate5Discharge || 0;
      const hrfGate6Discharge = disData[index]?.hrfGate6Discharge || 0;
      const hrlManGate1Discharge = disData[index]?.hrlManGate1Discharge || 0;
      const hrlManGate2Discharge = disData[index]?.hrlManGate2Discharge || 0;
    
      const kakatiyaTotalDischarge =  hrkGate1Discharge + hrkGate2Discharge + hrkGate3Discharge + hrkGate4Discharge;
      const saraswatiTotalDischarge =  hrsGate1Discharge + hrsGate2Discharge;
      const floodFlowTotalDischarge =  hrfGate1Discharge + hrfGate2Discharge + hrfGate3Discharge + hrfGate4Discharge + hrfGate5Discharge + hrfGate6Discharge;
      const lakshmiGateTotalDischarge =  hrlManGate1Discharge + hrlManGate2Discharge;

    
      return {
        hrkGate1Position: posData[index]?.hrkGate1Position || 0,
        hrkGate2Position: posData[index]?.hrkGate2Position || 0,
        hrkGate3Position: posData[index]?.hrkGate3Position || 0,
        hrkGate4Position: posData[index]?.hrkGate4Position || 0,
        hrsGate1Position: posData[index]?.hrsGate1Position || 0,
        hrsGate2Position: posData[index]?.hrsGate2Position || 0,
        hrfGate1Position: posData[index]?.hrfGate1Position || 0,
        hrfGate2Position: posData[index]?.hrfGate2Position || 0,
        hrfGate3Position: posData[index]?.hrfGate3Position || 0,
        hrfGate4Position: posData[index]?.hrfGate4Position || 0,
        hrfGate5Position: posData[index]?.hrfGate5Position || 0,
        hrfGate6Position: posData[index]?.hrfGate6Position || 0,
        hrlManGate1Position: posData[index]?.hrlManGate1Position || 0,
        hrlManGate2Position: posData[index]?.hrlManGate2Position || 0,
        dateTime: posData[index]?.dateTime || disData[index]?.dateTime || null,

        hrkGate1Discharge: hrkGate1Discharge,
        hrkGate2Discharge: hrkGate2Discharge,
        hrkGate3Discharge: hrkGate3Discharge,
        hrkGate4Discharge: hrkGate4Discharge,
        kakatiyaTotalDischarge: kakatiyaTotalDischarge,
        hrsGate1Discharge : hrsGate1Discharge,
        hrsGate2Discharge : hrsGate2Discharge,
        saraswatiTotalDischarge : saraswatiTotalDischarge,
        hrfGate1Discharge : hrfGate1Discharge,
        hrfGate2Discharge : hrfGate2Discharge,
        hrfGate3Discharge : hrfGate3Discharge,
        hrfGate4Discharge : hrfGate4Discharge,
        hrfGate5Discharge : hrfGate5Discharge,
        hrfGate6Discharge : hrfGate6Discharge,
        floodFlowTotalDischarge : floodFlowTotalDischarge,
        hrlManGate1Discharge : hrlManGate1Discharge,
        hrlManGate2Discharge : hrlManGate2Discharge,
        lakshmiGateTotalDischarge : lakshmiGateTotalDischarge
      };
    });
    
    let totalCount = srspHrDamGateReportPos[0]?.totalCount[0]?.count
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
    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role)) ) {

    const currentDate = new Date();
    const sevenDaysAgo = new Date(currentDate);
    sevenDaysAgo.setDate(currentDate.getDate() - 6);

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
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  createSalientFeature,
  getSalientFeature,
  getLastDataSrspDamOverview,
  getLastDataSrspDamSpareAdvm,
  srspDischargeGate1TO21Report,
  srspDischargeGate22TO42Report,
  srspOpeningGate1TO21Report,
  srspOpeningGate22TO42Report,
  srspInflowOutflowPondLevelReport,
  srspParameterOverviewReport,
  srspHrDamGateReport,
  sevenDayReport,
};

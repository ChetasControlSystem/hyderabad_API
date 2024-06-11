const httpStatus = require('http-status');
const puppeteer = require('puppeteer');
const path = require('path');
const fastCsv = require('fast-csv');
const ejs = require('ejs');
const fs = require('fs');
const Docx = require('docx');
const ExcelJS = require('exceljs');

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

const hyderabadImagePath = path.join(__dirname, '../../views/hyderabad.png');
const chetasImagePath = path.join(__dirname, '../../views/chetas.png');

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

    if (
      user.role === 'admin' ||
      user.role === 'srspSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
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

    if (
      user.role === 'admin' ||
      user.role === 'srspSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const defaultPondLevelOverview = {
        pondLevel: 0,
        liveCapacity: 0,
        grossStorage: 0,
        fullReservoirLevel: 0,
        contourArea: 0,
        catchmentArea: 0,
        ayacutArea: 0,
        filling: 0,
        instantaneousGateDischarge: 0,
        instantaneousCanalDischarge: 0,
        totalDamDischarge: 0,
        cumulativeDamDischarge: 0,
        inflow1Level: 0,
        inflow2Level: 0,
        inflow1Discharge: 0,
        inflow2Discharge: 0,
        damDownstreamLevel: 0,
        damDownstreamDischarge: 0,
      };

      const defaultDamOverviewPos = {
        gate1Position: 0,
        gate2Position: 0,
        gate3Position: 0,
        gate4Position: 0,
        gate5Position: 0,
        gate6Position: 0,
        gate7Position: 0,
        gate8Position: 0,
        gate9Position: 0,
        gate10Position: 0,
        gate11Position: 0,
        gate12Position: 0,
        gate13Position: 0,
        gate14Position: 0,
        gate15Position: 0,
        gate16Position: 0,
        gate17Position: 0,
        gate18Position: 0,
        gate19Position: 0,
        gate20Position: 0,
        gate21Position: 0,
        gate22Position: 0,
        gate23Position: 0,
        gate24Position: 0,
        gate25Position: 0,
        gate26Position: 0,
        gate27Position: 0,
        gate28Position: 0,
        gate29Position: 0,
        gate30Position: 0,
        gate31Position: 0,
        gate32Position: 0,
        gate33Position: 0,
        gate34Position: 0,
        gate35Position: 0,
        gate36Position: 0,
        gate37Position: 0,
        gate38Position: 0,
        gate39Position: 0,
        gate40Position: 0,
        gate41Position: 0,
        gate42Position: 0,
      };

      const defaultDamOverviewDish = {
        gate1Discharge: 0,
        gate2Discharge: 0,
        gate3Discharge: 0,
        gate4Discharge: 0,
        gate5Discharge: 0,
        gate6Discharge: 0,
        gate7Discharge: 0,
        gate8Discharge: 0,
        gate9Discharge: 0,
        gate10Discharge: 0,
        gate11Discharge: 0,
        gate12Discharge: 0,
        gate13Discharge: 0,
        gate14Discharge: 0,
        gate15Discharge: 0,
        gate16Discharge: 0,
        gate17Discharge: 0,
        gate18Discharge: 0,
        gate19Discharge: 0,
        gate20Discharge: 0,
        gate21Discharge: 0,
        gate22Discharge: 0,
        gate23Discharge: 0,
        gate24Discharge: 0,
        gate25Discharge: 0,
        gate26Discharge: 0,
        gate27Discharge: 0,
        gate28Discharge: 0,
        gate29Discharge: 0,
        gate30Discharge: 0,
        gate31Discharge: 0,
        gate32Discharge: 0,
        gate33Discharge: 0,
        gate34Discharge: 0,
        gate35Discharge: 0,
        gate36Discharge: 0,
        gate37Discharge: 0,
        gate38Discharge: 0,
        gate39Discharge: 0,
        gate40Discharge: 0,
        gate41Discharge: 0,
        gate42Discharge: 0,
      };

      const defaultHrDamOverviewPos = {
        hrkGate1Position: 0,
        hrkGate2Position: 0,
        hrkGate3Position: 0,
        hrkGate4Position: 0,
        hrsGate1Position: 0,
        hrsGate2Position: 0,
        hrfGate1Position: 0,
        hrfGate2Position: 0,
        hrfGate3Position: 0,
        hrfGate4Position: 0,
        hrfGate5Position: 0,
        hrfGate6Position: 0,
        hrlManGate1Position: 0,
        hrlManGate2Position: 0,
      };

      const defaultHrDamOverviewDish = {
        hrkGate1Discharge: 0,
        hrkGate2Discharge: 0,
        hrkGate3Discharge: 0,
        hrkGate4Discharge: 0,
        hrsGate1Discharge: 0,
        hrsGate2Discharge: 0,
        hrfGate1Discharge: 0,
        hrfGate2Discharge: 0,
        hrfGate3Discharge: 0,
        hrfGate4Discharge: 0,
        hrfGate5Discharge: 0,
        hrfGate6Discharge: 0,
        hrlManGate1Discharge: 0,
        hrlManGate2Discharge: 0,
      };

      const getLastDataSrspDamPondLevelOverview = await SRSP_POND_LEVEL_OVERVIEW.findOne()
        .select(
          'pondLevel liveCapacity grossStorage fullReservoirLevel contourArea catchmentArea ayacutArea filling instantaneousGateDischarge instantaneousCanalDischarge totalDamDischarge cumulativeDamDischarge inflow1Level inflow2Level inflow1Discharge inflow2Discharge damDownstreamLevel damDownstreamDischarge'
        )
        .sort({ dateTime: -1 }) || defaultPondLevelOverview;

      const getLastDataSrspDamOverviewPos = await SRSP_SSD_DAM_OVERVIEW_POS.findOne()
        .select(
          'gate1Position gate2Position gate3Position gate4Position gate5Position gate6Position gate7Position gate8Position gate9Position gate10Position gate11Position gate12Position gate13Position gate14Position gate15Position gate16Position gate17Position gate18Position gate19Position gate20Position gate21Position gate22Position gate23Position gate24Position gate25Position gate26Position gate27Position gate28Position gate29Position gate30Position gate31Position gate32Position gate33Position gate34Position gate35Position gate36Position gate37Position gate38Position gate39Position gate40Position gate41Position gate42Position'
        )
        .sort({ dateTime: -1 }) || defaultDamOverviewPos;

      const getLastDataSrspDamOverviewDish = await SRSP_SSD_DAM_OVERVIEW_DICH.findOne()
        .select(
          'gate1Discharge gate2Discharge gate3Discharge gate4Discharge gate5Discharge gate6Discharge gate7Discharge gate8Discharge gate9Discharge gate10Discharge gate11Discharge gate12Discharge gate13Discharge gate14Discharge gate15Discharge gate16Discharge gate17Discharge gate18Discharge gate19Discharge gate20Discharge gate21Discharge gate22Discharge gate23Discharge gate24Discharge gate25Discharge gate26Discharge gate27Discharge gate28Discharge gate29Discharge gate30Discharge gate31Discharge gate32Discharge gate33Discharge gate34Discharge gate35Discharge gate36Discharge gate37Discharge gate38Discharge gate39Discharge gate40Discharge gate41Discharge gate42Discharge'
        )
        .sort({ dateTime: -1 }) || defaultDamOverviewDish;

      const getLastDataSrspHrDamOverviewPos = await SRSP_HR_DAM_OVERVIEW_POS.findOne()
        .select(
          'hrkGate1Position hrkGate2Position hrkGate3Position hrkGate4Position hrsGate1Position hrsGate2Position hrfGate1Position hrfGate2Position hrfGate3Position hrfGate4Position hrfGate5Position hrfGate6Position hrlManGate1Position hrlManGate2Position'
        )
        .sort({ dateTime: -1 }) || defaultHrDamOverviewPos;

      const getLastDataSrspHrDamOverviewDish = await SRSP_HR_DAM_OVERVIEW_DICH.findOne()
        .select(
          'hrkGate1Discharge hrkGate2Discharge hrkGate3Discharge hrkGate4Discharge hrsGate1Discharge hrsGate2Discharge hrfGate1Discharge hrfGate2Discharge hrfGate3Discharge hrfGate4Discharge hrfGate5Discharge hrfGate6Discharge hrlManGate1Discharge hrlManGate2Discharge'
        )
        .sort({ dateTime: -1 }) || defaultHrDamOverviewDish;

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
    if (
      user.role === 'admin' ||
      user.role === 'srspSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const getLastDataSrspDamSpareAdvm = await SRSP_HR_KAKATIYA_ADVM.findOne().sort({ dateTime: -1 });
      return getLastDataSrspDamSpareAdvm;
    } else {
      return 'You are not authorized to access this data';
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspDischargeGate1TO21Report = async (
  startDate,
  endDate,
  intervalMinutes,
  currentPage,
  perPage,
  startIndex,
  user,
  res,
  req
) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if (
      user.role === 'admin' ||
      user.role === 'srspSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {

    const pipeline = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          gate1Discharge: { $first: '$gate1Discharge' },
          gate2Discharge: { $first: '$gate2Discharge' },
          gate3Discharge: { $first: '$gate3Discharge' },
          gate4Discharge: { $first: '$gate4Discharge' },
          gate5Discharge: { $first: '$gate5Discharge' },
          gate6Discharge: { $first: '$gate6Discharge' },
          gate7Discharge: { $first: '$gate7Discharge' },
          gate8Discharge: { $first: '$gate8Discharge' },
          gate9Discharge: { $first: '$gate9Discharge' },
          gate10Discharge: { $first: '$gate10Discharge' },
          gate11Discharge: { $first: '$gate11Discharge' },
          gate12Discharge: { $first: '$gate12Discharge' },
          gate13Discharge: { $first: '$gate13Discharge' },
          gate14Discharge: { $first: '$gate14Discharge' },
          gate15Discharge: { $first: '$gate15Discharge' },
          gate16Discharge: { $first: '$gate16Discharge' },
          gate17Discharge: { $first: '$gate17Discharge' },
          gate18Discharge: { $first: '$gate18Discharge' },
          gate19Discharge: { $first: '$gate19Discharge' },
          gate20Discharge: { $first: '$gate20Discharge' },
          gate21Discharge: { $first: '$gate21Discharge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
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
        $sort: {
          dateTime: 1,
        },
      },
      {
        $facet: {
          data: [{ $skip: startIndex }, { $limit: perPage }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];

    const srspDischargeGate1TO21Report = await SRSP_SSD_DAM_OVERVIEW_DICH.aggregate(pipeline);

    let totalCount = srspDischargeGate1TO21Report[0]?.totalCount[0]?.count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: srspDischargeGate1TO21Report[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage,
    };
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspDischargeGate22TO42Report = async ( startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, user, res, req) => {
  try {
    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if (
      user.role === 'admin' ||
      user.role === 'srspSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {

    const pipeline = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          gate22Discharge: { $first: '$gate22Discharge' },
          gate23Discharge: { $first: '$gate23Discharge' },
          gate24Discharge: { $first: '$gate24Discharge' },
          gate25Discharge: { $first: '$gate25Discharge' },
          gate26Discharge: { $first: '$gate26Discharge' },
          gate27Discharge: { $first: '$gate27Discharge' },
          gate28Discharge: { $first: '$gate28Discharge' },
          gate29Discharge: { $first: '$gate29Discharge' },
          gate30Discharge: { $first: '$gate30Discharge' },
          gate31Discharge: { $first: '$gate31Discharge' },
          gate32Discharge: { $first: '$gate32Discharge' },
          gate33Discharge: { $first: '$gate33Discharge' },
          gate34Discharge: { $first: '$gate34Discharge' },
          gate35Discharge: { $first: '$gate35Discharge' },
          gate36Discharge: { $first: '$gate36Discharge' },
          gate37Discharge: { $first: '$gate37Discharge' },
          gate38Discharge: { $first: '$gate38Discharge' },
          gate39Discharge: { $first: '$gate39Discharge' },
          gate40Discharge: { $first: '$gate40Discharge' },
          gate41Discharge: { $first: '$gate41Discharge' },
          gate42Discharge: { $first: '$gate42Discharge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
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
        $sort: {
          dateTime: 1,
        },
      },
      {
        $facet: {
          data: [{ $skip: startIndex }, { $limit: perPage }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];

    const srspDischargeGate22TO42Report = await SRSP_SSD_DAM_OVERVIEW_DICH.aggregate(pipeline);

    let totalCount = srspDischargeGate22TO42Report[0]?.totalCount[0]?.count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: srspDischargeGate22TO42Report[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage,
    };
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspOpeningGate1TO21Report = async (
  startDate,
  endDate,
  intervalMinutes,
  currentPage,
  perPage,
  startIndex,
  user,
  res,
  req
) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if (
      user.role === 'admin' ||
      user.role === 'srspSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
    const pipeline = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          gate1Position: { $first: '$gate1Position' },
          gate2Position: { $first: '$gate2Position' },
          gate3Position: { $first: '$gate3Position' },
          gate4Position: { $first: '$gate4Position' },
          gate5Position: { $first: '$gate5Position' },
          gate6Position: { $first: '$gate6Position' },
          gate7Position: { $first: '$gate7Position' },
          gate8Position: { $first: '$gate8Position' },
          gate9Position: { $first: '$gate9Position' },
          gate10Position: { $first: '$gate10Position' },
          gate11Position: { $first: '$gate11Position' },
          gate12Position: { $first: '$gate12Position' },
          gate13Position: { $first: '$gate13Position' },
          gate14Position: { $first: '$gate14Position' },
          gate15Position: { $first: '$gate15Position' },
          gate16Position: { $first: '$gate16Position' },
          gate17Position: { $first: '$gate17Position' },
          gate18Position: { $first: '$gate18Position' },
          gate19Position: { $first: '$gate19Position' },
          gate20Position: { $first: '$gate20Position' },
          gate21Position: { $first: '$gate21Position' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
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
        $sort: {
          dateTime: 1,
        },
      },
      {
        $facet: {
          data: [{ $skip: startIndex }, { $limit: perPage }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];

    const srspOpeningGate1TO21Report = await SRSP_SSD_DAM_OVERVIEW_POS.aggregate(pipeline);

    let totalCount = srspOpeningGate1TO21Report[0]?.totalCount[0]?.count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: srspOpeningGate1TO21Report[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage,
    };
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspOpeningGate22TO42Report = async (
  startDate,
  endDate,
  intervalMinutes,
  currentPage,
  perPage,
  startIndex,
  user,
  res,
  req
) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if (
      user.role === 'admin' ||
      user.role === 'srspSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {

    const pipeline = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          gate22Position: { $first: '$gate22Position' },
          gate23Position: { $first: '$gate23Position' },
          gate24Position: { $first: '$gate24Position' },
          gate25Position: { $first: '$gate25Position' },
          gate26Position: { $first: '$gate26Position' },
          gate27Position: { $first: '$gate27Position' },
          gate28Position: { $first: '$gate28Position' },
          gate29Position: { $first: '$gate29Position' },
          gate30Position: { $first: '$gate30Position' },
          gate31Position: { $first: '$gate31Position' },
          gate32Position: { $first: '$gate32Position' },
          gate33Position: { $first: '$gate33Position' },
          gate34Position: { $first: '$gate34Position' },
          gate35Position: { $first: '$gate35Position' },
          gate36Position: { $first: '$gate36Position' },
          gate37Position: { $first: '$gate37Position' },
          gate38Position: { $first: '$gate38Position' },
          gate39Position: { $first: '$gate39Position' },
          gate40Position: { $first: '$gate40Position' },
          gate41Position: { $first: '$gate41Position' },
          gate42Position: { $first: '$gate42Position' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
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
        $sort: {
          dateTime: 1,
        },
      },
      {
        $facet: {
          data: [{ $skip: startIndex }, { $limit: perPage }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];

    const srspOpeningGate22TO42Report = await SRSP_SSD_DAM_OVERVIEW_POS.aggregate(pipeline);

    let totalCount = srspOpeningGate22TO42Report[0]?.totalCount[0]?.count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: srspOpeningGate22TO42Report[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage,
    };
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspInflowOutflowPondLevelReport = async (
  startDate,
  endDate,
  intervalMinutes,
  currentPage,
  perPage,
  startIndex,
  user,
  res,
  req
) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if (
      user.role === 'admin' ||
      user.role === 'srspSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {

    const pipeline = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          inflow1Level: { $first: '$inflow1Level' },
          inflow1Discharge: { $first: '$inflow1Discharge' },
          inflow2Level: { $first: '$inflow2Level' },
          inflow2Discharge: { $first: '$inflow2Discharge' },
          damDownstreamLevel: { $first: '$damDownstreamLevel' },
          damDownstreamDischarge: { $first: '$damDownstreamDischarge' },
          pondLevel: { $first: '$pondLevel' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          inflow1Level: 1,
          inflow1Discharge: 1,
          inflow2Level: 1,
          inflow2Discharge: 1,
          damDownstreamLevel: 1,
          damDownstreamDischarge: 1,
          pondLevel: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
      {
        $facet: {
          data: [{ $skip: startIndex }, { $limit: perPage }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];

    const srspInflowOutflowPondLevelReport = await SRSP_POND_LEVEL_OVERVIEW.aggregate(pipeline);

    let totalCount = srspInflowOutflowPondLevelReport[0]?.totalCount[0]?.count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: srspInflowOutflowPondLevelReport[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage,
    };
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspParameterOverviewReport = async (
  startDate,
  endDate,
  intervalMinutes,
  currentPage,
  perPage,
  startIndex,
  user,
  res,
  req
) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if (
      user.role === 'admin' ||
      user.role === 'srspSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {

    const pipeline = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          pondLevel: { $first: '$pondLevel' },
          liveCapacity: { $first: '$liveCapacity' },
          grossStorage: { $first: '$grossStorage' },
          fullReservoirLevel: { $first: '$fullReservoirLevel' },
          contourArea: { $first: '$contourArea' },
          catchmentArea: { $first: '$catchmentArea' },
          ayacutArea: { $first: '$ayacutArea' },
          filling: { $first: '$filling' },
          instantaneousGateDischarge: { $first: '$instantaneousGateDischarge' },
          instantaneousCanalDischarge: { $first: '$instantaneousCanalDischarge' },
          totalDamDischarge: { $first: '$totalDamDischarge' },
          cumulativeDamDischarge: { $first: '$cumulativeDamDischarge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          pondLevel: 1,
          liveCapacity: 1,
          grossStorage: 1,
          fullReservoirLevel: 1,
          contourArea: 1,
          catchmentArea: 1,
          ayacutArea: 1,
          filling: 1,
          instantaneousGateDischarge: 1,
          instantaneousCanalDischarge: 1,
          totalDamDischarge: 1,
          cumulativeDamDischarge: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
      {
        $facet: {
          data: [{ $skip: startIndex }, { $limit: perPage }],
          totalCount: [{ $count: 'count' }],
        },
      },
    ];

    const srspParameterOverviewReport = await SRSP_POND_LEVEL_OVERVIEW.aggregate(pipeline);

    let totalCount = srspParameterOverviewReport[0]?.totalCount[0]?.count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: srspParameterOverviewReport[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage,
    };
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspHrDamGateReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, user, res, req) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role))) {

    const pipeline = [
      {
          $match: {
            dateTime: {
              $gt: new Date(startDate),
              $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
          },
      },
      {
          $group: {
              _id: {
                  interval: {
                      $toDate: {
                          $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
                      },
                  },
              },
              hrkGate1Position: { $first: '$hrkGate1Position' },
              hrkGate2Position: { $first: '$hrkGate2Position' },
              hrkGate3Position: { $first: '$hrkGate3Position' },
              hrkGate4Position: { $first: '$hrkGate4Position' },
              hrsGate1Position: { $first: '$hrsGate1Position' },
              hrsGate2Position: { $first: '$hrsGate2Position' },
              hrfGate1Position: { $first: '$hrfGate1Position' },
              hrfGate2Position: { $first: '$hrfGate2Position' },
              hrfGate3Position: { $first: '$hrfGate3Position' },
              hrfGate4Position: { $first: '$hrfGate4Position' },
              hrfGate5Position: { $first: '$hrfGate5Position' },
              hrfGate6Position: { $first: '$hrfGate6Position' },
              hrlManGate1Position: { $first: '$hrlManGate1Position' },
              hrlManGate2Position: { $first: '$hrlManGate2Position' },
          },
      },
      {
          $project: {
              _id: 0,
              dateTime: '$_id.interval',
              hrkGate1Position: 1,
              hrkGate2Position: 1,
              hrkGate3Position: 1,
              hrkGate4Position: 1,
              hrsGate1Position: 1,
              hrsGate2Position: 1,
              hrfGate1Position: 1,
              hrfGate2Position: 1,
              hrfGate3Position: 1,
              hrfGate4Position: 1,
              hrfGate5Position: 1,
              hrfGate6Position: 1,
              hrlManGate1Position: 1,
              hrlManGate2Position: 1,
          },
      },
      {
          $sort: {
              dateTime: 1,
          },
      },
      {
          $facet: {
              data: [{ $skip: startIndex }, { $limit: perPage }],
              totalCount: [{ $count: 'count' }],
          },
      },
  ];
  

    const pipeline1 = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lt: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
        },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          hrkGate1Discharge: { $first: '$hrkGate1Discharge' },
          hrkGate2Discharge: { $first: '$hrkGate2Discharge' },
          hrkGate3Discharge: { $first: '$hrkGate3Discharge' },
          hrkGate4Discharge: { $first: '$hrkGate4Discharge' },
          hrsGate1Discharge: { $first: '$hrsGate1Discharge' },
          hrsGate2Discharge: { $first: '$hrsGate2Discharge' },
          hrfGate1Discharge: { $first: '$hrfGate1Discharge' },
          hrfGate2Discharge: { $first: '$hrfGate2Discharge' },
          hrfGate3Discharge: { $first: '$hrfGate3Discharge' },
          hrfGate4Discharge: { $first: '$hrfGate4Discharge' },
          hrfGate5Discharge: { $first: '$hrfGate5Discharge' },
          hrfGate6Discharge: { $first: '$hrfGate6Discharge' },
          hrlManGate1Discharge: { $first: '$hrlManGate1Discharge' },
          hrlManGate2Discharge: { $first: '$hrlManGate2Discharge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrkGate1Discharge: 1,
          hrkGate2Discharge: 1,
          hrkGate3Discharge: 1,
          hrkGate4Discharge: 1,
          hrsGate1Discharge: 1,
          hrsGate2Discharge: 1,
          hrfGate1Discharge: 1,
          hrfGate2Discharge: 1,
          hrfGate3Discharge: 1,
          hrfGate4Discharge: 1,
          hrfGate5Discharge: 1,
          hrfGate6Discharge: 1,
          hrlManGate1Discharge: 1,
          hrlManGate2Discharge: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
      {
        $facet: {
          data: [{ $skip: startIndex }, { $limit: perPage }],
          totalCount: [{ $count: 'count' }],
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

      const kakatiyaTotalDischarge = hrkGate1Discharge + hrkGate2Discharge + hrkGate3Discharge + hrkGate4Discharge;
      const saraswatiTotalDischarge = hrsGate1Discharge + hrsGate2Discharge;
      const floodFlowTotalDischarge =
        hrfGate1Discharge +
        hrfGate2Discharge +
        hrfGate3Discharge +
        hrfGate4Discharge +
        hrfGate5Discharge +
        hrfGate6Discharge;
      const lakshmiGateTotalDischarge = hrlManGate1Discharge + hrlManGate2Discharge;

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
        hrsGate1Discharge: hrsGate1Discharge,
        hrsGate2Discharge: hrsGate2Discharge,
        saraswatiTotalDischarge: saraswatiTotalDischarge,
        hrfGate1Discharge: hrfGate1Discharge,
        hrfGate2Discharge: hrfGate2Discharge,
        hrfGate3Discharge: hrfGate3Discharge,
        hrfGate4Discharge: hrfGate4Discharge,
        hrfGate5Discharge: hrfGate5Discharge,
        hrfGate6Discharge: hrfGate6Discharge,
        floodFlowTotalDischarge: floodFlowTotalDischarge,
        hrlManGate1Discharge: hrlManGate1Discharge,
        hrlManGate2Discharge: hrlManGate2Discharge,
        lakshmiGateTotalDischarge: lakshmiGateTotalDischarge,
      };
    });

    let totalCount = srspHrDamGateReportPos[0]?.totalCount[0]?.count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: mergedData,
      currentPage,
      perPage,
      totalCount,
      totalPage,
    };
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspAdvmOverviewReport = async (
  startDate,
  endDate,
  intervalMinutes,
  currentPage,
  perPage,
  startIndex,
  user,
  res,
  req
) => {
  try {
    const checkPermission = await Permission.findOne({ name: "lmdReport" });

    if (
      user.role === "admin" ||
      user.role === "lmdSuperuser" ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const pipeline = [
        {
          $match: {
            dateTime: {
              $gt: new Date(startDate),
              $lte: new Date(
                new Date(endDate).setDate(new Date(endDate).getDate() + 1)
              ),
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
                    {
                      $mod: [
                        { $toLong: "$dateTime" },
                        intervalMinutes * 60 * 1000,
                      ],
                    },
                  ],
                },
              },
            },
            hrkFlowRate: { $first: "$hrkFlowRate" },
            hrkTotalizer: { $first: "$hrkTotalizer" },
            hrkCDQ: { $first: "$hrkCDQ" },
            hrkLDQ: { $first: "$hrkLDQ" },
            hrkMQ: { $first: "$hrkMQ" },
            hrkVelocity: { $first: "$hrkVelocity" }
        
          },
        },
        {
          $project: {
            _id: 0,
            dateTime: "$_id.interval",
            hrkFlowRate: 1,
            hrkTotalizer: 1,
            hrkCDQ: 1,
            hrkLDQ: 1,
            hrkMQ: 1,
            hrkVelocity: 1
          },
        },
        {
          $sort: {
            dateTime: 1,
          },
        },
        {
          $facet: {
            data: [{ $skip: startIndex }, { $limit: perPage }],
            totalCount: [{ $count: "count" }],
          },
        },
      ];

      const srspAdvmOverviewReport = await SRSP_HR_KAKATIYA_ADVM.aggregate(
        pipeline
      );

      let totalCount = srspAdvmOverviewReport[0]?.totalCount[0]?.count;
      const totalPage = Math.ceil(totalCount / perPage);

      return {
        data: srspAdvmOverviewReport[0]?.data,
        currentPage,
        perPage,
        totalCount,
        totalPage,
      };
    } else {
      return "You are not authorized to access this data";
    }
  } catch (error) {
    console.error("Error:", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const sevenDayReport = async (user) => {
  try {
    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if (
      user.role === 'admin' ||
      user.role === 'srspSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
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

//Report Download
const srspDischargeGate1TO21ReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role))) {

    const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          gate1Discharge: { $first: '$gate1Discharge' },
          gate2Discharge: { $first: '$gate2Discharge' },
          gate3Discharge: { $first: '$gate3Discharge' },
          gate4Discharge: { $first: '$gate4Discharge' },
          gate5Discharge: { $first: '$gate5Discharge' },
          gate6Discharge: { $first: '$gate6Discharge' },
          gate7Discharge: { $first: '$gate7Discharge' },
          gate8Discharge: { $first: '$gate8Discharge' },
          gate9Discharge: { $first: '$gate9Discharge' },
          gate10Discharge: { $first: '$gate10Discharge' },
          gate11Discharge: { $first: '$gate11Discharge' },
          gate12Discharge: { $first: '$gate12Discharge' },
          gate13Discharge: { $first: '$gate13Discharge' },
          gate14Discharge: { $first: '$gate14Discharge' },
          gate15Discharge: { $first: '$gate15Discharge' },
          gate16Discharge: { $first: '$gate16Discharge' },
          gate17Discharge: { $first: '$gate17Discharge' },
          gate18Discharge: { $first: '$gate18Discharge' },
          gate19Discharge: { $first: '$gate19Discharge' },
          gate20Discharge: { $first: '$gate20Discharge' },
          gate21Discharge: { $first: '$gate21Discharge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
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
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const srspDischargeGate1TO21ReportWithoutPagination = await SRSP_SSD_DAM_OVERVIEW_DICH.aggregate(
      pipelineWithoutPagination
    );

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('SRSP Dam Gate 1 To 21 Discharge Report');

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: 'png',
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: 'oneCell',
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 4]);
      addImageToWorksheet(chetasImagePath, [18.6, 20]);


      if (req.query.selectedGates == null || req.query.selectedGates == 0) {
        const headers = ['DateTime', ...Array.from({ length: 21 }, (_, i) => `Gate ${i + 1} \n (Cusecs)`)];
        worksheet.addRows([[]]);
  
        worksheet.addRow(headers).eachCell((cell) => {
          cell.border = {
              top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
          };
          cell.alignment = { horizontal: 'center' };
        });
  
        srspDischargeGate1TO21ReportWithoutPagination.forEach((row) => {
          const rowData = [row.dateTime, ...Array.from({ length: 21 }, (_, i) => row[`gate${i + 1}Discharge`])];
          worksheet.addRow(rowData);
        });
      } else {
        let selectedGatesString = req.query.selectedGates;
        selectedGatesString = selectedGatesString.replace(/\[|\]/g, "");
        const selectedGates = selectedGatesString.split(",").map(Number);

        const headers = [
          "DateTime",
          ...selectedGates.map((gate) => `Gate ${gate} \n (Cusecs)`),
        ];

        worksheet.addRows([[]]);

        worksheet.addRow(headers).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { horizontal: "center" };
        });

        srspDischargeGate1TO21ReportWithoutPagination.forEach((row) => {
          const rowData = [row.dateTime];
          selectedGates.forEach((gate) => {
            const fieldName = "gate" + gate + "Discharge";
            if (row.hasOwnProperty(fieldName)) {
              rowData.push(row[fieldName]);
            } else {
              rowData.push(null);
            }
          });
          worksheet.addRow(rowData);
        });
      }

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';


      worksheet.mergeCells('A1:V8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      mergedCell.value = 'SRSP Dam Gate 1 To 21 Discharge Report';
      mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(11).height = 30;

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: 'thin', // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: 'FF000000' }, 
      };

      worksheet.getColumn('B').eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_Gate_1_To_21__Discharge_Report.xlsx');
      await workbook.xlsx.write(res);
    } else if (exportToExcel == 3) {
      try {

        const itemsPerPage = 26; // Number of dates to print per page
        const totalItems = srspDischargeGate1TO21ReportWithoutPagination.length; // Total number of dates
        const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

        const sections = [];
        for (let page = 0; page < totalPages; page++) {
          const startIndex = page * itemsPerPage;
          const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
          const pageData = srspDischargeGate1TO21ReportWithoutPagination.slice(startIndex, endIndex);

          sections.push({
            properties: {
              page: {
                margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
                size: {
                  orientation: Docx.PageOrientation.PORTRAIT,
                  width: 12240,
                  height: 15840,
                },
              },
            },
            children: [
              // Add your images and heading here at the top of every page
              new Docx.Paragraph({
                children: [
                  // Left image
                  new Docx.ImageRun({
                    data: fs.readFileSync(hyderabadImagePath),
                    transformation: {
                      width: 140,
                      height: 105,
                    },
                    floating: {
                      horizontalPosition: {
                        relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                        align: Docx.HorizontalPositionAlign.LEFT,
                      },
                      verticalPosition: {
                        relative: Docx.VerticalPositionRelativeFrom.PAGE,
                        align: Docx.VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                  // Right image
                  new Docx.ImageRun({
                    data: fs.readFileSync(chetasImagePath),
                    transformation: {
                      width: 80,
                      height: 110,
                    },
                    floating: {
                      horizontalPosition: {
                        relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                        align: Docx.HorizontalPositionAlign.RIGHT,
                      },
                      verticalPosition: {
                        relative: Docx.VerticalPositionRelativeFrom.PAGE,
                        align: Docx.VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                ],
              }),

              // Heading
              new Docx.Paragraph({
                text: 'SRSP Dam Gate 1 To 21 Discharge Report',
                heading: Docx.HeadingLevel.HEADING_1,
                alignment: Docx.AlignmentType.CENTER,
              }),

              // Table
              new Docx.Table({
                width: { size: '109%', type: Docx.WidthType.PERCENTAGE },
                rows: [
                  // Table header
                  new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph('Date Time')],
                        alignment: { horizontal: Docx.AlignmentType.CENTER },
                        // Adjusted width for Date Time column
                      }),
                      // Adjust the width for each gate column
                      ...Array.from(
                        { length: 21 },
                        (_, i) =>
                          new Docx.TableCell({
                            children: [new Docx.Paragraph(`Gate ${i + 1}`)],
                            alignment: { horizontal: Docx.AlignmentType.CENTER },
                            // Adjusted width for gate columns
                          })
                      ),
                    ],
                  }),

                  // Table rows
                  ...pageData.map((item) => {
                    const formattedDate = new Date(item.dateTime).toISOString().replace('T', '   T').slice(0, -8);
                    return new Docx.TableRow({
                      children: [
                        new Docx.TableCell({
                          children: [new Docx.Paragraph(formattedDate)],
                          alignment: { horizontal: Docx.AlignmentType.CENTER },
                          // Adjusted width for Date Time column
                        }),
                        // Include each gate discharge value
                        ...Array.from(
                          { length: 21 },
                          (_, i) =>
                            new Docx.TableCell({
                              children: [new Docx.Paragraph(item[`gate${i + 1}Discharge`].toFixed(2))],
                              alignment: { horizontal: Docx.AlignmentType.CENTER },
                              // Adjusted width for gate columns
                            })
                        ),
                      ],
                    });
                  }),
                ],
              }),
            ],
          });
        }

        const doc = new Docx.Document({
          sections: sections,
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_Gate_1_To_21_Discharge_Report.doc');

        // Stream the Word document to the response
        const buffer = await Docx.Packer.toBuffer(doc);
        res.end(buffer);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
    } else {
      res.send(srspDischargeGate1TO21ReportWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspDischargeGate22TO42ReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role))) {

    const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          gate22Discharge: { $first: '$gate22Discharge' },
          gate23Discharge: { $first: '$gate23Discharge' },
          gate24Discharge: { $first: '$gate24Discharge' },
          gate25Discharge: { $first: '$gate25Discharge' },
          gate26Discharge: { $first: '$gate26Discharge' },
          gate27Discharge: { $first: '$gate27Discharge' },
          gate28Discharge: { $first: '$gate28Discharge' },
          gate29Discharge: { $first: '$gate29Discharge' },
          gate30Discharge: { $first: '$gate30Discharge' },
          gate31Discharge: { $first: '$gate31Discharge' },
          gate32Discharge: { $first: '$gate32Discharge' },
          gate33Discharge: { $first: '$gate33Discharge' },
          gate34Discharge: { $first: '$gate34Discharge' },
          gate35Discharge: { $first: '$gate35Discharge' },
          gate36Discharge: { $first: '$gate36Discharge' },
          gate37Discharge: { $first: '$gate37Discharge' },
          gate38Discharge: { $first: '$gate38Discharge' },
          gate39Discharge: { $first: '$gate39Discharge' },
          gate40Discharge: { $first: '$gate40Discharge' },
          gate41Discharge: { $first: '$gate41Discharge' },
          gate42Discharge: { $first: '$gate42Discharge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
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
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const srspDischargeGate22TO42ReportWithoutPagination = await SRSP_SSD_DAM_OVERVIEW_DICH.aggregate(
      pipelineWithoutPagination
    );

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('SRSP Dam Gate 22 To 42 Discharge Report');

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: 'png',
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: 'oneCell',
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 4]);
      addImageToWorksheet(chetasImagePath, [18.6, 20]);

      if (req.query.selectedGates == null || req.query.selectedGates == 0) {
        const headers = ['DateTime', ...Array.from({ length: 21 }, (_, i) => `Gate ${i + 22} \n (Cusecs)`)];
        worksheet.addRow([]);
  
        worksheet.addRow(headers).eachCell((cell) => {
          cell.border = {
              top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
          };
          cell.alignment = { horizontal: 'center' };
        });
  
        srspDischargeGate22TO42ReportWithoutPagination.forEach((row) => {
          const rowData = [row.dateTime, ...Array.from({ length: 21 }, (_, i) => row[`gate${i + 22}Discharge`])];
          worksheet.addRow(rowData);
        });
      } else {
        let selectedGatesString = req.query.selectedGates;
        selectedGatesString = selectedGatesString.replace(/\[|\]/g, "");
        const selectedGates = selectedGatesString.split(",").map(Number);

        const headers = [
          "DateTime",
          ...selectedGates.map((gate) => `Gate ${gate} \n (Cusecs)`),
        ];

        worksheet.addRows([[]]);

        worksheet.addRow(headers).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { horizontal: "center" };
        });

        srspDischargeGate22TO42ReportWithoutPagination.forEach((row) => {
          const rowData = [row.dateTime];
          selectedGates.forEach((gate) => {
            const fieldName = "gate" + gate + "Discharge";
            if (row.hasOwnProperty(fieldName)) {
              rowData.push(row[fieldName]);
            } else {
              rowData.push(null);
            }
          });
          worksheet.addRow(rowData);
        });
      }

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';

      worksheet.mergeCells('A1:V8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      
      mergedCell.value = 'SRSP Dam Gate 22 To 42 Discharge Report';
      mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(11).height = 30;

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: 'thin', // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: 'FF000000' }, 
      };

      worksheet.getColumn('B').eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });


      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_Gate_22_To_42__Discharge_Report.xlsx');
      await workbook.xlsx.write(res);
    }else if (exportToExcel == 3) {
      try {

        const itemsPerPage = 26; // Number of dates to print per page
        const totalItems = srspDischargeGate22TO42ReportWithoutPagination.length; // Total number of dates
        const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

        const sections = [];
        for (let page = 0; page < totalPages; page++) {
          const startIndex = page * itemsPerPage;
          const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
          const pageData = srspDischargeGate22TO42ReportWithoutPagination.slice(startIndex, endIndex);

          sections.push({
            properties: {
              page: {
                margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
                size: {
                  orientation: Docx.PageOrientation.PORTRAIT,
                  width: 12240,
                  height: 15840,
                },
              },
            },
            children: [
              // Add your images and heading here at the top of every page
              new Docx.Paragraph({
                children: [
                  // Left image
                  new Docx.ImageRun({
                    data: fs.readFileSync(hyderabadImagePath),
                    transformation: {
                      width: 140,
                      height: 105,
                    },
                    floating: {
                      horizontalPosition: {
                        relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                        align: Docx.HorizontalPositionAlign.LEFT,
                      },
                      verticalPosition: {
                        relative: Docx.VerticalPositionRelativeFrom.PAGE,
                        align: Docx.VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                  // Right image
                  new Docx.ImageRun({
                    data: fs.readFileSync(chetasImagePath),
                    transformation: {
                      width: 80,
                      height: 110,
                    },
                    floating: {
                      horizontalPosition: {
                        relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                        align: Docx.HorizontalPositionAlign.RIGHT,
                      },
                      verticalPosition: {
                        relative: Docx.VerticalPositionRelativeFrom.PAGE,
                        align: Docx.VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                ],
              }),

              // Heading
              new Docx.Paragraph({
                text: 'SRSP Dam Gate 22 To 42 Discharge Report',
                heading: Docx.HeadingLevel.HEADING_1,
                alignment: Docx.AlignmentType.CENTER,
              }),

              // Table
              new Docx.Table({
                width: { size: '109%', type: Docx.WidthType.PERCENTAGE },
                rows: [
                  // Table header
                  new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph('Date Time')],
                        alignment: { horizontal: Docx.AlignmentType.CENTER },
                        // Adjusted width for Date Time column
                      }),
                      // Adjust the width for each gate column
                      ...Array.from(
                        { length: 21 },
                        (_, i) =>
                          new Docx.TableCell({
                            children: [new Docx.Paragraph(`Gate ${i + 22}`)],
                            alignment: { horizontal: Docx.AlignmentType.CENTER },
                            // Adjusted width for gate columns
                          })
                      ),
                    ],
                  }),

                  // Table rows
                  ...pageData.map((item) => {
                    const formattedDate = new Date(item.dateTime).toISOString().replace('T', '   T').slice(0, -8);
                    return new Docx.TableRow({
                      children: [
                        new Docx.TableCell({
                          children: [new Docx.Paragraph(formattedDate)],
                          alignment: { horizontal: Docx.AlignmentType.CENTER },
                          // Adjusted width for Date Time column
                        }),
                        // Include each gate discharge value
                        ...Array.from(
                          { length: 21 },
                          (_, i) =>
                            new Docx.TableCell({
                              children: [new Docx.Paragraph(item[`gate${i + 22}Discharge`].toFixed(2))],
                              alignment: { horizontal: Docx.AlignmentType.CENTER },
                              // Adjusted width for gate columns
                            })
                        ),
                      ],
                    });
                  }),
                ],
              }),
            ],
          });
        }

        const doc = new Docx.Document({
          sections: sections,
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_Gate_22_To_42_Discharge_Report.doc');

        // Stream the Word document to the response
        const buffer = await Docx.Packer.toBuffer(doc);
        res.end(buffer);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
    } else {
      res.send(srspDischargeGate22TO42ReportWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspOpeningGate1TO21ReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role))) {

    const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          gate1Position: { $first: '$gate1Position' },
          gate2Position: { $first: '$gate2Position' },
          gate3Position: { $first: '$gate3Position' },
          gate4Position: { $first: '$gate4Position' },
          gate5Position: { $first: '$gate5Position' },
          gate6Position: { $first: '$gate6Position' },
          gate7Position: { $first: '$gate7Position' },
          gate8Position: { $first: '$gate8Position' },
          gate9Position: { $first: '$gate9Position' },
          gate10Position: { $first: '$gate10Position' },
          gate11Position: { $first: '$gate11Position' },
          gate12Position: { $first: '$gate12Position' },
          gate13Position: { $first: '$gate13Position' },
          gate14Position: { $first: '$gate14Position' },
          gate15Position: { $first: '$gate15Position' },
          gate16Position: { $first: '$gate16Position' },
          gate17Position: { $first: '$gate17Position' },
          gate18Position: { $first: '$gate18Position' },
          gate19Position: { $first: '$gate19Position' },
          gate20Position: { $first: '$gate20Position' },
          gate21Position: { $first: '$gate21Position' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
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
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const srspOpeningGate1TO21ReportWithoutPagination = await SRSP_SSD_DAM_OVERVIEW_POS.aggregate(pipelineWithoutPagination);

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('SRSP Dam Gate 1 To 21 Opening Report');

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: 'png',
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: 'oneCell',
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 4]);
      addImageToWorksheet(chetasImagePath, [18.6, 20]);


      if (req.query.selectedGates == null || req.query.selectedGates == 0) {
        const headers = ['DateTime', ...Array.from({ length: 21 }, (_, i) => `Gate ${i + 1} \n (Feet)`)];
        worksheet.addRows([[]]);
  
        worksheet.addRow(headers).eachCell((cell) => {
          cell.border = {
              top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
          };
          cell.alignment = { horizontal: 'center' };
        });
  
        srspOpeningGate1TO21ReportWithoutPagination.forEach((row) => {
          const rowData = [row.dateTime, ...Array.from({ length: 21 }, (_, i) => row[`gate${i + 1}Position`])];
          worksheet.addRow(rowData);
        });
      } else {
        let selectedGatesString = req.query.selectedGates;
        selectedGatesString = selectedGatesString.replace(/\[|\]/g, "");
        const selectedGates = selectedGatesString.split(",").map(Number);

        const headers = [
          "DateTime",
          ...selectedGates.map((gate) => `Gate ${gate} \n (Feet)`),
        ];

        worksheet.addRows([[]]);

        worksheet.addRow(headers).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { horizontal: "center" };
        });

        srspOpeningGate1TO21ReportWithoutPagination.forEach((row) => {
          const rowData = [row.dateTime];
          selectedGates.forEach((gate) => {
            const fieldName = "gate" + gate + "Position";
            if (row.hasOwnProperty(fieldName)) {
              rowData.push(row[fieldName]);
            } else {
              rowData.push(null);
            }
          });
          worksheet.addRow(rowData);
        });
      }

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';

      worksheet.mergeCells('A1:V8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      mergedCell.value = 'SRSP Dam Gate 1 To 21 Opening Report';
      mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(11).height = 30;

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: 'thin', // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: 'FF000000' }, 
      };

      worksheet.getColumn('B').eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_Gate_1_To_21__Opening_Report.xlsx');

      await workbook.xlsx.write(res);
    } else if (exportToExcel == 3) {
      try {

        const itemsPerPage = 26; // Number of dates to print per page
        const totalItems = srspOpeningGate1TO21ReportWithoutPagination.length; // Total number of dates
        const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

        const sections = [];
        for (let page = 0; page < totalPages; page++) {
          const startIndex = page * itemsPerPage;
          const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
          const pageData = srspOpeningGate1TO21ReportWithoutPagination.slice(startIndex, endIndex);

          sections.push({
            properties: {
              page: {
                margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
                size: {
                  orientation: Docx.PageOrientation.PORTRAIT,
                  width: 12240,
                  height: 15840,
                },
              },
            },
            children: [
              // Add your images and heading here at the top of every page
              new Docx.Paragraph({
                children: [
                  // Left image
                  new Docx.ImageRun({
                    data: fs.readFileSync(hyderabadImagePath),
                    transformation: {
                      width: 140,
                      height: 105,
                    },
                    floating: {
                      horizontalPosition: {
                        relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                        align: Docx.HorizontalPositionAlign.LEFT,
                      },
                      verticalPosition: {
                        relative: Docx.VerticalPositionRelativeFrom.PAGE,
                        align: Docx.VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                  // Right image
                  new Docx.ImageRun({
                    data: fs.readFileSync(chetasImagePath),
                    transformation: {
                      width: 80,
                      height: 110,
                    },
                    floating: {
                      horizontalPosition: {
                        relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                        align: Docx.HorizontalPositionAlign.RIGHT,
                      },
                      verticalPosition: {
                        relative: Docx.VerticalPositionRelativeFrom.PAGE,
                        align: Docx.VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                ],
              }),

              // Heading
              new Docx.Paragraph({
                text: 'SRSP Dam Gate 1 To 21 Opening Report',
                heading: Docx.HeadingLevel.HEADING_1,
                alignment: Docx.AlignmentType.CENTER,
              }),

              // Table
              new Docx.Table({
                width: { size: '109%', type: Docx.WidthType.PERCENTAGE },
                rows: [
                  // Table header
                  new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph('Date Time')],
                        alignment: { horizontal: Docx.AlignmentType.CENTER },
                        // Adjusted width for Date Time column
                      }),
                      // Adjust the width for each gate column
                      ...Array.from(
                        { length: 21 },
                        (_, i) =>
                          new Docx.TableCell({
                            children: [new Docx.Paragraph(`Gate ${i + 1}`)],
                            alignment: { horizontal: Docx.AlignmentType.CENTER },
                            // Adjusted width for gate columns
                          })
                      ),
                    ],
                  }),

                  // Table rows
                  ...pageData.map((item) => {
                    const formattedDate = new Date(item.dateTime).toISOString().replace('T', '   T').slice(0, -8);
                    return new Docx.TableRow({
                      children: [
                        new Docx.TableCell({
                          children: [new Docx.Paragraph(formattedDate)],
                          alignment: { horizontal: Docx.AlignmentType.CENTER },
                          // Adjusted width for Date Time column
                        }),
                        // Include each gate discharge value
                        ...Array.from(
                          { length: 21 },
                          (_, i) =>
                            new Docx.TableCell({
                              children: [new Docx.Paragraph(item[`gate${i + 1}Position`].toFixed(2))],
                              alignment: { horizontal: Docx.AlignmentType.CENTER },
                              // Adjusted width for gate columns
                            })
                        ),
                      ],
                    });
                  }),
                ],
              }),
            ],
          });
        }

        const doc = new Docx.Document({
          sections: sections,
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_Gate_1_To_21_Opening_Report.doc');

        // Stream the Word document to the response
        const buffer = await Docx.Packer.toBuffer(doc);
        res.end(buffer);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
    } else {
      res.send(srspOpeningGate1TO21ReportWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspOpeningGate22TO42ReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role))) {

    const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          gate22Position: { $first: '$gate22Position' },
          gate23Position: { $first: '$gate23Position' },
          gate24Position: { $first: '$gate24Position' },
          gate25Position: { $first: '$gate25Position' },
          gate26Position: { $first: '$gate26Position' },
          gate27Position: { $first: '$gate27Position' },
          gate28Position: { $first: '$gate28Position' },
          gate29Position: { $first: '$gate29Position' },
          gate30Position: { $first: '$gate30Position' },
          gate31Position: { $first: '$gate31Position' },
          gate32Position: { $first: '$gate32Position' },
          gate33Position: { $first: '$gate33Position' },
          gate34Position: { $first: '$gate34Position' },
          gate35Position: { $first: '$gate35Position' },
          gate36Position: { $first: '$gate36Position' },
          gate37Position: { $first: '$gate37Position' },
          gate38Position: { $first: '$gate38Position' },
          gate39Position: { $first: '$gate39Position' },
          gate40Position: { $first: '$gate40Position' },
          gate41Position: { $first: '$gate41Position' },
          gate42Position: { $first: '$gate42Position' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
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
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const srspOpeningGate22TO42ReportWithoutPagination = await SRSP_SSD_DAM_OVERVIEW_POS.aggregate(
      pipelineWithoutPagination
    );

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('SRSP Dam Gate 22 To 42 Opening Report');

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: 'png',
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: 'oneCell',
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 4]);
      addImageToWorksheet(chetasImagePath, [18.6, 20]);


      if (req.query.selectedGates == null || req.query.selectedGates == 0) {
        const headers = ['DateTime', ...Array.from({ length: 21 }, (_, i) => `Gate ${i + 22} \n (Feet)`)];
        worksheet.addRows([[]]);
  
        worksheet.addRow(headers).eachCell((cell) => {
          cell.border = {
              top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
          };
          cell.alignment = { horizontal: 'center' };
        });
  
        srspOpeningGate22TO42ReportWithoutPagination.forEach((row) => {
          const rowData = [row.dateTime, ...Array.from({ length: 21 }, (_, i) => row[`gate${i + 22}Position`])];
          worksheet.addRow(rowData);
        });
      } else {
        let selectedGatesString = req.query.selectedGates;
        selectedGatesString = selectedGatesString.replace(/\[|\]/g, "");
        const selectedGates = selectedGatesString.split(",").map(Number);

        const headers = [
          "DateTime",
          ...selectedGates.map((gate) => `Gate ${gate} \n (Feet)`),
        ];

        worksheet.addRows([[]]);

        worksheet.addRow(headers).eachCell((cell) => {
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = { horizontal: "center" };
        });

        srspOpeningGate22TO42ReportWithoutPagination.forEach((row) => {
          const rowData = [row.dateTime];
          selectedGates.forEach((gate) => {
            const fieldName = "gate" + gate + "Position";
            if (row.hasOwnProperty(fieldName)) {
              rowData.push(row[fieldName]);
            } else {
              rowData.push(null);
            }
          });
          worksheet.addRow(rowData);
        });
      }

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';

      worksheet.mergeCells('A1:V8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      mergedCell.value = 'SRSP Dam Gate 22 To 42 Opening Report';
      mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(11).height = 30;

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: 'thin', // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: 'FF000000' }, 
      };

      worksheet.getColumn('B').eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V'].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_Gate_22_To_42__Opening_Report.xlsx');

      await workbook.xlsx.write(res);
    }  else if (exportToExcel == 3) {
      try {
   
        const itemsPerPage = 26; // Number of dates to print per page
        const totalItems = srspOpeningGate22TO42ReportWithoutPagination.length; // Total number of dates
        const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

        const sections = [];
        for (let page = 0; page < totalPages; page++) {
          const startIndex = page * itemsPerPage;
          const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
          const pageData = srspOpeningGate22TO42ReportWithoutPagination.slice(startIndex, endIndex);

          sections.push({
            properties: {
              page: {
                margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
                size: {
                  orientation: Docx.PageOrientation.PORTRAIT,
                  width: 12240,
                  height: 15840,
                },
              },
            },
            children: [
              // Add your images and heading here at the top of every page
              new Docx.Paragraph({
                children: [
                  // Left image
                  new Docx.ImageRun({
                    data: fs.readFileSync(hyderabadImagePath),
                    transformation: {
                      width: 140,
                      height: 105,
                    },
                    floating: {
                      horizontalPosition: {
                        relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                        align: Docx.HorizontalPositionAlign.LEFT,
                      },
                      verticalPosition: {
                        relative: Docx.VerticalPositionRelativeFrom.PAGE,
                        align: Docx.VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                  // Right image
                  new Docx.ImageRun({
                    data: fs.readFileSync(chetasImagePath),
                    transformation: {
                      width: 80,
                      height: 110,
                    },
                    floating: {
                      horizontalPosition: {
                        relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                        align: Docx.HorizontalPositionAlign.RIGHT,
                      },
                      verticalPosition: {
                        relative: Docx.VerticalPositionRelativeFrom.PAGE,
                        align: Docx.VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                ],
              }),

              // Heading
              new Docx.Paragraph({
                text: 'SRSP Dam Gate 22 To 42 Opening Report',
                heading: Docx.HeadingLevel.HEADING_1,
                alignment: Docx.AlignmentType.CENTER,
              }),

              // Table
              new Docx.Table({
                width: { size: '109%', type: Docx.WidthType.PERCENTAGE },
                rows: [
                  // Table header
                  new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph('Date Time')],
                        alignment: { horizontal: Docx.AlignmentType.CENTER },
                        // Adjusted width for Date Time column
                      }),
                      // Adjust the width for each gate column
                      ...Array.from(
                        { length: 21 },
                        (_, i) =>
                          new Docx.TableCell({
                            children: [new Docx.Paragraph(`Gate ${i + 22}`)],
                            alignment: { horizontal: Docx.AlignmentType.CENTER },
                            // Adjusted width for gate columns
                          })
                      ),
                    ],
                  }),

                  // Table rows
                  ...pageData.map((item) => {
                    const formattedDate = new Date(item.dateTime).toISOString().replace('T', '   T').slice(0, -8);
                    return new Docx.TableRow({
                      children: [
                        new Docx.TableCell({
                          children: [new Docx.Paragraph(formattedDate)],
                          alignment: { horizontal: Docx.AlignmentType.CENTER },
                          // Adjusted width for Date Time column
                        }),
                        // Include each gate discharge value
                        ...Array.from(
                          { length: 21 },
                          (_, i) =>
                            new Docx.TableCell({
                              children: [new Docx.Paragraph(item[`gate${i + 22}Position`].toFixed(2))],
                              alignment: { horizontal: Docx.AlignmentType.CENTER },
                              // Adjusted width for gate columns
                            })
                        ),
                      ],
                    });
                  }),
                ],
              }),
            ],
          });
        }

        const doc = new Docx.Document({
          sections: sections,
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_Gate_22_To_42_Opening_Report.doc');

        // Stream the Word document to the response
        const buffer = await Docx.Packer.toBuffer(doc);
        res.end(buffer);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
    } else {
      res.send(srspOpeningGate22TO42ReportWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspInflowOutflowPondLevelReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role))) {

    const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          inflow1Level: { $first: '$inflow1Level' },
          inflow1Discharge: { $first: '$inflow1Discharge' },
          inflow2Level: { $first: '$inflow2Level' },
          inflow2Discharge: { $first: '$inflow2Discharge' },
          damDownstreamLevel: { $first: '$damDownstreamLevel' },
          damDownstreamDischarge: { $first: '$damDownstreamDischarge' },
          pondLevel: { $first: '$pondLevel' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          inflow1Level: 1,
          inflow1Discharge: 1,
          inflow2Level: 1,
          inflow2Discharge: 1,
          damDownstreamLevel: 1,
          damDownstreamDischarge: 1,
          pondLevel: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const srspInflowOutflowPondLevelReportWithoutPagination = await SRSP_POND_LEVEL_OVERVIEW.aggregate(
      pipelineWithoutPagination
    );

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('SRSP Dam Inflow Outflow Pond-Level Report');

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: 'png',
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: 'oneCell',
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 2.5]);
      addImageToWorksheet(chetasImagePath, [6.9, 7]);

      const headers = [
        'DateTime',
        'BASAR Inflow Level (Feet)',
        'BASAR Inflow Discharge (Cusecs)',
        'Pendapally Inflow Level (Feet)',
        'Pendapally Inflow Discharge (Cusecs)',
        'SOAN Outflow Level (Feet)',
        'SOAN Outflow Discharge (Cusecs)',
        'Pond Level (Feet)',
      ];
      worksheet.addRow([]);

      worksheet.addRow(headers).eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        cell.alignment = { horizontal: 'center' };
      });

      srspInflowOutflowPondLevelReportWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.inflow1Level,
          row.inflow1Discharge,
          row.inflow2Level,
          row.inflow2Discharge,
          row.damDownstreamLevel,
          row.damDownstreamDischarge,
          row.pondLevel,
        ];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';

      worksheet.columns.forEach((column) => {
        column.width = 20;
      });

      worksheet.mergeCells('A1:H8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      mergedCell.value = 'SRSP Dam Inflow Outflow Pond-Level Report';
      mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(11).height = 30;

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: 'thin', // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: 'FF000000' }, 
      };

      worksheet.getColumn('B').eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_Inflow_Outflow_PondLevel_Report.xlsx');

      await workbook.xlsx.write(res);
    }else if (exportToExcel == 3) {

      const itemsPerPage = 25; // Number of dates to print per page
      const totalItems = srspInflowOutflowPondLevelReportWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = srspInflowOutflowPondLevelReportWithoutPagination.slice(startIndex, endIndex);

        sections.push({
          properties: {
            page: {
              margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
              size: {
                orientation: Docx.PageOrientation.PORTRAIT,
                width: 12240,
                height: 15840,
              },
            },
          },
          children: [
            // Add your images and heading here at the top of every page
            new Docx.Paragraph({
              children: [
                // Left image
                new Docx.ImageRun({
                  data: fs.readFileSync(hyderabadImagePath),
                  transformation: {
                    width: 140,
                    height: 105,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.LEFT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
                // Right image
                new Docx.ImageRun({
                  data: fs.readFileSync(chetasImagePath),
                  transformation: {
                    width: 80,
                    height: 110,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.RIGHT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
              ],
            }),
            // Heading
            new Docx.Paragraph({
              text: 'SRSP Dam Inflow Outflow Pond-Level Report',
              heading: Docx.HeadingLevel.HEADING_1,
              alignment: Docx.AlignmentType.CENTER,
            }),
            // Table
            new Docx.Table({
              width: { size: '109%', type: Docx.WidthType.PERCENTAGE },
              rows: [
                // Table header
                new Docx.TableRow({
                  children: [
                    new Docx.TableCell({ children: [new Docx.Paragraph('Date Time')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('BASAR Inflow Level (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('BASAR Inflow Discharge (Cusecs)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Pendapally Inflow Level (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Pendapally Inflow Discharge (Cusecs)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('SOAN Outflow Level (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('SOAN Outflow Discharge (Cusecs)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Pond Level (Feet)')] }),
                  ],
                }),
                // Table rows
                ...pageData.map((item) => {
                  const formattedDate = new Date(item.dateTime).toISOString().replace('T', '   T').slice(0, -8);
                  return new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph(formattedDate)],
                        width: { size: 12, type: Docx.WidthType.PERCENTAGE },
                      }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow1Level.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow1Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow2Level.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow2Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.damDownstreamLevel.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.damDownstreamDischarge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.pondLevel.toFixed(2))] }),
                    ],
                  });
                }),
              ],
            }),
          ],
        });
      }

      const doc = new Docx.Document({
        sections: sections,
      });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_Inflow_Outflow_PondLevel_Report.doc');

      // Stream the Word document to the response
      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else {
      res.send(srspInflowOutflowPondLevelReportWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspParameterOverviewReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role))) {

    const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          pondLevel: { $first: '$pondLevel' },
          liveCapacity: { $first: '$liveCapacity' },
          grossStorage: { $first: '$grossStorage' },
          fullReservoirLevel: { $first: '$fullReservoirLevel' },
          contourArea: { $first: '$contourArea' },
          catchmentArea: { $first: '$catchmentArea' },
          ayacutArea: { $first: '$ayacutArea' },
          filling: { $first: '$filling' },
          instantaneousGateDischarge: { $first: '$instantaneousGateDischarge' },
          instantaneousCanalDischarge: { $first: '$instantaneousCanalDischarge' },
          totalDamDischarge: { $first: '$totalDamDischarge' },
          cumulativeDamDischarge: { $first: '$cumulativeDamDischarge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          pondLevel: 1,
          liveCapacity: 1,
          grossStorage: 1,
          fullReservoirLevel: 1,
          contourArea: 1,
          catchmentArea: 1,
          ayacutArea: 1,
          filling: 1,
          instantaneousGateDischarge: 1,
          instantaneousCanalDischarge: 1,
          totalDamDischarge: 1,
          cumulativeDamDischarge: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const srspParameterOverviewReportWithoutPagination = await SRSP_POND_LEVEL_OVERVIEW.aggregate(pipelineWithoutPagination);

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('SRSP Dam Parameter Overview Report');

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: 'png',
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: 'oneCell',
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 2.7]);
      addImageToWorksheet(chetasImagePath, [8.9, 9]);

      const headers = [
        'DateTime',
        'Pond Level (Feet)',
        'Live Capacity (MCFT)',
        'Gross Storage (MCFT)',
        'FullReserve Water (Feet)',
        'Contour Area (M.SqFt.)',
        'Cathment Area (Sq.km)',
        'Ayucut Area (Acres)',
        'Filling Percetage (%)',
        'Inst. Gate Discharge (Cusecs)',
        'Inst. canal Discharge (Cusecs)',
        'Total Dam Discharge (Cusecs)',
        'Cumulative Dam Discharge (TMC)',
      ];
      worksheet.addRow([]);
     
      worksheet.addRow(headers).eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        cell.alignment = { horizontal: 'center' };
      });

      srspParameterOverviewReportWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.pondLevel,
          row.liveCapacity,
          row.grossStorage,
          row.fullReservoirLevel,
          row.contourArea,
          row.catchmentArea,
          row.ayacutArea,
          row.filling,
          row.instantaneousGateDischarge,
          row.instantaneousCanalDischarge,
          row.totalDamDischarge,
          row.cumulativeDamDischarge,
        ];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';


      worksheet.columns.forEach((column) => {
        column.width = 20;
      });

      worksheet.mergeCells('A1:J8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      mergedCell.value = 'SRSP Dam Parameter Overview Report';
      mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(11).height = 30;

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: 'thin', // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: 'FF000000' }, 
      };

      worksheet.getColumn('B').eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_Parameter_Overview_Report.xlsx');

      await workbook.xlsx.write(res);
    } else if (exportToExcel == 3) {
   
      const itemsPerPage = 25; // Number of dates to print per page
      const totalItems = srspParameterOverviewReportWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = srspParameterOverviewReportWithoutPagination.slice(startIndex, endIndex);

        sections.push({
          properties: {
            page: {
              margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
              size: {
                orientation: Docx.PageOrientation.PORTRAIT,
                width: 12240,
                height: 15840,
              },
            },
          },
          children: [
            // Add your images and heading here at the top of every page
            new Docx.Paragraph({
              children: [
                // Left image
                new Docx.ImageRun({
                  data: fs.readFileSync(hyderabadImagePath),
                  transformation: {
                    width: 140,
                    height: 105,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.LEFT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
                // Right image
                new Docx.ImageRun({
                  data: fs.readFileSync(chetasImagePath),
                  transformation: {
                    width: 80,
                    height: 110,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.RIGHT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
              ],
            }),

            // Heading
            new Docx.Paragraph({
              text: 'SRSP Dam Parameter Overview Report',
              heading: Docx.HeadingLevel.HEADING_1,
              alignment: Docx.AlignmentType.CENTER,
            }),

            // Table
            new Docx.Table({
              width: { size: '109%', type: Docx.WidthType.PERCENTAGE },
              rows: [
                // Table header
                new Docx.TableRow({
                  children: [
                    new Docx.TableCell({ children: [new Docx.Paragraph('Date Time')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Pond Level (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Live Capacity (MCFT)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gross Storage (MCFT)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Full Reserve Water (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Contour Area (M.SqFt)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Cathment Area (Sq.Km)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Ayucut Area (Acres)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Filing Percentage (%)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Inst. Gate Discharge (Cusecs)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Inst. canal Discharge (Cusecs)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Total Dam Discharge (Cusecs)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Cumulative Dam Discharge (Cusecs)')] }),
                  ],
                }),

                // Table rows
                ...pageData.map((item) => {
                  const formattedDate = new Date(item.dateTime).toISOString().replace('T', '   T').slice(0, -8);
                  return new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph(formattedDate)],
                        width: { size: 12, type: Docx.WidthType.PERCENTAGE },
                      }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.pondLevel.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.liveCapacity.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.grossStorage.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.fullReservoirLevel.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.contourArea.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.catchmentArea.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.ayacutArea.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.filling.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.instantaneousGateDischarge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.instantaneousCanalDischarge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.totalDamDischarge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.cumulativeDamDischarge.toFixed(2))] }),
                    ],
                  });
                }),
              ],
            }),
          ],
        });
      }

      const doc = new Docx.Document({
        sections: sections,
      });
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_Parameter_Overview_Report.doc');

      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else {
      res.send(srspParameterOverviewReportWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspHrKakatitaDamGateReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role))) {

    const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          hrkGate1Position: { $first: '$hrkGate1Position' },
          hrkGate2Position: { $first: '$hrkGate2Position' },
          hrkGate3Position: { $first: '$hrkGate3Position' },
          hrkGate4Position: { $first: '$hrkGate4Position' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrkGate1Position: 1,
          hrkGate2Position: 1,
          hrkGate3Position: 1,
          hrkGate4Position: 1
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const pipeline1WithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          hrkGate1Discharge: { $first: '$hrkGate1Discharge' },
          hrkGate2Discharge: { $first: '$hrkGate2Discharge' },
          hrkGate3Discharge: { $first: '$hrkGate3Discharge' },
          hrkGate4Discharge: { $first: '$hrkGate4Discharge' }
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrkGate1Discharge: 1,
          hrkGate2Discharge: 1,
          hrkGate3Discharge: 1,
          hrkGate4Discharge: 1
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const srspHrDamGateReportPosWithoutPagination = await SRSP_HR_DAM_OVERVIEW_POS.aggregate(pipelineWithoutPagination);
    const srspHrDamGateReportDisWithoutPagination = await SRSP_HR_DAM_OVERVIEW_DICH.aggregate(pipeline1WithoutPagination);

    let posDataWithoutPagination = srspHrDamGateReportPosWithoutPagination || [];
    let disDataWithoutPagination = srspHrDamGateReportDisWithoutPagination || [];

    let minLengthWithoutPagination = Math.max(posDataWithoutPagination.length, disDataWithoutPagination.length);

    let mergedDataWithoutPagination = Array.from({ length: minLengthWithoutPagination }, (_, index) => {
      const hrkGate1Discharge = disDataWithoutPagination[index]?.hrkGate1Discharge || 0;
      const hrkGate2Discharge = disDataWithoutPagination[index]?.hrkGate2Discharge || 0;
      const hrkGate3Discharge = disDataWithoutPagination[index]?.hrkGate3Discharge || 0;
      const hrkGate4Discharge = disDataWithoutPagination[index]?.hrkGate4Discharge || 0;

      const kakatiyaTotalDischarge = hrkGate1Discharge + hrkGate2Discharge + hrkGate3Discharge + hrkGate4Discharge;
      return {
        hrkGate1Position: posDataWithoutPagination[index]?.hrkGate1Position || 0,
        hrkGate2Position: posDataWithoutPagination[index]?.hrkGate2Position || 0,
        hrkGate3Position: posDataWithoutPagination[index]?.hrkGate3Position || 0,
        hrkGate4Position: posDataWithoutPagination[index]?.hrkGate4Position || 0,
        dateTime: posDataWithoutPagination[index]?.dateTime || disDataWithoutPagination[index]?.dateTime || null,

        hrkGate1Discharge: hrkGate1Discharge,
        hrkGate2Discharge: hrkGate2Discharge,
        hrkGate3Discharge: hrkGate3Discharge,
        hrkGate4Discharge: hrkGate4Discharge,
        kakatiyaTotalDischarge: kakatiyaTotalDischarge,
      };
    });

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('SRSP HR Kakatiya canal Gate Report');

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: 'png',
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: 'oneCell',
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 2.7]);
      addImageToWorksheet(chetasImagePath, [8.8, 9]);


      const headers = [
        'DateTime',
        'Opening (Feet)',
        'Discharge (C/S)',
        'Opening (Feet)',
        'Discharge (C/S)',
        'Opening (Feet)',
        'Discharge (C/S)',
        'Opening (Feet)',
        'Discharge (C/S)',
        'Total Discharge (C/S)',
      ];

      worksheet.addRows([[], headers]);
      worksheet.addRow(headers);

      worksheet.addRow(headers).eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        cell.alignment = { horizontal: 'center' };
      });

      mergedDataWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.hrkGate1Position,
          row.hrkGate1Discharge,
          row.hrkGate2Position,
          row.hrkGate2Discharge,
          row.hrkGate3Position,
          row.hrkGate3Discharge,
          row.hrkGate4Position,
          row.hrkGate4Discharge,
          row.kakatiyaTotalDischarge,
        ];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      worksheet.columns.forEach((column) => {
        column.width = 20;
      });

      worksheet.mergeCells('A1:J8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      mergedCell.value = 'SRSP HR Kakatiya canal Gate Report';
      mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(13).height = 30;

      worksheet.getRow(13).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: 'thin', // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: 'FF000000' }, 
      };

      worksheet.getColumn('B').eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      const mergedCellA11B12 = worksheet.getCell('A11');
      mergedCellA11B12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellA11B12.font = { bold: true };
      mergedCellA11B12.value = 'Date-Time';
      worksheet.mergeCells('A11:A13');
      applyBorder(mergedCellA11B12);

      const mergedCellB11C12 = worksheet.getCell('B11');
      mergedCellB11C12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellB11C12.font = { bold: true };
      mergedCellB11C12.value = 'Gate 1';
      worksheet.mergeCells('B11:C12');
      applyBorder(mergedCellB11C12);

      const mergedCellD11E12 = worksheet.getCell('D11');
      mergedCellD11E12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellD11E12.font = { bold: true };
      mergedCellD11E12.value = 'Gate 2';
      worksheet.mergeCells('D11:E12');
      applyBorder(mergedCellD11E12);

      const mergedCellF11G12 = worksheet.getCell('F11');
      mergedCellF11G12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellF11G12.font = { bold: true };
      mergedCellF11G12.value = 'Gate 3';
      worksheet.mergeCells('F11:G12');
      applyBorder(mergedCellF11G12);

      const mergedCellH11I12 = worksheet.getCell('H11');
      mergedCellH11I12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellH11I12.font = { bold: true };
      mergedCellH11I12.value = 'Gate 4';
      worksheet.mergeCells('H11:I12');
      applyBorder(mergedCellH11I12);

      const mergedCellJ11J12 = worksheet.getCell('J11');
      mergedCellJ11J12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellJ11J12.font = { bold: true };
      mergedCellJ11J12.value = 'Total Discharge (C/S)';
      worksheet.mergeCells('J11:J13');
      applyBorder(mergedCellJ11J12);
   

      
      function applyBorder(cell) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }


      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_HR_Kakatiya_Dam_Gate_Report.xlsx');
      await workbook.xlsx.write(res);
    } else if (exportToExcel == 3) {
      const itemsPerPage = 25; // Number of dates to print per page
      const totalItems = mergedDataWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = mergedDataWithoutPagination.slice(startIndex, endIndex);

        sections.push({
          properties: {
            page: {
              margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
              size: {
                orientation: Docx.PageOrientation.PORTRAIT,
                width: 12240,
                height: 15840,
              },
            },
          },
          children: [
            // Add your images and heading here at the top of every page
            new Docx.Paragraph({
              children: [
                // Left image
                new Docx.ImageRun({
                  data: fs.readFileSync(hyderabadImagePath),
                  transformation: {
                    width: 140,
                    height: 105,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.LEFT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
                // Right image
                new Docx.ImageRun({
                  data: fs.readFileSync(chetasImagePath),
                  transformation: {
                    width: 80,
                    height: 110,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.RIGHT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
              ],
            }),

            // Heading
            new Docx.Paragraph({
              text: 'SRSP HR Kakatiya canal Gate Report',
              heading: Docx.HeadingLevel.HEADING_1,
              alignment: Docx.AlignmentType.CENTER,
            }),

            // Table
            new Docx.Table({
              width: { size: '109%', type: Docx.WidthType.PERCENTAGE },
              rows: [
                // Table header
                new Docx.TableRow({
                  children: [
                    new Docx.TableCell({ children: [new Docx.Paragraph('Date Time')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 1 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 1 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 2 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 2 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 3 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 3 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 4 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 4 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Total Discharge (C/S)')] })
                  ],
                }),

                // Table rows
                ...pageData.map((item) => {
                  const formattedDate = new Date(item.dateTime).toISOString().replace('T', '   T').slice(0, -8);
                  return new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph(formattedDate)],
                        width: { size: 12, type: Docx.WidthType.PERCENTAGE },
                      }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkGate1Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkGate1Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkGate2Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkGate2Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkGate3Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkGate3Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkGate4Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkGate4Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.kakatiyaTotalDischarge.toFixed(2))] })
                    ],
                  });
                }),
              ],
            }),
          ],
        });
      }

      const doc = new Docx.Document({
        sections: sections,
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_HR_Kakatiya_Dam_Gate_Report.doc');

      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);

    }  else {
      res.send(mergedDataWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspHrSaraswatiDamGateReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role))) {

    const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          hrsGate1Position: { $first: '$hrsGate1Position' },
          hrsGate2Position: { $first: '$hrsGate2Position' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrsGate1Position: 1,
          hrsGate2Position: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const pipeline1WithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          hrsGate1Discharge: { $first: '$hrsGate1Discharge' },
          hrsGate2Discharge: { $first: '$hrsGate2Discharge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrsGate1Discharge: 1,
          hrsGate2Discharge: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const srspHrDamGateReportPosWithoutPagination = await SRSP_HR_DAM_OVERVIEW_POS.aggregate(pipelineWithoutPagination);
    const srspHrDamGateReportDisWithoutPagination = await SRSP_HR_DAM_OVERVIEW_DICH.aggregate(pipeline1WithoutPagination);

    let posDataWithoutPagination = srspHrDamGateReportPosWithoutPagination || [];
    let disDataWithoutPagination = srspHrDamGateReportDisWithoutPagination || [];

    let minLengthWithoutPagination = Math.max(posDataWithoutPagination.length, disDataWithoutPagination.length);

    let mergedDataWithoutPagination = Array.from({ length: minLengthWithoutPagination }, (_, index) => {
      const hrsGate1Discharge = disDataWithoutPagination[index]?.hrsGate1Discharge || 0;
      const hrsGate2Discharge = disDataWithoutPagination[index]?.hrsGate2Discharge || 0;

      const saraswatiTotalDischarge = hrsGate1Discharge + hrsGate2Discharge;

      return {
        hrsGate1Position: posDataWithoutPagination[index]?.hrsGate1Position || 0,
        hrsGate2Position: posDataWithoutPagination[index]?.hrsGate2Position || 0,
        dateTime: posDataWithoutPagination[index]?.dateTime || disDataWithoutPagination[index]?.dateTime || null,

        hrsGate1Discharge: hrsGate1Discharge,
        hrsGate2Discharge: hrsGate2Discharge,
        saraswatiTotalDischarge: saraswatiTotalDischarge,
      };
    });

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('SRSP HR Saraswati canal Gate Report');

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: 'png',
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: 'oneCell',
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 2]);
      addImageToWorksheet(chetasImagePath, [4.9, 5]);

      const headers = [
        'DateTime',
        'Gate 1 Opening (Feet)',
        'Gate 1 Discharge (C/S)',
        'Gate 2 Opening (Feet)',
        'Gate 2 Discharge (C/S)',
        'Total Discharge (C/S)',
      ];

      worksheet.addRows([[], headers]);
      worksheet.addRow(headers);

      worksheet.addRow(headers).eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        cell.alignment = { horizontal: 'center' };
      });


      mergedDataWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.hrsGate1Position,
          row.hrsGate1Discharge,
          row.hrsGate2Position,
          row.hrsGate2Discharge,
          row.saraswatiTotalDischarge,
        ];
        worksheet.addRow(rowData);
      });

   const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';
      worksheet.getRow(3).height = 20;

      worksheet.columns.forEach((column) => {
        column.width = 25;
    });

    worksheet.mergeCells('A1:F8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      mergedCell.value = 'SRSP HR Saraswati canal Gate Report';
      mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(13).height = 30;

      worksheet.getRow(13).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: 'thin', // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: 'FF000000' }, 
      };

      worksheet.getColumn('B').eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      ['B', 'C', 'D', 'E', 'F'].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      const mergedCellA11B12 = worksheet.getCell('A11');
      mergedCellA11B12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellA11B12.font = { bold: true };
      mergedCellA11B12.value = 'Date-Time';
      worksheet.mergeCells('A11:A13');
      applyBorder(mergedCellA11B12);

      const mergedCellB11C12 = worksheet.getCell('B11');
      mergedCellB11C12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellB11C12.font = { bold: true };
      mergedCellB11C12.value = 'Gate 1';
      worksheet.mergeCells('B11:C12');
      applyBorder(mergedCellB11C12);

      const mergedCellD11E12 = worksheet.getCell('D11');
      mergedCellD11E12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellD11E12.font = { bold: true };
      mergedCellD11E12.value = 'Gate 2';
      worksheet.mergeCells('D11:E12');
      applyBorder(mergedCellD11E12);

      const mergedCellF11G12 = worksheet.getCell('F11');
      mergedCellF11G12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellF11G12.font = { bold: true };
      mergedCellF11G12.value = 'Total Discharge (C/S)';
      worksheet.mergeCells('F11:F13');
      applyBorder(mergedCellF11G12);
   

      
      function applyBorder(cell) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_HR_Saraswati_Dam_Gate_Report.xlsx');
      await workbook.xlsx.write(res);
      
    } else if (exportToExcel == 3) {
      const itemsPerPage = 25; // Number of dates to print per page
      const totalItems = mergedDataWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = mergedDataWithoutPagination.slice(startIndex, endIndex);

        sections.push({
          properties: {
            page: {
              margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
              size: {
                orientation: Docx.PageOrientation.PORTRAIT,
                width: 12240,
                height: 15840,
              },
            },
          },
          children: [
            // Add your images and heading here at the top of every page
            new Docx.Paragraph({
              children: [
                // Left image
                new Docx.ImageRun({
                  data: fs.readFileSync(hyderabadImagePath),
                  transformation: {
                    width: 140,
                    height: 105,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.LEFT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
                // Right image
                new Docx.ImageRun({
                  data: fs.readFileSync(chetasImagePath),
                  transformation: {
                    width: 80,
                    height: 110,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.RIGHT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
              ],
            }),

            // Heading
            new Docx.Paragraph({
              text: 'SRSP HR Saraswati canal Gate Report',
              heading: Docx.HeadingLevel.HEADING_1,
              alignment: Docx.AlignmentType.CENTER,
            }),

            // Table
            new Docx.Table({
              width: { size: '109%', type: Docx.WidthType.PERCENTAGE },
              rows: [
                // Table header
                new Docx.TableRow({
                  children: [
                    new Docx.TableCell({ children: [new Docx.Paragraph('Date Time')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 1 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 1 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 2 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 2 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Total Discharge (C/S)')] }),
                  ],
                }),

                // Table rows
                ...pageData.map((item) => {
                  const formattedDate = new Date(item.dateTime).toISOString().replace('T', '   T').slice(0, -8);
                  return new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph(formattedDate)],
                        width: { size: 12, type: Docx.WidthType.PERCENTAGE },
                      }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrsGate1Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrsGate1Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrsGate2Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrsGate2Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.saraswatiTotalDischarge.toFixed(2))] }),
                    ],
                  });
                }),
              ],
            }),
          ],
        });
      }

      const doc = new Docx.Document({
        sections: sections,
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_HR_Saraswati_Dam_Gate_Report.doc');

      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);

    } else {
      res.send(mergedDataWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspHrFloodFlowDamGateReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role))) {

    const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          hrfGate1Position: { $first: '$hrfGate1Position' },
          hrfGate2Position: { $first: '$hrfGate2Position' },
          hrfGate3Position: { $first: '$hrfGate3Position' },
          hrfGate4Position: { $first: '$hrfGate4Position' },
          hrfGate5Position: { $first: '$hrfGate5Position' },
          hrfGate6Position: { $first: '$hrfGate6Position' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrfGate1Position: 1,
          hrfGate2Position: 1,
          hrfGate3Position: 1,
          hrfGate4Position: 1,
          hrfGate5Position: 1,
          hrfGate6Position: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const pipeline1WithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          hrfGate1Discharge: { $first: '$hrfGate1Discharge' },
          hrfGate2Discharge: { $first: '$hrfGate2Discharge' },
          hrfGate3Discharge: { $first: '$hrfGate3Discharge' },
          hrfGate4Discharge: { $first: '$hrfGate4Discharge' },
          hrfGate5Discharge: { $first: '$hrfGate5Discharge' },
          hrfGate6Discharge: { $first: '$hrfGate6Discharge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrfGate1Discharge: 1,
          hrfGate2Discharge: 1,
          hrfGate3Discharge: 1,
          hrfGate4Discharge: 1,
          hrfGate5Discharge: 1,
          hrfGate6Discharge: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const srspHrDamGateReportPosWithoutPagination = await SRSP_HR_DAM_OVERVIEW_POS.aggregate(pipelineWithoutPagination);
    const srspHrDamGateReportDisWithoutPagination = await SRSP_HR_DAM_OVERVIEW_DICH.aggregate(pipeline1WithoutPagination);

    let posDataWithoutPagination = srspHrDamGateReportPosWithoutPagination || [];
    let disDataWithoutPagination = srspHrDamGateReportDisWithoutPagination || [];

    let minLengthWithoutPagination = Math.max(posDataWithoutPagination.length, disDataWithoutPagination.length);

    let mergedDataWithoutPagination = Array.from({ length: minLengthWithoutPagination }, (_, index) => {
      const hrfGate1Discharge = disDataWithoutPagination[index]?.hrfGate1Discharge || 0;
      const hrfGate2Discharge = disDataWithoutPagination[index]?.hrfGate2Discharge || 0;
      const hrfGate3Discharge = disDataWithoutPagination[index]?.hrfGate3Discharge || 0;
      const hrfGate4Discharge = disDataWithoutPagination[index]?.hrfGate4Discharge || 0;
      const hrfGate5Discharge = disDataWithoutPagination[index]?.hrfGate5Discharge || 0;
      const hrfGate6Discharge = disDataWithoutPagination[index]?.hrfGate6Discharge || 0;

      const floodFlowTotalDischarge =
        hrfGate1Discharge +
        hrfGate2Discharge +
        hrfGate3Discharge +
        hrfGate4Discharge +
        hrfGate5Discharge +
        hrfGate6Discharge; 

      return {
        hrfGate1Position: posDataWithoutPagination[index]?.hrfGate1Position || 0,
        hrfGate2Position: posDataWithoutPagination[index]?.hrfGate2Position || 0,
        hrfGate3Position: posDataWithoutPagination[index]?.hrfGate3Position || 0,
        hrfGate4Position: posDataWithoutPagination[index]?.hrfGate4Position || 0,
        hrfGate5Position: posDataWithoutPagination[index]?.hrfGate5Position || 0,
        hrfGate6Position: posDataWithoutPagination[index]?.hrfGate6Position || 0,
        dateTime: posDataWithoutPagination[index]?.dateTime || disDataWithoutPagination[index]?.dateTime || null,

        hrfGate1Discharge: hrfGate1Discharge,
        hrfGate2Discharge: hrfGate2Discharge,
        hrfGate3Discharge: hrfGate3Discharge,
        hrfGate4Discharge: hrfGate4Discharge,
        hrfGate5Discharge: hrfGate5Discharge,
        hrfGate6Discharge: hrfGate6Discharge,
        floodFlowTotalDischarge: floodFlowTotalDischarge,
      };
    });

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('SRSP HR Kakatiya canal Gate Report');

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: 'png',
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: 'oneCell',
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 2.7]);
      addImageToWorksheet(chetasImagePath, [8.8, 9]);


      const headers = [
        'DateTime',
        'Opening (Feet)',
        'Discharge (C/S)',
        'Opening (Feet)',
        'Discharge (C/S)',
        'Opening (Feet)',
        'Discharge (C/S)',
        'Opening (Feet)',
        'Discharge (C/S)',
        'Opening (Feet)',
        'Discharge (C/S)',
        'Opening (Feet)',
        'Discharge (C/S)',
        'Total Discharge (C/S)',
      ];

      worksheet.addRows([[], headers]);
      worksheet.addRow(headers);

      worksheet.addRow(headers).eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        cell.alignment = { horizontal: 'center' };
      });

      mergedDataWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.hrfGate1Position,
          row.hrfGate1Discharge,
          row.hrfGate2Position,
          row.hrfGate2Discharge,
          row.hrfGate3Position,
          row.hrfGate3Discharge,
          row.hrfGate4Position,
          row.hrfGate4Discharge,
          row.hrfGate5Position,
          row.hrfGate5Discharge,
          row.hrfGate6Position,
          row.hrfGate6Discharge,
          row.floodFlowTotalDischarge,
        ];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      worksheet.columns.forEach((column) => {
        column.width = 20;
      });

      worksheet.mergeCells('A1:J8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, 
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, 
        right: { style: 'thin', color: { argb: 'FF000000' } }, 
      };

      mergedCell.value = 'SRSP HR Flood Flow canal Gate Report';
      mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(13).height = 30;

      worksheet.getRow(13).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: 'thin', // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: 'FF000000' }, 
      };

      worksheet.getColumn('B').eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N'].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      const mergedCellA11B12 = worksheet.getCell('A11');
      mergedCellA11B12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellA11B12.font = { bold: true };
      mergedCellA11B12.value = 'Date-Time';
      worksheet.mergeCells('A11:A13');
      applyBorder(mergedCellA11B12);

      const mergedCellB11C12 = worksheet.getCell('B11');
      mergedCellB11C12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellB11C12.font = { bold: true };
      mergedCellB11C12.value = 'Gate 1';
      worksheet.mergeCells('B11:C12');
      applyBorder(mergedCellB11C12);

      const mergedCellD11E12 = worksheet.getCell('D11');
      mergedCellD11E12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellD11E12.font = { bold: true };
      mergedCellD11E12.value = 'Gate 2';
      worksheet.mergeCells('D11:E12');
      applyBorder(mergedCellD11E12);

      const mergedCellF11G12 = worksheet.getCell('F11');
      mergedCellF11G12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellF11G12.font = { bold: true };
      mergedCellF11G12.value = 'Gate 3';
      worksheet.mergeCells('F11:G12');
      applyBorder(mergedCellF11G12);

      const mergedCellH11I12 = worksheet.getCell('H11');
      mergedCellH11I12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellH11I12.font = { bold: true };
      mergedCellH11I12.value = 'Gate 4';
      worksheet.mergeCells('H11:I12');
      applyBorder(mergedCellH11I12);

      const mergedCellJ11K12 = worksheet.getCell('J11');
      mergedCellJ11K12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellJ11K12.font = { bold: true };
      mergedCellJ11K12.value = 'Gate 5';
      worksheet.mergeCells('J11:K12');
      applyBorder(mergedCellJ11K12);

      const mergedCellL11M12 = worksheet.getCell('L11');
      mergedCellL11M12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellL11M12.font = { bold: true };
      mergedCellL11M12.value = 'Gate 6';
      worksheet.mergeCells('L11:M12');
      applyBorder(mergedCellL11M12);

      const mergedCellN11N12 = worksheet.getCell('N11');
      mergedCellN11N12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellN11N12.font = { bold: true };
      mergedCellN11N12.value = 'Total Discharge (C/S)';
      worksheet.mergeCells('N11:N13');
      applyBorder(mergedCellN11N12);
   

      
      function applyBorder(cell) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }


      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_HR_Flood_Flow_Dam_Gate_Report.xlsx');
      await workbook.xlsx.write(res);
    } else if (exportToExcel == 3) {
      const itemsPerPage = 25; 
      const totalItems = mergedDataWithoutPagination.length; 
      const totalPages = Math.ceil(totalItems / itemsPerPage); 

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = mergedDataWithoutPagination.slice(startIndex, endIndex);

        sections.push({
          properties: {
            page: {
              margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
              size: {
                orientation: Docx.PageOrientation.PORTRAIT,
                width: 12240,
                height: 15840,
              },
            },
          },
          children: [
            // Add your images and heading here at the top of every page
            new Docx.Paragraph({
              children: [
                // Left image
                new Docx.ImageRun({
                  data: fs.readFileSync(hyderabadImagePath),
                  transformation: {
                    width: 140,
                    height: 105,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.LEFT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
                // Right image
                new Docx.ImageRun({
                  data: fs.readFileSync(chetasImagePath),
                  transformation: {
                    width: 80,
                    height: 110,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.RIGHT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
              ],
            }),

            // Heading
            new Docx.Paragraph({
              text: 'SRSP HR Flood Flow canal Gate Report',
              heading: Docx.HeadingLevel.HEADING_1,
              alignment: Docx.AlignmentType.CENTER,
            }),

            // Table
            new Docx.Table({
              width: { size: '109%', type: Docx.WidthType.PERCENTAGE },
              rows: [
                // Table header
                new Docx.TableRow({
                  children: [
                    new Docx.TableCell({ children: [new Docx.Paragraph('Date Time')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 1 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 1 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 2 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 2 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 3 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 3 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 4 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 4 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 5 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 5 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 6 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 6 Discharge (C/S)')] }),                
                    new Docx.TableCell({ children: [new Docx.Paragraph('Total Discharge (C/S)')] })
                  ],
                }),

                // Table rows
                ...pageData.map((item) => {
                  const formattedDate = new Date(item.dateTime).toISOString().replace('T', '   T').slice(0, -8);
                  return new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph(formattedDate)],
                        width: { size: 12, type: Docx.WidthType.PERCENTAGE },
                      }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrfGate1Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrfGate1Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrfGate2Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrfGate2Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrfGate3Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrfGate3Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrfGate4Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrfGate4Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrfGate5Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrfGate5Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrfGate6Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrfGate6Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.floodFlowTotalDischarge.toFixed(2))] })
                    ],
                  });
                }),
              ],
            }),
          ],
        });
      }

      const doc = new Docx.Document({
        sections: sections,
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_HR_Flood_Flow_Dam_Gate_Report.doc');

      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);

    } else {
      res.send(mergedDataWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspHrLakshmiDamGateReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role))) {

    const pipelineWithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          hrlManGate1Position: { $first: '$hrlManGate1Position' },
          hrlManGate2Position: { $first: '$hrlManGate2Position' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrlManGate1Position: 1,
          hrlManGate2Position: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const pipeline1WithoutPagination = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          hrlManGate1Discharge: { $first: '$hrlManGate1Discharge' },
          hrlManGate2Discharge: { $first: '$hrlManGate2Discharge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrlManGate1Discharge: 1,
          hrlManGate2Discharge: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const srspHrDamGateReportPosWithoutPagination = await SRSP_HR_DAM_OVERVIEW_POS.aggregate(pipelineWithoutPagination);
    const srspHrDamGateReportDisWithoutPagination = await SRSP_HR_DAM_OVERVIEW_DICH.aggregate(pipeline1WithoutPagination);

    let posDataWithoutPagination = srspHrDamGateReportPosWithoutPagination || [];
    let disDataWithoutPagination = srspHrDamGateReportDisWithoutPagination || [];

    let minLengthWithoutPagination = Math.max(posDataWithoutPagination.length, disDataWithoutPagination.length);

    let mergedDataWithoutPagination = Array.from({ length: minLengthWithoutPagination }, (_, index) => {

      const hrlManGate1Discharge = disDataWithoutPagination[index]?.hrlManGate1Discharge || 0;
      const hrlManGate2Discharge = disDataWithoutPagination[index]?.hrlManGate2Discharge || 0;

    
      const lakshmiGateTotalDischarge = hrlManGate1Discharge + hrlManGate2Discharge;

      return {
        hrlManGate1Position: posDataWithoutPagination[index]?.hrlManGate1Position || 0,
        hrlManGate2Position: posDataWithoutPagination[index]?.hrlManGate2Position || 0,
        dateTime: posDataWithoutPagination[index]?.dateTime || disDataWithoutPagination[index]?.dateTime || null,

        hrlManGate1Discharge: hrlManGate1Discharge,
        hrlManGate2Discharge: hrlManGate2Discharge,
        lakshmiGateTotalDischarge: lakshmiGateTotalDischarge,
      };
    });
    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('SRSP HR Lakshmi canal Gate Report');

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: 'png',
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: 'oneCell',
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 2]);
      addImageToWorksheet(chetasImagePath, [4.9, 5]);


      const headers = [
        'DateTime',
        'Opening (Feet)',
        'Discharge (C/S)',
        'Opening (Feet)',
        'Discharge (C/S)',
        'Total Discharge (C/S)',
      ];

      worksheet.addRows([[], headers]);
      worksheet.addRow(headers);

      worksheet.addRow(headers).eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        cell.alignment = { horizontal: 'center' };
      });


      mergedDataWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.hrlManGate1Position,
          row.hrlManGate1Discharge,
          row.hrlManGate2Position,
          row.hrlManGate2Discharge,
          row.lakshmiGateTotalDischarge,
        ];
        worksheet.addRow(rowData);
      });

   const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';
      worksheet.getRow(3).height = 20;

      worksheet.columns.forEach((column) => {
        column.width = 25;
    });

    worksheet.mergeCells('A1:F8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      mergedCell.value = 'SRSP HR Lakshmicanal Gate Report';
      mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(13).height = 30;

      worksheet.getRow(13).eachCell((cell) => {
        cell.font = { bold: true };
      });

      const borderStyle = {
        style: 'thin', // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: 'FF000000' }, 
      };

      worksheet.getColumn('B').eachCell((cell) => {
        cell.border = {
          ...cell.border,
          left: borderStyle,
        };
      });

      ['B', 'C', 'D', 'E', 'F'].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      const mergedCellA11B12 = worksheet.getCell('A11');
      mergedCellA11B12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellA11B12.font = { bold: true };
      mergedCellA11B12.value = 'Date-Time';
      worksheet.mergeCells('A11:A13');
      applyBorder(mergedCellA11B12);

      const mergedCellB11C12 = worksheet.getCell('B11');
      mergedCellB11C12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellB11C12.font = { bold: true };
      mergedCellB11C12.value = 'Gate 1';
      worksheet.mergeCells('B11:C12');
      applyBorder(mergedCellB11C12);

      const mergedCellD11E12 = worksheet.getCell('D11');
      mergedCellD11E12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellD11E12.font = { bold: true };
      mergedCellD11E12.value = 'Gate 2';
      worksheet.mergeCells('D11:E12');
      applyBorder(mergedCellD11E12);

      const mergedCellF11G12 = worksheet.getCell('F11');
      mergedCellF11G12.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellF11G12.font = { bold: true };
      mergedCellF11G12.value = 'Total Discharge (C/S)';
      worksheet.mergeCells('F11:F13');
      applyBorder(mergedCellF11G12);
   

      
      function applyBorder(cell) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_HR_Lakshmi_Dam_Gate_Report.xlsx');
      await workbook.xlsx.write(res);
      
    } else if (exportToExcel == 3) {
      const itemsPerPage = 25; // Number of dates to print per page
      const totalItems = mergedDataWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = mergedDataWithoutPagination.slice(startIndex, endIndex);

        sections.push({
          properties: {
            page: {
              margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
              size: {
                orientation: Docx.PageOrientation.PORTRAIT,
                width: 12240,
                height: 15840,
              },
            },
          },
          children: [
            // Add your images and heading here at the top of every page
            new Docx.Paragraph({
              children: [
                // Left image
                new Docx.ImageRun({
                  data: fs.readFileSync(hyderabadImagePath),
                  transformation: {
                    width: 140,
                    height: 105,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.LEFT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
                // Right image
                new Docx.ImageRun({
                  data: fs.readFileSync(chetasImagePath),
                  transformation: {
                    width: 80,
                    height: 110,
                  },
                  floating: {
                    horizontalPosition: {
                      relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                      align: Docx.HorizontalPositionAlign.RIGHT,
                    },
                    verticalPosition: {
                      relative: Docx.VerticalPositionRelativeFrom.PAGE,
                      align: Docx.VerticalPositionAlign.TOP,
                    },
                  },
                }),
              ],
            }),

            // Heading
            new Docx.Paragraph({
              text: 'SRSP HR Lakshmi canal Gate Report',
              heading: Docx.HeadingLevel.HEADING_1,
              alignment: Docx.AlignmentType.CENTER,
            }),

            // Table
            new Docx.Table({
              width: { size: '109%', type: Docx.WidthType.PERCENTAGE },
              rows: [
                // Table header
                new Docx.TableRow({
                  children: [
                    new Docx.TableCell({ children: [new Docx.Paragraph('Date Time')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 1 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 1 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 2 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 2 Discharge (C/S)')] }),           
                    new Docx.TableCell({ children: [new Docx.Paragraph('Total Discharge (C/S)')] }),
                  ],
                }),

                // Table rows
                ...pageData.map((item) => {
                  const formattedDate = new Date(item.dateTime).toISOString().replace('T', '   T').slice(0, -8);
                  return new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph(formattedDate)],
                        width: { size: 12, type: Docx.WidthType.PERCENTAGE },
                      }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrlManGate1Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrlManGate1Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrlManGate2Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrlManGate2Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.lakshmiGateTotalDischarge.toFixed(2))] }),
                    ],
                  });
                }),
              ],
            }),
          ],
        });
      }

      const doc = new Docx.Document({
        sections: sections,
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_HR_Lakshmi_Dam_Gate_Report.doc');

      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);

    } else {
      res.send(mergedDataWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspHrDamGateReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'srspReport' });
    if ( user.role === 'admin' || user.role === 'srspSuperuser' || (checkPermission && checkPermission.roleName.includes(user.role))) {

    const pipeline = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          hrkGate1Position: { $first: '$hrkGate1Position' },
          hrkGate2Position: { $first: '$hrkGate2Position' },
          hrkGate3Position: { $first: '$hrkGate3Position' },
          hrkGate4Position: { $first: '$hrkGate4Position' },
          hrsGate1Position: { $first: '$hrsGate1Position' },
          hrsGate2Position: { $first: '$hrsGate2Position' },
          hrfGate1Position: { $first: '$hrfGate1Position' },
          hrfGate2Position: { $first: '$hrfGate2Position' },
          hrfGate3Position: { $first: '$hrfGate3Position' },
          hrfGate4Position: { $first: '$hrfGate4Position' },
          hrfGate5Position: { $first: '$hrfGate5Position' },
          hrfGate6Position: { $first: '$hrfGate6Position' },
          hrlManGate1Position: { $first: '$hrlManGate1Position' },
          hrlManGate2Position: { $first: '$hrlManGate2Position' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrkGate1Position: 1,
          hrkGate2Position: 1,
          hrkGate3Position: 1,
          hrkGate4Position: 1,
          hrsGate1Position: 1,
          hrsGate2Position: 1,
          hrfGate1Position: 1,
          hrfGate2Position: 1,
          hrfGate3Position: 1,
          hrfGate4Position: 1,
          hrfGate5Position: 1,
          hrfGate6Position: 1,
          hrlManGate1Position: 1,
          hrlManGate2Position: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const pipeline1 = [
      {
        $match: {
          dateTime: {
            $gt: new Date(startDate),
            $lte: new Date(new Date(endDate).setDate(new Date(endDate).getDate() + 1)),
          },
        },
      },
      {
        $group: {
          _id: {
            interval: {
              $toDate: {
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },
          hrkGate1Discharge: { $first: '$hrkGate1Discharge' },
          hrkGate2Discharge: { $first: '$hrkGate2Discharge' },
          hrkGate3Discharge: { $first: '$hrkGate3Discharge' },
          hrkGate4Discharge: { $first: '$hrkGate4Discharge' },
          hrsGate1Discharge: { $first: '$hrsGate1Discharge' },
          hrsGate2Discharge: { $first: '$hrsGate2Discharge' },
          hrfGate1Discharge: { $first: '$hrfGate1Discharge' },
          hrfGate2Discharge: { $first: '$hrfGate2Discharge' },
          hrfGate3Discharge: { $first: '$hrfGate3Discharge' },
          hrfGate4Discharge: { $first: '$hrfGate4Discharge' },
          hrfGate5Discharge: { $first: '$hrfGate5Discharge' },
          hrfGate6Discharge: { $first: '$hrfGate6Discharge' },
          hrlManGate1Discharge: { $first: '$hrlManGate1Discharge' },
          hrlManGate2Discharge: { $first: '$hrlManGate2Discharge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrkGate1Discharge: 1,
          hrkGate2Discharge: 1,
          hrkGate3Discharge: 1,
          hrkGate4Discharge: 1,
          hrsGate1Discharge: 1,
          hrsGate2Discharge: 1,
          hrfGate1Discharge: 1,
          hrfGate2Discharge: 1,
          hrfGate3Discharge: 1,
          hrfGate4Discharge: 1,
          hrfGate5Discharge: 1,
          hrfGate6Discharge: 1,
          hrlManGate1Discharge: 1,
          hrlManGate2Discharge: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const srspHrDamGateReportPos = await SRSP_HR_DAM_OVERVIEW_POS.aggregate(pipeline);
    const srspHrDamGateReportDis = await SRSP_HR_DAM_OVERVIEW_DICH.aggregate(pipeline1);
    let posData = srspHrDamGateReportPos || [];
    let disData = srspHrDamGateReportDis || [];
    let minLength = Math.max(posData.length, disData.length);

    let mergedDataWithoutPagination = Array.from({ length: minLength }, (_, index) => {
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

      const kakatiyaTotalDischarge = hrkGate1Discharge + hrkGate2Discharge + hrkGate3Discharge + hrkGate4Discharge;
      const saraswatiTotalDischarge = hrsGate1Discharge + hrsGate2Discharge;
      const floodFlowTotalDischarge =
        hrfGate1Discharge +
        hrfGate2Discharge +
        hrfGate3Discharge +
        hrfGate4Discharge +
        hrfGate5Discharge +
        hrfGate6Discharge;
      const lakshmiGateTotalDischarge = hrlManGate1Discharge + hrlManGate2Discharge;

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
        hrsGate1Discharge: hrsGate1Discharge,
        hrsGate2Discharge: hrsGate2Discharge,
        saraswatiTotalDischarge: saraswatiTotalDischarge,
        hrfGate1Discharge: hrfGate1Discharge,
        hrfGate2Discharge: hrfGate2Discharge,
        hrfGate3Discharge: hrfGate3Discharge,
        hrfGate4Discharge: hrfGate4Discharge,
        hrfGate5Discharge: hrfGate5Discharge,
        hrfGate6Discharge: hrfGate6Discharge,
        floodFlowTotalDischarge: floodFlowTotalDischarge,
        hrlManGate1Discharge: hrlManGate1Discharge,
        hrlManGate2Discharge: hrlManGate2Discharge,
        lakshmiGateTotalDischarge: lakshmiGateTotalDischarge,
      };
    });

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('SRSP HR canal Gate Report');

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: 'png',
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 0 },
          br: { col: colRange[1], row: 8 },
          editAs: 'oneCell',
        });
      };

      addImageToWorksheet(hyderabadImagePath, [1, 2.7]);
      addImageToWorksheet(chetasImagePath, [8, 9]);

      worksheet.getCell('E9').value = 'SRSP HR canal Gate Report';
      const cell = worksheet.getCell('E9');
      cell.font = { bold: true, size: 20 };

      const headers = [
        'DateTime',
        'Kakatiya Gate 1 Opening (Feet)',
        'Kakatiya Gate 1 Discharge (C/S)',
        'Kakatiya Gate 2 Opening (Feet)',
        'Kakatiya Gate 2 Discharge (C/S)',
        'Kakatiya Gate 3 Opening (Feet)',
        'Kakatiya Gate 3 Discharge (C/S)',
        'Kakatiya Gate 4 Opening (Feet)',
        'Kakatiya Gate 4 Discharge (C/S)',
        'Kakatiya Total Discharge (C/S)',
        'Saraswati Gate 1 Opening (Feet)',
        'Saraswati Gate 1 Discharge (C/S)',
        'Saraswati Gate 2 Opening (Feet)',
        'Saraswati Gate 2 Discharge (C/S)',
        'Saraswati Total Discharge (C/S)',
        'Flood Flow gate 1 Opening (Feet)',
        'Flood Flow gate 1 Discharge (C/S)',
        'Flood Flow gate 2 Opening (Feet)',
        'Flood Flow gate 2 Discharge (C/S)',
        'Flood Flow gate 3 Opening (Feet)',
        'Flood Flow gate 3 Discharge (C/S)',
        'Flood Flow gate 4 Opening (Feet)',
        'Flood Flow gate 4 Discharge (C/S)',
        'Flood Flow gate 5 Opening (Feet)',
        'Flood Flow gate 5 Discharge (C/S)',
        'Flood Flow gate 6 Opening (Feet)',
        'Flood Flow gate 6 Discharge (C/S)',
        'Flood Flow Total Discharge (C/S)',
        'Lakshmi gate 1 Opening (Feet)',
        'Lakshmi gate 1 Discharge (C/S)',
        'Lakshmi gate 2 Opening (Feet)',
        'Lakshmi gate 2 Discharge (C/S)',
        'Lakshmi Total Discharge (C/S)',
      ];
      worksheet.addRow([]);
      worksheet.addRow(headers);

      mergedDataWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.hrkGate1Position,
          row.hrkGate1Discharge,
          row.hrkGate2Position,
          row.hrkGate2Discharge,
          row.hrkGate3Position,
          row.hrkGate3Discharge,
          row.hrkGate4Position,
          row.hrkGate4Discharge,
          row.kakatiyaTotalDischarge,
          row.hrsGate1Position,
          row.hrsGate1Discharge,
          row.hrsGate2Position,
          row.hrsGate2Discharge,
          row.saraswatiTotalDischarge,
          row.hrfGate1Position,
          row.hrfGate1Discharge,
          row.hrfGate2Position,
          row.hrfGate2Discharge,
          row.hrfGate3Position,
          row.hrfGate3Discharge,
          row.hrfGate4Position,
          row.hrfGate4Discharge,
          row.hrfGate5Position,
          row.hrfGate5Discharge,
          row.hrfGate6Position,
          row.hrfGate6Discharge,
          row.floodFlowTotalDischarge,
          row.hrlManGate1Position,
          row.hrlManGate1Discharge,
          row.hrlManGate2Position,
          row.hrlManGate2Discharge,
          row.lakshmiGateTotalDischarge,
        ];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      worksheet.columns.forEach((column) => {
        column.width = 20;
      });

      worksheet.mergeCells('A1:J8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=SRSP_HR_Dam_Gate_Report.xlsx');
      await workbook.xlsx.write(res);
    } else if (exportToExcel == 2) {
      const csvStream = fastCsv.format({ headers: true });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=LMD_Discharge_Gate_Report.csv');

      lmdDischargeGateReport1.forEach((row) => {
        const formattedDate = new Date(row.dateTime).toISOString().replace('Z', '');
        csvStream.write({
          DateTime: formattedDate,
          'Gate 1 Discharge': row.gate1Discharge,
          'Gate 2 Discharge': row.gate2Discharge,
          'Gate 3 Discharge': row.gate3Discharge,
          'Gate 4 Discharge': row.gate4Discharge,
          'Gate 5 Discharge': row.gate5Discharge,
          'Gate 6 Discharge': row.gate6Discharge,
          'Gate 7 Discharge': row.gate7Discharge,
          'Gate 8 Discharge': row.gate8Discharge,
          'Gate 9 Discharge': row.gate9Discharge,
          'Gate 10 Discharge': row.gate10Discharge,
          'Gate 11 Discharge': row.gate11Discharge,
          'Gate 12 Discharge': row.gate12Discharge,
          'Gate 13 Discharge': row.gate13Discharge,
          'Gate 14 Discharge': row.gate14Discharge,
          'Gate 15 Discharge': row.gate15Discharge,
          'Gate 16 Discharge': row.gate16Discharge,
          'Gate 17 Discharge': row.gate17Discharge,
          'Gate 18 Discharge': row.gate18Discharge,
          'Gate 19 Discharge': row.gate19Discharge,
          'Gate 20 Discharge': row.gate20Discharge,
        });
      });

      csvStream.pipe(res);
      csvStream.end();
    } else if (exportToExcel == 3) {
      // try {
      //   const itemsPerPage = 26; // Number of dates to print per page
      //   const totalItems = lmdDischargeGateReport1.length; // Total number of dates
      //   const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed
      //   const sections = [];
      //   for (let page = 0; page < totalPages; page++) {
      //     const startIndex = page * itemsPerPage;
      //     const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
      //     const pageData = lmdDischargeGateReport1.slice(startIndex, endIndex);
      //     sections.push({
      //       properties: {
      //         page: {
      //           margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
      //           size: {
      //             orientation: Docx.PageOrientation.PORTRAIT,
      //             width: 12240,
      //             height: 15840,
      //           },
      //         },
      //       },
      //       children: [
      //         // Add your images and heading here at the top of every page
      //         new Docx.Paragraph({
      //           children: [
      //             // Left image
      //             new Docx.ImageRun({
      //               data: fs.readFileSync(hyderabadImagePath),
      //               transformation: {
      //                 width: 100,
      //                 height: 100,
      //               },
      //               floating: {
      //                 horizontalPosition: {
      //                   relative: Docx.HorizontalPositionRelativeFrom.PAGE,
      //                   align: Docx.HorizontalPositionAlign.LEFT,
      //                 },
      //                 verticalPosition: {
      //                   relative: Docx.VerticalPositionRelativeFrom.PAGE,
      //                   align: Docx.VerticalPositionAlign.TOP,
      //                 },
      //               },
      //             }),
      //             // Right image
      //             new Docx.ImageRun({
      //               data: fs.readFileSync(chetasImagePath),
      //               transformation: {
      //                 width: 100,
      //                 height: 100,
      //               },
      //               floating: {
      //                 horizontalPosition: {
      //                   relative: Docx.HorizontalPositionRelativeFrom.PAGE,
      //                   align: Docx.HorizontalPositionAlign.RIGHT,
      //                 },
      //                 verticalPosition: {
      //                   relative: Docx.VerticalPositionRelativeFrom.PAGE,
      //                   align: Docx.VerticalPositionAlign.TOP,
      //                 },
      //               },
      //             }),
      //           ],
      //         }),
      //         // Heading
      //         new Docx.Paragraph({
      //           text: 'LMD Discharge Gate Report',
      //           heading: Docx.HeadingLevel.HEADING_1,
      //           alignment: Docx.AlignmentType.CENTER,
      //         }),
      //         // Table
      //         new Docx.Table({
      //           width: { size: '109%', type: Docx.WidthType.PERCENTAGE },
      //           rows: [
      //             // Table header
      //             new Docx.TableRow({
      //               children: [
      //                 new Docx.TableCell({
      //                   children: [new Docx.Paragraph('Date Time')],
      //                   alignment: { horizontal: Docx.AlignmentType.CENTER },
      //                   // Adjusted width for Date Time column
      //                 }),
      //                 // Adjust the width for each gate column
      //                 ...Array.from(
      //                   { length: 20 },
      //                   (_, i) =>
      //                     new Docx.TableCell({
      //                       children: [new Docx.Paragraph(`Gate ${i + 1}`)],
      //                       alignment: { horizontal: Docx.AlignmentType.CENTER },
      //                       // Adjusted width for gate columns
      //                     })
      //                 ),
      //               ],
      //             }),
      //             // Table rows
      //             ...pageData.map((item) => {
      //               const formattedDate = new Date(item.dateTime).toISOString().replace('T', '   T').slice(0, -8);
      //               return new Docx.TableRow({
      //                 children: [
      //                   new Docx.TableCell({
      //                     children: [new Docx.Paragraph(formattedDate)],
      //                     alignment: { horizontal: Docx.AlignmentType.CENTER },
      //                     // Adjusted width for Date Time column
      //                   }),
      //                   // Include each gate discharge value
      //                   ...Array.from(
      //                     { length: 20 },
      //                     (_, i) =>
      //                       new Docx.TableCell({
      //                         children: [new Docx.Paragraph(item[`gate${i + 1}Discharge`].toString())],
      //                         alignment: { horizontal: Docx.AlignmentType.CENTER },
      //                         // Adjusted width for gate columns
      //                       })
      //                   ),
      //                 ],
      //               });
      //             }),
      //           ],
      //         }),
      //       ],
      //     });
      //   }
      //   const doc = new Docx.Document({ sections: sections });
      //   // Set response headers
      //   res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      //   res.setHeader('Content-Disposition', 'attachment; filename=LMD_Discharge_Gate_Report.docx');
      //   // Stream the Word document to the response
      //   const buffer = await Docx.Packer.toBuffer(doc);
      //   res.end(buffer);
      // } catch (error) {
      //   console.error('Error:', error);
      //   res.status(500).send('Internal Server Error');
      // }
    } else if (exportToExcel == 4) {
      // try {
      //   const dynamicHtml = await ejs.renderFile(path.join(__dirname, '../../views/srspKakatiyaAndSaraswatiGate.ejs'), {
      //     mergedDataWithoutPagination: mergedDataWithoutPagination,
      //   });
      //   const browser = await puppeteer.launch();
      //   const page = await browser.newPage();
      //   await page.setContent(dynamicHtml);
      //   const pdfBuffer = await page.pdf({ format: 'Letter' });
      //   // Close browser
      //   await browser.close();
      //   res.setHeader('Content-Disposition', 'attachment; filename=SRSP_HR_Kakatiya_Saraswati_Dam_Gate_Report.pdf');
      //   res.setHeader('Content-Type', 'application/pdf');
      //   res.send(pdfBuffer);
      // } catch (error) {
      //   throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      // }
    } else {
      res.send(mergedDataWithoutPagination);
    }
  } else {
    return "You are not authorized to access this data";
  }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const srspAdvmOverviewReportWp = async (
  startDate,
  endDate,
  intervalMinutes,
  exportToExcel,
  user,
  res,
  req
) => {
  try {
    const checkPermission = await Permission.findOne({ name: "lmdReport" });

    if (
      user.role === "admin" ||
      user.role === "lmdSuperuser" ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {

      const pipelineWithoutPagination = [
        {
          $match: {
            dateTime: {
              $gt: new Date(startDate),
              $lte: new Date(
                new Date(endDate).setDate(new Date(endDate).getDate() + 1)
              ),
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
                    {
                      $mod: [
                        { $toLong: "$dateTime" },
                        intervalMinutes * 60 * 1000,
                      ],
                    },
                  ],
                },
              },
            },
            hrkFlowRate: { $first: "$hrkFlowRate" },
            hrkTotalizer: { $first: "$hrkTotalizer" },
            hrkCDQ: { $first: "$hrkCDQ" },
            hrkLDQ: { $first: "$hrkLDQ" },
            hrkMQ: { $first: "$hrkMQ" },
            hrkVelocity: { $first: "$hrkVelocity" }
        
          },
        },
        {
          $project: {
            _id: 0,
            dateTime: "$_id.interval",
            hrkFlowRate: 1,
            hrkTotalizer: 1,
            hrkCDQ: 1,
            hrkLDQ: 1,
            hrkMQ: 1,
            hrkVelocity: 1
          },
        },
        {
          $sort: {
            dateTime: 1,
          },
        },
      ];


      const srspAdvmOverviewReportWp = await SRSP_HR_KAKATIYA_ADVM.aggregate(
        pipelineWithoutPagination
      );

      if (exportToExcel == 1) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('SRSP Dam ADVM Data Report');
  
        const addImageToWorksheet = (imagePath, colRange) => {
          const imageId = workbook.addImage({
            filename: imagePath,
            extension: 'png',
            dimensions: { height: 100, width: 100 },
          });
  
          worksheet.addImage(imageId, {
            tl: { col: colRange[0], row: 0 },
            br: { col: colRange[1], row: 8 },
            editAs: 'oneCell',
          });
        };
  
        addImageToWorksheet(hyderabadImagePath, [1, 2.5]);
        addImageToWorksheet(chetasImagePath, [5.9, 6]);
  
        const headers = [
          'DateTime',
          'Flow Rate(ft3/s)',
          'Totalizer(ft3)',
          'CDQ(ft3)	',
          'LDQ(ft3)	',
          'Monthly Qty(ft3)	',
          'Velocity(ft/s)',
        ];
        worksheet.addRow([]);
  
        worksheet.addRow(headers).eachCell((cell) => {
          cell.border = {
              top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
          };
          cell.alignment = { horizontal: 'center' };
        });
  
        srspAdvmOverviewReportWp.forEach((row) => {
          const rowData = [
            row.dateTime,
            row.hrkFlowRate,
            row.hrkTotalizer,
            row.hrkCDQ,
            row.hrkLDQ,
            row.hrkMQ,
            row.hrkVelocity,
          ];
          worksheet.addRow(rowData);
        });
  
        const dateTimeColumn = worksheet.getColumn(1);
        dateTimeColumn.width = 20;
        dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';
  
        worksheet.columns.forEach((column) => {
          column.width = 20;
        });
  
        worksheet.mergeCells('A1:G8');
        const mergedCell = worksheet.getCell('A1');
  
        mergedCell.border = {
          top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
          left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
          bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
          right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
        };
  
        mergedCell.value = 'SRSP Dam ADVM Data Report';
        mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
        mergedCell.font = { bold: true };
        mergedCell.font = { bold: true, size: 15 };
        worksheet.getRow(11).height = 30;
  
        worksheet.getRow(11).eachCell((cell) => {
          cell.font = { bold: true };
        });
  
        const borderStyle = {
          style: 'thin', // You can change this to 'medium', 'thick', etc. as needed
          color: { argb: 'FF000000' }, 
        };
  
        worksheet.getColumn('B').eachCell((cell) => {
          cell.border = {
            ...cell.border,
            left: borderStyle,
          };
        });
  
        ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach((column) => {
          worksheet.getColumn(column).eachCell((cell) => {
            cell.border = {
              ...cell.border,
              right: borderStyle,
            };
          });
        });
  
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_ADVM_Data_Report.xlsx');
  
        await workbook.xlsx.write(res);
      }else if (exportToExcel == 3) {
  
        const itemsPerPage = 25; // Number of dates to print per page
        const totalItems = srspAdvmOverviewReportWp.length; // Total number of dates
        const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed
  
        const sections = [];
        for (let page = 0; page < totalPages; page++) {
          const startIndex = page * itemsPerPage;
          const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
          const pageData = srspAdvmOverviewReportWp.slice(startIndex, endIndex);
  
          sections.push({
            properties: {
              page: {
                margin: { top: 1500, right: 1000, bottom: 1000, left: 100 },
                size: {
                  orientation: Docx.PageOrientation.PORTRAIT,
                  width: 12240,
                  height: 15840,
                },
              },
            },
            children: [
              // Add your images and heading here at the top of every page
              new Docx.Paragraph({
                children: [
                  // Left image
                  new Docx.ImageRun({
                    data: fs.readFileSync(hyderabadImagePath),
                    transformation: {
                      width: 140,
                      height: 105,
                    },
                    floating: {
                      horizontalPosition: {
                        relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                        align: Docx.HorizontalPositionAlign.LEFT,
                      },
                      verticalPosition: {
                        relative: Docx.VerticalPositionRelativeFrom.PAGE,
                        align: Docx.VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                  // Right image
                  new Docx.ImageRun({
                    data: fs.readFileSync(chetasImagePath),
                    transformation: {
                      width: 80,
                      height: 110,
                    },
                    floating: {
                      horizontalPosition: {
                        relative: Docx.HorizontalPositionRelativeFrom.PAGE,
                        align: Docx.HorizontalPositionAlign.RIGHT,
                      },
                      verticalPosition: {
                        relative: Docx.VerticalPositionRelativeFrom.PAGE,
                        align: Docx.VerticalPositionAlign.TOP,
                      },
                    },
                  }),
                ],
              }),
              // Heading
              new Docx.Paragraph({
                text: 'SRSP Dam ADVM Data Report',
                heading: Docx.HeadingLevel.HEADING_1,
                alignment: Docx.AlignmentType.CENTER,
              }),
              // Table
              new Docx.Table({
                width: { size: '109%', type: Docx.WidthType.PERCENTAGE },
                rows: [
                  // Table header
                  new Docx.TableRow({
                    children: [
                      new Docx.TableCell({ children: [new Docx.Paragraph('Date Time')] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph('Flow Rate(ft3/s)')] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph('Totalizer(ft3)')] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph('CDQ(ft3)')] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph('LDQ(ft3)')] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph('Monthly Qty(ft3)')] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph('Velocity(ft/s)')] }),
                    ],
                  }),
                  // Table rows
                  ...pageData.map((item) => {
                    const formattedDate = new Date(item.dateTime).toISOString().replace('T', '   T').slice(0, -8);
                    return new Docx.TableRow({
                      children: [
                        new Docx.TableCell({
                          children: [new Docx.Paragraph(formattedDate)],
                          width: { size: 12, type: Docx.WidthType.PERCENTAGE },
                        }),
                        new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkFlowRate.toFixed(2))] }),
                        new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkTotalizer.toFixed(2))] }),
                        new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkCDQ.toFixed(2))] }),
                        new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkLDQ.toFixed(2))] }),
                        new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkMQ.toFixed(2))] }),
                        new Docx.TableCell({ children: [new Docx.Paragraph(item.hrkVelocity.toFixed(2))] }),
                      ],
                    });
                  }),
                ],
              }),
            ],
          });
        }
  
        const doc = new Docx.Document({
          sections: sections,
        });
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=SRSP_Dam_ADVM_Data_Report.doc');
  
        // Stream the Word document to the response
        const buffer = await Docx.Packer.toBuffer(doc);
        res.end(buffer);
      } else {
        res.send(srspAdvmOverviewReportWp);
      }
    } else {
      return "You are not authorized to access this data";
    }
  } catch (error) {
    console.error("Error:", error);
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
  srspAdvmOverviewReport,
  sevenDayReport,

  //without pagination
  srspDischargeGate1TO21ReportWp,
  srspDischargeGate22TO42ReportWp,
  srspOpeningGate1TO21ReportWp,
  srspOpeningGate22TO42ReportWp,
  srspInflowOutflowPondLevelReportWp,
  srspParameterOverviewReportWp,
  srspHrFloodFlowDamGateReportWp,
  srspHrKakatitaDamGateReportWp,
  srspHrLakshmiDamGateReportWp,
  srspHrSaraswatiDamGateReportWp,
  srspHrDamGateReportWp,
  srspAdvmOverviewReportWp
};

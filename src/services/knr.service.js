const httpStatus = require('http-status');
const puppeteer = require('puppeteer');
const fastCsv = require('fast-csv');
const path = require('path');
const ejs = require('ejs');
const ExcelJS = require('exceljs');
const fs = require('fs');
const Docx = require('docx');
const ApiError = require('../utils/ApiError');

const {
  KNRS,
  KNR_DAM_OVERVIEW_DICH,
  KNR_DAM_OVERVIEW_POS,
  KNR_HR_DAM_OVERVIEW_DICH,
  KNR_HR_DAM_OVERVIEW_POS,
  KNR_POND_LEVEL_OVERVIEW,
  KNR_SPARE_ADVM,
  Permission,
} = require('../models');
const { log } = require('winston');

const hyderabadImagePath = path.join(__dirname, '../../views/hyderabad.png');
const chetasImagePath = path.join(__dirname, '../../views/chetas.png');

const createSalientFeature = async (userBody) => {
  try {
    return KNRS.create(userBody);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getSalientFeature = async (user) => {
  try {
    const checkPermission = await Permission.findOne({ name: 'kadamSalientFeatures' });

    if (
      user.role === 'admin' ||
      user.role === 'kadamSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const showOneSalientFeature = await KNRS.findOne();
      return showOneSalientFeature;
    } else {
      return 'You are not authorized to access this data';
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataKadamDamOverview = async (user) => {
  try {
    const checkPermission = await Permission.findOne({ name: 'kadamOverview' });

    if (
      user.role === 'admin' ||
      user.role === 'kadamSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const getLastDataKadamDamPondLevelOverview = await KNR_POND_LEVEL_OVERVIEW.findOne()
        .select(
          'pondLevel liveCapacity grossStorage fullReservoirLevel contourArea catchmentArea ayacutArea filling instantaneousGateDischarge instantaneousCanalDischarge totalDamDischarge cumulativeDamDischarge inflow1Level inflow2Level inflow3Level inflow1Discharge inflow2Discharge inflow3Discharge damOutflowLevel damOutflowDischarge hrrDownstreamLevel hrrDownstreamDischarge'
        )
        .sort({ dateTime: -1 });
      const getLastDataKadamDamOverviewPos = await KNR_DAM_OVERVIEW_POS.findOne()
        .select(
          'gate1Position gate2Position gate3Position gate4Position gate5Position gate6Position gate7Position gate8Position gate9Position gate10Position gate11Position gate12Position gate13Position gate14Position gate15Position gate16Position gate17Position gate18Position'
        )
        .sort({ dateTime: -1 });
      const getLastDataKadamDamOverviewDish = await KNR_DAM_OVERVIEW_DICH.findOne()
        .select(
          'gate1Discharge gate2Discharge gate3Discharge gate4Discharge gate5Discharge gate6Discharge gate7Discharge gate8Discharge gate9Discharge gate10Discharge gate11Discharge gate12Discharge gate13Discharge gate14Discharge gate15Discharge gate16Discharge gate17Discharge gate18Discharge'
        )
        .sort({ dateTime: -1 });
      const getLastDataKadamHrDamOverviewPos = await KNR_HR_DAM_OVERVIEW_POS.findOne()
        .select('hrklManGate1Position hrklManGate2Position hrklManGate3Position hrklManGate4Position hrklManGate5Position')
        .sort({ dateTime: -1 });
      const getLastDataKadamHrDamOverviewDish = await KNR_HR_DAM_OVERVIEW_DICH.findOne()
        .select(
          'hrklManGate1Discharge hrklManGate2Discharge hrklManGate3Discharge hrklManGate4Discharge hrklManGate5Discharge'
        )
        .sort({ dateTime: -1 });
      return {
        getLastDataKadamHrDamOverviewDish,
        getLastDataKadamHrDamOverviewPos,
        getLastDataKadamDamOverviewDish,
        getLastDataKadamDamOverviewPos,
        getLastDataKadamDamPondLevelOverview,
      };
    } else {
      return 'You are not authorized to access this data';
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getLastDataKadamDamSpareAdvm = async (user) => {
  try {
    const checkPermission = await Permission.findOne({ name: 'kadamOverview' });

    if (
      user.role === 'admin' ||
      user.role === 'kadamSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const getLastDataKadamDamSpareAdvm = await KNR_SPARE_ADVM.findOne().sort({ dateTime: -1 });
      return getLastDataKadamDamSpareAdvm;
    } else {
      return 'You are not authorized to access this data';
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const kadamOpeningGate1To18Report = async (
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
    const checkPermission = await Permission.findOne({ name: 'kadamReport' });

    if (
      user.role === 'admin' ||
      user.role === 'kadamSuperuser' ||
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

      const kadamOpeningGate1To18Report = await KNR_DAM_OVERVIEW_POS.aggregate(pipeline);

      let totalCount = kadamOpeningGate1To18Report[0]?.totalCount[0]?.count;
      const totalPage = Math.ceil(totalCount / perPage);

      return {
        data: kadamOpeningGate1To18Report[0]?.data,
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

const kadamDishchargeGate1To18Report = async (
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

    const checkPermission = await Permission.findOne({ name: 'kadamReport' });

    if (
      user.role === 'admin' ||
      user.role === 'kadamSuperuser' ||
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

    const kadamDishchargeGate1To18Report = await KNR_DAM_OVERVIEW_DICH.aggregate(pipeline);

    let totalCount = kadamDishchargeGate1To18Report[0]?.totalCount[0]?.count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: kadamDishchargeGate1To18Report[0]?.data,
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

const kadamInflowOutflowPondLevelReport = async (
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

    const checkPermission = await Permission.findOne({ name: 'kadamReport' });

    if (
      user.role === 'admin' ||
      user.role === 'kadamSuperuser' ||
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
          inflow2Level: { $first: '$inflow2Level' },
          inflow3Level: { $first: '$inflow3Level' },
          inflow1Discharge: { $first: '$inflow1Discharge' },
          inflow2Discharge: { $first: '$inflow2Discharge' },
          inflow3Discharge: { $first: '$inflow3Discharge' },
          damOutflowLevel: { $first: '$damOutflowLevel' },
          damOutflowDischarge: { $first: '$damOutflowDischarge' },
          pondLevel: { $first: '$pondLevel' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          inflow1Level: 1,
          inflow2Level: 1,
          inflow3Level: 1,
          inflow1Discharge: 1,
          inflow2Discharge: 1,
          inflow3Discharge: 1,
          damOutflowLevel: 1,
          damOutflowDischarge: 1,
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

    const kadamInflowOutflowPondLevelReport = await KNR_POND_LEVEL_OVERVIEW.aggregate(pipeline);

    let totalCount = kadamInflowOutflowPondLevelReport[0]?.totalCount[0]?.count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: kadamInflowOutflowPondLevelReport[0]?.data,
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

const kadamGateParameterOverviewReport = async (
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
    const checkPermission = await Permission.findOne({ name: 'kadamReport' });

    if (
      user.role === 'admin' ||
      user.role === 'kadamSuperuser' ||
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
          pondLevel: 1,
          dateTime: '$_id.interval',
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

    const kadamGateParameterOverviewReport = await KNR_POND_LEVEL_OVERVIEW.aggregate(pipeline);

    let totalCount = kadamGateParameterOverviewReport[0]?.totalCount[0]?.count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: kadamGateParameterOverviewReport[0]?.data,
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

const kadamHrDamGateReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, user, res, req) => {
  try {

    const checkPermission = await Permission.findOne({ name: 'kadamReport' });

    if (
      user.role === 'admin' ||
      user.role === 'kadamSuperuser' ||
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
          hrklManGate1Position: { $first: '$hrklManGate1Position' },
          hrklManGate2Position: { $first: '$hrklManGate2Position' },
          hrklManGate3Position: { $first: '$hrklManGate3Position' },
          hrklManGate4Position: { $first: '$hrklManGate4Position' },
          hrklManGate5Position: { $first: '$hrklManGate5Position' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrklManGate1Position: 1,
          hrklManGate2Position: 1,
          hrklManGate3Position: 1,
          hrklManGate4Position: 1,
          hrklManGate5Position: 1,
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
          hrklManGate1Discharge: { $first: '$hrklManGate1Discharge' },
          hrklManGate2Discharge: { $first: '$hrklManGate2Discharge' },
          hrklManGate3Discharge: { $first: '$hrklManGate3Discharge' },
          hrklManGate4Discharge: { $first: '$hrklManGate4Discharge' },
          hrklManGate5Discharge: { $first: '$hrklManGate5Discharge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrklManGate1Discharge: 1,
          hrklManGate2Discharge: 1,
          hrklManGate3Discharge: 1,
          hrklManGate4Discharge: 1,
          hrklManGate5Discharge: 1,
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

    const kadamHrDamGateReportPos = await KNR_HR_DAM_OVERVIEW_POS.aggregate(pipeline);
    const kadamHrDamGateReportDis = await KNR_HR_DAM_OVERVIEW_DICH.aggregate(pipeline1);
    let posData = kadamHrDamGateReportPos[0]?.data || [];
    let disData = kadamHrDamGateReportDis[0]?.data || [];
    let minLength = Math.max(posData.length, disData.length);

    let mergedData = Array.from({ length: minLength }, (_, index) => {
      const hrklManGate1Discharge = disData[index]?.hrklManGate1Discharge || 0;
      const hrklManGate2Discharge = disData[index]?.hrklManGate2Discharge || 0;
      const hrklManGate3Discharge = disData[index]?.hrklManGate3Discharge || 0;
      const hrklManGate4Discharge = disData[index]?.hrklManGate4Discharge || 0;
      const hrklManGate5Discharge = disData[index]?.hrklManGate5Discharge || 0;

      const kadamTotalDischarge =
        hrklManGate1Discharge +
        hrklManGate2Discharge +
        hrklManGate3Discharge +
        hrklManGate4Discharge +
        hrklManGate5Discharge;

      return {
        hrklManGate1Position: posData[index]?.hrklManGate1Position || 0,
        hrklManGate2Position: posData[index]?.hrklManGate2Position || 0,
        hrklManGate3Position: posData[index]?.hrklManGate3Position || 0,
        hrklManGate4Position: posData[index]?.hrklManGate4Position || 0,
        hrklManGate5Position: posData[index]?.hrklManGate5Position || 0,
        dateTime: posData[index]?.dateTime || disData[index]?.dateTime || null,
        hrklManGate1Discharge: hrklManGate1Discharge,
        hrklManGate2Discharge: hrklManGate2Discharge,
        hrklManGate3Discharge: hrklManGate3Discharge,
        hrklManGate4Discharge: hrklManGate4Discharge,
        hrklManGate5Discharge: hrklManGate5Discharge,
        kadamTotalDischarge: kadamTotalDischarge,
      };
    });

    let totalCount = kadamHrDamGateReportPos[0]?.totalCount[0]?.count;
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

const sevenDayReport = async (user) => {
  try {
    const checkPermission = await Permission.findOne({ name: 'kadamSalientFeatures' });

    if (
      user.role === 'admin' ||
      user.role === 'kadamSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const currentDate = new Date();
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 6);

      const pondLevelSevenDayReport = await KNR_POND_LEVEL_OVERVIEW.find({
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

      daysInRange.forEach((dateKey) => {
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
            avgInflow3Level: avgInflow3Level,
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
            maxInflow3Level: '',
            minInflow3Level: '',
            avgInflow3Level: '',
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
const kadamOpeningGate1To18ReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    // console.log(user , "+++++++++++++++++++");
    // const checkPermission = await Permission.findOne({ name: 'kadamReport' });

    // if (
    //   user.role === 'admin' ||
    //   user.role === 'kadamSuperuser' ||
    //   (checkPermission && checkPermission.roleName.includes(user.role))
    // ) {
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
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const kadamOpeningGate1To18ReportWithoutPagination = await KNR_DAM_OVERVIEW_POS.aggregate(pipelineWithoutPagination);

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('KADDAM Dam Gate 1 To 18 Opening Report');

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
      addImageToWorksheet(chetasImagePath, [15.5, 17]);

      const headers = ['DateTime', ...Array.from({ length: 18 }, (_, i) => `Gate ${i + 1} \n (Feet)`)];
      worksheet.addRow([]);

      worksheet.addRow(headers).eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        cell.alignment = { horizontal: 'center' };
      });

      kadamOpeningGate1To18ReportWithoutPagination.forEach((row) => {
        const rowData = [row.dateTime, ...Array.from({ length: 18 }, (_, i) => row[`gate${i + 1}Position`])];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';

      worksheet.mergeCells('A1:S8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      mergedCell.value = 'KADDAM Dam Gate 1 To 18 Opening Report';
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

      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Gate_1_To_18_Opening_Report.xlsx');

      await workbook.xlsx.write(res);
    } else if (exportToExcel == 2) {
      const csvStream = fastCsv.format({ headers: true });

      kadamOpeningGate1To18ReportWithoutPagination.forEach((row) => {
        const formattedDate = new Date(row.dateTime).toISOString().replace('Z', '');
        csvStream.write({
          DateTime: formattedDate,
          Gate_1: row.gate1Position,
          Gate_2: row.gate2Position,
          Gate_3: row.gate3Position,
          Gate_4: row.gate4Position,
          Gate_5: row.gate5Position,
          Gate_6: row.gate6Position,
          Gate_7: row.gate7Position,
          Gate_8: row.gate8Position,
          Gate_9: row.gate9Position,
          Gate_10: row.gate10Position,
          Gate_11: row.gate11Position,
          Gate_12: row.gate12Position,
          Gate_13: row.gate13Position,
          Gate_14: row.gate14Position,
          Gate_15: row.gate15Position,
          Gate_16: row.gate16Position,
          Gate_17: row.gate17Position,
          Gate_18: row.gate18Position,
        });
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Gate_1_To_18_Opening_Report.csv');

      csvStream.pipe(res);
      csvStream.end();
    } else if (exportToExcel == 3) {

      const itemsPerPage = 26; // Number of dates to print per page
      const totalItems = kadamOpeningGate1To18ReportWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = kadamOpeningGate1To18ReportWithoutPagination.slice(startIndex, endIndex);

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
                    width: 100,
                    height: 100,
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
              text: 'KADDAM Dam Gate 1 To 18 Opening Report',
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
                      { length: 18 },
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
                      // Include each gate Opening value
                      ...Array.from(
                        { length: 18 },
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
      res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Gate_1_To_18_Opening_Report.docx');

      // Stream the Word document to the response
      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else if (exportToExcel == 4) {
      try {
        const dynamicHtml = await ejs.renderFile(path.join(__dirname, '../../views/kadamOpeningGate.ejs'), {
          kadamOpeningGate1To18ReportWithoutPagination: kadamOpeningGate1To18ReportWithoutPagination,
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(dynamicHtml);

        const pdfBuffer = await page.pdf({ format: 'Letter' });

        // Close browser
        await browser.close();

        res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Gate_1_To_18_Opening_Report.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    } else {
      res.send(kadamOpeningGate1To18ReportWithoutPagination);
    }
  // } else { 
  //   return 'You are not authorized to access this data';
  // }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const kadamDishchargeGate1To18ReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {
    // const checkPermission = await Permission.findOne({ name: 'kadamReport' });

    // if (
    //   user.role === 'admin' ||
    //   user.role === 'kadamSuperuser' ||
    //   (checkPermission && checkPermission.roleName.includes(user.role))
    // ) {
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
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const kadamDishchargeGate1To18ReportWithoutPagination = await KNR_DAM_OVERVIEW_DICH.aggregate(pipelineWithoutPagination);

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('KADDAM Dam Gate 1 To 18 Discharge Report');

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
      addImageToWorksheet(chetasImagePath, [15.5, 17]);

      const headers = ['DateTime', ...Array.from({ length: 18 }, (_, i) => `Gate ${i + 1} \n (Cusecs)`)];
      worksheet.addRow([]);

      worksheet.addRow(headers).eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        cell.alignment = { horizontal: 'center' };
      });

      kadamDishchargeGate1To18ReportWithoutPagination.forEach((row) => {
        const rowData = [row.dateTime, ...Array.from({ length: 18 }, (_, i) => row[`gate${i + 1}Discharge`])];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';

      worksheet.mergeCells('A1:S8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      mergedCell.value = 'LMD DAM Gate 1 To 20 Discharge Report';
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

      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'].forEach((column) => {
        worksheet.getColumn(column).eachCell((cell) => {
          cell.border = {
            ...cell.border,
            right: borderStyle,
          };
        });
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Gate_1_To_18_Discharge_Report.xlsx');
      await workbook.xlsx.write(res);
    } else if (exportToExcel == 2) {
      const csvStream = fastCsv.format({ headers: true });

      kadamDishchargeGate1To18ReportWithoutPagination.forEach((row) => {
        const formattedDate = new Date(row.dateTime).toISOString().replace('Z', '');
        csvStream.write({
          DateTime: formattedDate,
          Gate_1: row.gate1Discharge,
          Gate_2: row.gate2Discharge,
          Gate_3: row.gate3Discharge,
          Gate_4: row.gate4Discharge,
          Gate_5: row.gate5Discharge,
          Gate_6: row.gate6Discharge,
          Gate_7: row.gate7Discharge,
          Gate_8: row.gate8Discharge,
          Gate_9: row.gate9Discharge,
          Gate_10: row.gate10Discharge,
          Gate_11: row.gate11Discharge,
          Gate_12: row.gate12Discharge,
          Gate_13: row.gate13Discharge,
          Gate_14: row.gate14Discharge,
          Gate_15: row.gate15Discharge,
          Gate_16: row.gate16Discharge,
          Gate_17: row.gate17Discharge,
          Gate_18: row.gate18Discharge,
        });
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Gate_1_To_18_Disharge_Report.csv');

      csvStream.pipe(res);
      csvStream.end();
    } else if (exportToExcel == 3) {
   
      const itemsPerPage = 26; // Number of dates to print per page
      const totalItems = kadamDishchargeGate1To18ReportWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = kadamDishchargeGate1To18ReportWithoutPagination.slice(startIndex, endIndex);

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
                    width: 100,
                    height: 100,
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
              text: 'KADDAM Dam Gate 1 To 18 Discharge Report',
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
                      { length: 18 },
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
                      // Include each gate Opening value
                      ...Array.from(
                        { length: 18 },
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
      res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Gate_1_To_18_Discharge_Report.docx');

      // Stream the Word document to the response
      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else if (exportToExcel == 4) {
      try {
        const dynamicHtml = await ejs.renderFile(path.join(__dirname, '../../views/kadamDischargeGate.ejs'), {
          kadamDishchargeGate1To18ReportWithoutPagination: kadamDishchargeGate1To18ReportWithoutPagination,
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(dynamicHtml);

        const pdfBuffer = await page.pdf({ format: 'Letter' });

        // Close browser
        await browser.close();

        res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Gate_1_To_18_Discharge_Report.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    } else {
      res.send(kadamDishchargeGate1To18ReportWithoutPagination);
    }
  // } else {
  //   return 'You are not authorized to access this data';
  // }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const kadamInflowOutflowPondLevelReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {
    // const checkPermission = await Permission.findOne({ name: 'kadamReport' });

    // if (
    //   user.role === 'admin' ||
    //   user.role === 'kadamSuperuser' ||
    //   (checkPermission && checkPermission.roleName.includes(user.role))
    // ) {

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
          inflow2Level: { $first: '$inflow2Level' },
          inflow3Level: { $first: '$inflow3Level' },
          inflow1Discharge: { $first: '$inflow1Discharge' },
          inflow2Discharge: { $first: '$inflow2Discharge' },
          inflow3Discharge: { $first: '$inflow3Discharge' },
          damOutflowLevel: { $first: '$damOutflowLevel' },
          damOutflowDischarge: { $first: '$damOutflowDischarge' },
          pondLevel: { $first: '$pondLevel' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          inflow1Level: 1,
          inflow2Level: 1,
          inflow3Level: 1,
          inflow1Discharge: 1,
          inflow2Discharge: 1,
          inflow3Discharge: 1,
          damOutflowLevel: 1,
          damOutflowDischarge: 1,
          pondLevel: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const kadamInflowOutflowPondLevelReportWithoutPagination = await KNR_POND_LEVEL_OVERVIEW.aggregate(
      pipelineWithoutPagination
    );

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('KADDAM Dam Inflow Outflow PondLevel Report');

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
      addImageToWorksheet(chetasImagePath, [8.7, 9]);

      const headers = [
        'DateTime',
        'Mendapelly Inflow Level (Feet)',
        'Itikyal Inflow Level (Feet)',
        'Sikkumanu Inflow Level (Feet)',
        'Mendapelly Inflow Discharge (Cusecs)',
        'Itikyal Inflow Discharge (Cusecs)',
        'Sikkumanu Inflow Discharge (Cusecs)',
        'Pandawapur Bridge Outflow Level (Feet)',
        'Pandawapur Bridge Outflow Discharge (Cusecs)',
        'Pond Level (Feet)',
      ];
      worksheet.addRow([]);

      worksheet.addRow(headers).eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        cell.alignment = { horizontal: 'center' };
      });


      kadamInflowOutflowPondLevelReportWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.inflow1Level,
          row.inflow2Level,
          row.inflow3Level,
          row.inflow1Discharge,
          row.inflow2Discharge,
          row.inflow3Discharge,
          row.damOutflowLevel,
          row.damOutflowDischarge,
          row.pondLevel,
        ];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';
      worksheet.getRow(3).height = 20;

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

      mergedCell.value = 'KADDAM Dam Inflow Outflow Pond Level Report';
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
      res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Inflow_Outflow_PondLevel_Report.xlsx');

      await workbook.xlsx.write(res);
    } else if (exportToExcel == 2) {
      const csvStream = fastCsv.format({ headers: true });

      kadamInflowOutflowPondLevelReportWithoutPagination.forEach((row) => {
        const formattedDate = new Date(row.dateTime).toISOString().replace('Z', '');
        csvStream.write({
          DateTime: formattedDate,
          'Mendapelly Inflow Level (Feet)': row.inflow1Level,
          'Itikyal Inflow Level (Feet)': row.inflow2Level,
          'Sikkumanu Inflow Level (Feet)': row.inflow3Level,
          'Mendapelly Inflow Discharge (Cusecs)': row.inflow1Discharge,
          'Itikyal Inflow Discharge (Cusecs)': row.inflow2Discharge,
          'Sikkumanu Inflow Discharge (Cusecs)': row.inflow3Discharge,
          'Pandawapur Bridge Outflow Level (Feet)': row.damOutflowLevel,
          'Pandawapur Bridge Outflow Discharge (Cusecs)': row.damOutflowDischarge,
          'Pond Level (Feet)': row.pondLevel,
        });
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Inflow_Outflow_PondLevel_Report.csv');

      csvStream.pipe(res);
      csvStream.end();
    } else if (exportToExcel == 3) {

      const itemsPerPage = 25; // Number of dates to print per page
      const totalItems = kadamInflowOutflowPondLevelReportWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = kadamInflowOutflowPondLevelReportWithoutPagination.slice(startIndex, endIndex);

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
                    width: 100,
                    height: 100,
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
              text: 'KADDAM Dam Inflow Outflow Pond-Level Report',
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
                    new Docx.TableCell({ children: [new Docx.Paragraph('Mendapelly Inflow Level (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Itikyal Inflow Level (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Sikkumanu Inflow Level (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Mendapelly Inflow Discharge (Cusecs)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Itikyal Inflow Discharge (Cusecs)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Sikkumanu Inflow Discharge (Cusecs)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Pandawapur Bridge Outflow Level (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Pandawapur Bridge Outflow Discharge (Cusecs)')] }),
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
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow2Level.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow3Level.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow1Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow2Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow3Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.damOutflowLevel.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.damOutflowDischarge.toFixed(2))] }),
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
      res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Inflow_Outflow_PondLevel_Report.docx');

      // Stream the Word document to the response
      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else if (exportToExcel == 4) {
      try {
        const dynamicHtml = await ejs.renderFile(path.join(__dirname, '../../views/kadamInflowOutflowPondLevel.ejs'), {
          kadamInflowOutflowPondLevelReportWithoutPagination: kadamInflowOutflowPondLevelReportWithoutPagination,
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(dynamicHtml);

        const pdfBuffer = await page.pdf({ format: 'Letter' });

        // Close browser
        await browser.close();

        res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Inflow_Otflow_PondLevel_Report.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    } else {
      res.send(kadamInflowOutflowPondLevelReportWithoutPagination);
    }
  // } else {
  //   return 'You are not authorized to access this data';
  // }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const kadamGateParameterOverviewReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    // const checkPermission = await Permission.findOne({ name: 'kadamReport' });

    // if (
    //   user.role === 'admin' ||
    //   user.role === 'kadamSuperuser' ||
    //   (checkPermission && checkPermission.roleName.includes(user.role))
    // ) {
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
          pondLevel: 1,
          dateTime: '$_id.interval',
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

    const kadamGateParameterOverviewReportWithoutPagination = await KNR_POND_LEVEL_OVERVIEW.aggregate(
      pipelineWithoutPagination
    );

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('KADDAM Dam Paramete Overview Report');

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
      addImageToWorksheet(chetasImagePath, [8.5, 9]);

      const headers = [
        'DateTime',
        'Pond Level (Feet)',
        'Live Capacity (MCFT)',
        'Gross Storage (MCFT)',
        'FullReserve Water (Feet)',
        'Contour Area ( M.SqFt.)',
        'Cathment Area (Sq.km)',
        'Ayucut Area (Acres)',
        'Filing Percentage (%)',
        'Inst. Gate Discharge(Cusecs)',
        'Inst. canal Discharge (Cusecs)',
        'Total Dam Discharge (Cusecs)',
        'Cumulative Dam Discharge (Cusecs)',
      ];
      worksheet.addRow([]);

      worksheet.addRow(headers).eachCell((cell) => {
        cell.border = {
            top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' },
        };
        cell.alignment = { horizontal: 'center' };
      });

      kadamGateParameterOverviewReportWithoutPagination.forEach((row) => {
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
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';
      worksheet.getRow(3).height = 20;

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

      mergedCell.value = 'KADDAM Dam Parameter Overview Report';
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
      res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Parameter_Overview_Report.xlsx');

      await workbook.xlsx.write(res);
    } else if (exportToExcel == 2) {
      const csvStream = fastCsv.format({ headers: true });

      kadamGateParameterOverviewReportWithoutPagination.forEach((row) => {
        const formattedDate = new Date(row.dateTime).toISOString().replace('Z', '');
        csvStream.write({
          DateTime: formattedDate,
          'Pond Level (Feet)': row.pondLevel,
          'Live Capacity (MCFT)': row.liveCapacity,
          'Gross Storage (MCFT)': row.grossStorage,
          'Full Reserve Water (Feet)': row.fullReservoirLevel,
          'Contour Area (M.SqFt)': row.contourArea,
          'Cathment Area (Sq.Km)': row.catchmentArea,
          'Ayucut Area (Acres)': row.ayacutArea,
          'Filing Percentage (%)': row.filling,
          'Inst. Gate Discharge (Cusecs)': row.instantaneousGateDischarge,
          'Inst. canal Discharge (Cusecs)': row.instantaneousCanalDischarge,
          'Total Dam Discharge (Cusecs)': row.totalDamDischarge,
          'Cumulative Dam Discharge (Cusecs)': row.cumulativeDamDischarge,
        });
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Parameter_Overview_Report.csv');

      csvStream.pipe(res);
      csvStream.end();
    } else if (exportToExcel == 3) {

      const itemsPerPage = 25; // Number of dates to print per page
      const totalItems = kadamGateParameterOverviewReportWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = kadamGateParameterOverviewReportWithoutPagination.slice(startIndex, endIndex);

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
                    width: 100,
                    height: 100,
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
              text: 'KADDAM Dam Parameter Overview Report',
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
      res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Parameter_Overview_Report.docx');

      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else if (exportToExcel == 4) {
      try {
        const dynamicHtml = await ejs.renderFile(path.join(__dirname, '../../views/kadamParameterOverview.ejs'), {
          kadamGateParameterOverviewReportWithoutPagination: kadamGateParameterOverviewReportWithoutPagination,
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(dynamicHtml);

        const pdfBuffer = await page.pdf({ format: 'Letter' });

        // Close browser
        await browser.close();

        res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_Dam_Parameter_Overview_Report.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    } else {
      res.send(kadamGateParameterOverviewReportWithoutPagination);
    }
  // } else {
  //   return 'You are not authorized to access this data';
  // }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const kadamHrDamGateReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, user, res, req) => {
  try {

    // const checkPermission = await Permission.findOne({ name: 'kadamReport' });

    // if (
    //   user.role === 'admin' ||
    //   user.role === 'kadamSuperuser' ||
    //   (checkPermission && checkPermission.roleName.includes(user.role))
    // ) {
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
          hrklManGate1Position: { $first: '$hrklManGate1Position' },
          hrklManGate2Position: { $first: '$hrklManGate2Position' },
          hrklManGate3Position: { $first: '$hrklManGate3Position' },
          hrklManGate4Position: { $first: '$hrklManGate4Position' },
          hrklManGate5Position: { $first: '$hrklManGate5Position' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrklManGate1Position: 1,
          hrklManGate2Position: 1,
          hrklManGate3Position: 1,
          hrklManGate4Position: 1,
          hrklManGate5Position: 1,
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
          hrklManGate1Discharge: { $first: '$hrklManGate1Discharge' },
          hrklManGate2Discharge: { $first: '$hrklManGate2Discharge' },
          hrklManGate3Discharge: { $first: '$hrklManGate3Discharge' },
          hrklManGate4Discharge: { $first: '$hrklManGate4Discharge' },
          hrklManGate5Discharge: { $first: '$hrklManGate5Discharge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrklManGate1Discharge: 1,
          hrklManGate2Discharge: 1,
          hrklManGate3Discharge: 1,
          hrklManGate4Discharge: 1,
          hrklManGate5Discharge: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const kadamHrDamGateReportPosWithoutPagination = await KNR_HR_DAM_OVERVIEW_POS.aggregate(pipelineWithoutPagination);
    const kadamHrDamGateReportDisWithoutPagination = await KNR_HR_DAM_OVERVIEW_DICH.aggregate(pipeline1WithoutPagination);
    let posDataWithoutPagination = kadamHrDamGateReportPosWithoutPagination || [];
    let disDataWithoutPagination = kadamHrDamGateReportDisWithoutPagination || [];
    let minLengthWithoutPagination = Math.max(posDataWithoutPagination.length, disDataWithoutPagination.length);

    let mergedDataWithoutPagination = Array.from({ length: minLengthWithoutPagination }, (_, index) => {
      const hrklManGate1Discharge = disDataWithoutPagination[index]?.hrklManGate1Discharge || 0;
      const hrklManGate2Discharge = disDataWithoutPagination[index]?.hrklManGate2Discharge || 0;
      const hrklManGate3Discharge = disDataWithoutPagination[index]?.hrklManGate3Discharge || 0;
      const hrklManGate4Discharge = disDataWithoutPagination[index]?.hrklManGate4Discharge || 0;
      const hrklManGate5Discharge = disDataWithoutPagination[index]?.hrklManGate5Discharge || 0;

      const kadamTotalDischarge =
        hrklManGate1Discharge +
        hrklManGate2Discharge +
        hrklManGate3Discharge +
        hrklManGate4Discharge +
        hrklManGate5Discharge;

      return {
        hrklManGate1Position: posDataWithoutPagination[index]?.hrklManGate1Position || 0,
        hrklManGate2Position: posDataWithoutPagination[index]?.hrklManGate2Position || 0,
        hrklManGate3Position: posDataWithoutPagination[index]?.hrklManGate3Position || 0,
        hrklManGate4Position: posDataWithoutPagination[index]?.hrklManGate4Position || 0,
        hrklManGate5Position: posDataWithoutPagination[index]?.hrklManGate5Position || 0,
        dateTime: posDataWithoutPagination[index]?.dateTime || disDataWithoutPagination[index]?.dateTime || null,
        hrklManGate1Discharge: hrklManGate1Discharge,
        hrklManGate2Discharge: hrklManGate2Discharge,
        hrklManGate3Discharge: hrklManGate3Discharge,
        hrklManGate4Discharge: hrklManGate4Discharge,
        hrklManGate5Discharge: hrklManGate5Discharge,
        kadamTotalDischarge: kadamTotalDischarge,
      };
    });

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('KADDAM HR Gate Report');

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
      addImageToWorksheet(chetasImagePath, [8.5, 9]);

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
        'Total Discharge (C/S)',
      ];
      worksheet.addRow([]);
      worksheet.addRow([]);

      worksheet.addRow(headers);

      // Add headers and apply styling
      worksheet.addRow(headers).eachCell((cell) => {
        // Apply border to all sides of the cell
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };

        // Center align text
        cell.alignment = { horizontal: 'center' };
      });

      mergedDataWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.hrklManGate1Position,
          row.hrklManGate1Discharge,
          row.hrklManGate2Position,
          row.hrklManGate2Discharge,
          row.hrklManGate3Position,
          row.hrklManGate3Discharge,
          row.hrklManGate4Position,
          row.hrklManGate4Discharge,
          row.hrklManGate5Position,
          row.hrklManGate5Discharge,
          row.kadamTotalDischarge,
        ];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';
      worksheet.getRow(3).height = 20;

      worksheet.getRow(13).eachCell((cell) => {
        cell.font = { bold: true };
        cell.height = { size: 10 };
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

      mergedCell.value = 'KADDAM HR Gate Report';
      mergedCell.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCell.font = { bold: true };
      mergedCell.font = { bold: true, size: 15 };
      worksheet.getRow(13).height = 30;

      const borderStyle = {
        style: 'thin', // You can change this to 'medium', 'thick', etc. as needed
        color: { argb: 'FF000000' },
      };

      // Apply border to the left side of column
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'].forEach((column) => {
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

      const mergedCellL11L13 = worksheet.getCell('L11');
      mergedCellL11L13.alignment = { horizontal: 'center', vertical: 'middle' };
      mergedCellL11L13.font = { bold: true };
      mergedCellL11L13.value = 'Total Discharge (C/S)';
      worksheet.mergeCells('L11:L13');
      applyBorder(mergedCellL11L13);

      function applyBorder(cell) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      }

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=KADDAM_HR_Gate_Report.xlsx');

      await workbook.xlsx.write(res);
    } else if (exportToExcel == 2) {
      const csvStream = fastCsv.format({ headers: true });

      mergedDataWithoutPagination.forEach((row) => {
        const formattedDate = new Date(row.dateTime).toISOString().replace('Z', '');
        csvStream.write({
          DateTime: formattedDate,
          'Gete 1 Opening (Feet)': row.hrklManGate1Position,
          'Gate 1 Discharge (C/S)': row.hrklManGate1Discharge,
          'Gete 2 Opening (Feet)': row.hrklManGate2Position,
          'Gate 2 Discharge (C/S)': row.hrklManGate2Discharge,
          'Gete 3 Opening (Feet)': row.hrklManGate3Position,
          'Gate 3 Discharge (C/S)': row.hrklManGate3Discharge,
          'Gete 4 Opening (Feet)': row.hrklManGate4Position,
          'Gate 4 Discharge (C/S)': row.hrklManGate4Discharge,
          'Gete 5 Opening (Feet)': row.hrklManGate5Position,
          'Gate 5 Discharge (C/S)': row.hrklManGate5Discharge,
          'Total Discharge(C/S)': row.totalDischarge,
        });
      });

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=KADAM_HR_Dam_Gate_Report.csv');

      csvStream.pipe(res);
      csvStream.end();
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
                    width: 100,
                    height: 100,
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
              text: 'KADDAM HR canal Gate Report',
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
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gete 1 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 1 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gete 2 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 2 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gete 3 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 3 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gete 4 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 4 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gete 5 Opening (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gate 5 Discharge (C/S)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Total Discharge(C/S)')] }),
                  ],
                }),

                // Table rows
                ...pageData.map((item) => {
                  console.log('Item:111111111111111111111111', item); // Add this line to log the item
                  const formattedDate = new Date(item.dateTime).toISOString().replace('T', '   T').slice(0, -8);
                  return new Docx.TableRow({
                    children: [
                      new Docx.TableCell({
                        children: [new Docx.Paragraph(formattedDate)],
                        width: { size: 12, type: Docx.WidthType.PERCENTAGE },
                      }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrklManGate1Position.toFixed(2))] }),
                      // new Docx.TableCell({ children: [new Docx.Paragraph(item.hrklManGate1Discharge.toFixed(2))] }),
                      // new Docx.TableCell({ children: [new Docx.Paragraph(item.hrklManGate2Position.toFixed(2))] }),
                      // new Docx.TableCell({ children: [new Docx.Paragraph(item.hrklManGate2Discharge.toFixed(2))] }),
                      // new Docx.TableCell({ children: [new Docx.Paragraph(item.hrklManGate3Position.toFixed(2))] }),
                      // new Docx.TableCell({ children: [new Docx.Paragraph(item.hrklManGate3Discharge.toFixed(2))] }),
                      // new Docx.TableCell({ children: [new Docx.Paragraph(item.hrklManGate4Position.toFixed(2))] }),
                      // new Docx.TableCell({ children: [new Docx.Paragraph(item.hrklManGate4Discharge.toFixed(2))] }),
                      // new Docx.TableCell({ children: [new Docx.Paragraph(item.hrklManGate5Position.toFixed(2))] }),
                      // new Docx.TableCell({ children: [new Docx.Paragraph(item.hrklManGate5Discharge.toFixed(2))] }),
                      // new Docx.TableCell({ children: [new Docx.Paragraph(item.totalDischarge.toFixed(2))] }),
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
      res.setHeader('Content-Disposition', 'attachment; filename=KADAM_HR_Dam_Gate_Report.docx');

      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else if (exportToExcel == 4) {
      try {
        const dynamicHtml = await ejs.renderFile(path.join(__dirname, '../../views/kadamHrGate.ejs'), {
          mergedDataWithoutPagination: mergedDataWithoutPagination,
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(dynamicHtml);

        const pdfBuffer = await page.pdf({ format: 'Letter' });

        // Close browser
        await browser.close();

        res.setHeader('Content-Disposition', 'attachment; filename=KADAM_HR_Dam_Gate_Report.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    } else {
      res.send(mergedDataWithoutPagination);
    }
  // } else {
  //   return 'You are not authorized to access this data';
  // }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

module.exports = {
  createSalientFeature,
  getSalientFeature,
  getLastDataKadamDamOverview,
  getLastDataKadamDamSpareAdvm,
  kadamOpeningGate1To18Report,
  kadamDishchargeGate1To18Report,
  kadamInflowOutflowPondLevelReport,
  kadamGateParameterOverviewReport,
  kadamHrDamGateReport,
  sevenDayReport,

  //Report Download
  kadamOpeningGate1To18ReportWp,
  kadamDishchargeGate1To18ReportWp,
  kadamInflowOutflowPondLevelReportWp,
  kadamGateParameterOverviewReportWp,
  kadamHrDamGateReportWp,
};

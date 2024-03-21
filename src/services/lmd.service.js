const httpStatus = require('http-status');
const ExcelJS = require('exceljs');
const fastCsv = require('fast-csv');
const Docx = require('docx');
const puppeteer = require('puppeteer');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const {
  LMDS,
  LMD_POND_LEVEL_OVERVIEW,
  LMD_HR_RIGHT_ADVM,
  LMD_HR_DAM_OVERVIEW_POS,
  LMD_HR_DAM_OVERVIEW_DICH,
  LMD_DAM_OVERVIEW_POS,
  LMD_DAM_OVERVIEW_DICH,
  Permission,
} = require('../models');

const ApiError = require('../utils/ApiError');


const hyderabadImagePath = path.join(__dirname, '../../views/hyderabad.png');
const chetasImagePath = path.join(__dirname, '../../views/chetas1.png');



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

    if (
      user.role === 'admin' ||
      user.role === 'lmdSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
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

    if (
      user.role === 'admin' ||
      user.role === 'lmdSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
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
        getLastDataLmdDamPondLevelOverview,
      };
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

    if (
      user.role === 'admin' ||
      user.role === 'lmdSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const getLastDataLmdDamSpareAdvm = await LMD_HR_RIGHT_ADVM.findOne().sort({ dateTime: -1 });
      return getLastDataLmdDamSpareAdvm;
    } else {
      return 'You are not authorized to access this data';
    }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdDischargeGateReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, res, req) => {
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

    const lmdDischargeGateReport = await LMD_DAM_OVERVIEW_DICH.aggregate(pipeline);

    let totalCount = lmdDischargeGateReport[0]?.totalCount[0]?.count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: lmdDischargeGateReport[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdOpeningGateReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, res, req) => {
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

    const lmdOpeningGateReport = await LMD_DAM_OVERVIEW_POS.aggregate(pipeline);

    let totalCount = lmdOpeningGateReport[0]?.totalCount[0].count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: lmdOpeningGateReport[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdPondlevelGateReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, res, req) => {
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
          inflow2Level: 1,
          inflow3Level: 1,
          inflow1Discharge: 1,
          inflow2Discharge: 1,
          inflow3Discharge: 1,
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

    const lmdPondlevelGateReports = await LMD_POND_LEVEL_OVERVIEW.aggregate(pipeline);

    let totalCount = lmdPondlevelGateReports[0]?.totalCount[0].count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: lmdPondlevelGateReports[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdGateParameterOverviewReport = async (
  startDate,
  endDate,
  intervalMinutes,
  currentPage,
  perPage,
  startIndex,
  res,
  req
) => {
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

    const lmdGateParameterOverviewReport = await LMD_POND_LEVEL_OVERVIEW.aggregate(pipeline);

    let totalCount = lmdGateParameterOverviewReport[0]?.totalCount[0].count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: lmdGateParameterOverviewReport[0]?.data,
      currentPage,
      perPage,
      totalCount,
      totalPage,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdGateReport = async (startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, res, req) => {
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
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },

          hrrGate1Position: { $first: '$hrrGate1Position' },
          hrrGate2Position: { $first: '$hrrGate2Position' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrrGate1Position: 1,
          hrrGate2Position: 1,
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
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },

          hrrGate1Discharge: { $first: '$hrrGate1Discharge' },
          hrrGate2Discharge: { $first: '$hrrGate2Discharge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrrGate1Discharge: 1,
          hrrGate2Discharge: 1,
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

    const lmdGateReportPos = await LMD_HR_DAM_OVERVIEW_POS.aggregate(pipeline);
    const lmdGateReportDis = await LMD_HR_DAM_OVERVIEW_DICH.aggregate(pipeline1);

    let posData = lmdGateReportPos[0]?.data || [];
    let disData = lmdGateReportDis[0]?.data || [];

    let minLength = Math.max(posData.length, disData.length);

    // Merge data arrays based on index position
    let mergedData = Array.from({ length: minLength }, (_, index) => ({
      hrrGate1Position: posData[index]?.hrrGate1Position || 0,
      hrrGate2Position: posData[index]?.hrrGate2Position || 0,
      hrrGate1Discharge: disData[index]?.hrrGate1Discharge || 0,
      hrrGate2Discharge: disData[index]?.hrrGate2Discharge || 0,
      totalDischarge: disData[index]?.hrrGate1Discharge + disData[index]?.hrrGate2Discharge,
      dateTime: posData[index]?.dateTime || disData[index]?.dateTime || null,
    }));

    let totalCount = lmdGateReportPos[0]?.totalCount[0].count;
    const totalPage = Math.ceil(totalCount / perPage);

    return {
      data: mergedData,
      currentPage,
      perPage,
      totalCount,
      totalPage,
    };
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const sevenDayReport = async (user) => {
  try {
    const checkPermission = await Permission.findOne({ name: 'lmdReport' });

    if (
      user.role === 'admin' ||
      user.role === 'lmdSuperuser' ||
      (checkPermission && checkPermission.roleName.includes(user.role))
    ) {
      const currentDate = new Date();
      const sevenDaysAgo = new Date(currentDate);
      sevenDaysAgo.setDate(currentDate.getDate() - 6);

      const pondLevelSevenDayReport = await LMD_POND_LEVEL_OVERVIEW.find({
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

const lmdDischargeGateReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, res, req) => {
  try {
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
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const lmdDischargeGateReport1 = await LMD_DAM_OVERVIEW_DICH.aggregate(pipeline1);

   

    const hyderabadImagePath = path.join(__dirname, '../../views/hyderabad.png');
    const chetasImagePath = path.join(__dirname, '../../views/chetas1.png');

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('LMD Discharge Gate Report');

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
      addImageToWorksheet(chetasImagePath, [17, 19]);

      worksheet.getCell('H9').value = 'LMD DAM Gate 1 To 20 Discharge Report';
      const cell = worksheet.getCell('H9');
      cell.font = { bold: true, size: 20 };

      const headers = ['DateTime', ...Array.from({ length: 20 }, (_, i) => `Gate ${i + 1} \n (Cusecs)`)];
      worksheet.addRow([]);
      worksheet.addRow(headers);

      lmdDischargeGateReport1.forEach((row) => {
        const rowData = [row.dateTime, ...Array.from({ length: 20 }, (_, i) => row[`gate${i + 1}Discharge`])];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      worksheet.mergeCells('A1:U8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=LMD_Discharge_Gate_Report.xlsx');
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
      try {
        const itemsPerPage = 26; // Number of dates to print per page
        const totalItems = lmdDischargeGateReport1.length; // Total number of dates
        const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

        const sections = [];
        for (let page = 0; page < totalPages; page++) {
          const startIndex = page * itemsPerPage;
          const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
          const pageData = lmdDischargeGateReport1.slice(startIndex, endIndex);

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
                      width: 100,
                      height: 100,
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
                text: 'LMD Discharge Gate Report',
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
                        { length: 20 },
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
                          { length: 20 },
                          (_, i) =>
                            new Docx.TableCell({
                              children: [new Docx.Paragraph(item[`gate${i + 1}Discharge`].toString())],
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

        const doc = new Docx.Document({ sections: sections });

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename=LMD_Discharge_Gate_Report.docx');

        // Stream the Word document to the response
        const buffer = await Docx.Packer.toBuffer(doc);
        res.end(buffer);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      }
    } else if (exportToExcel == 4) {
      try {
        const dynamicHtml = await ejs.renderFile(path.join(__dirname, '../../views/lmdDischargeGate.ejs'), {
          lmdDischargeGateReport1: lmdDischargeGateReport1,
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(dynamicHtml);

        const pdfBuffer = await page.pdf({ format: 'Letter' });

        // Close browser
        await browser.close();

        res.setHeader('Content-Disposition', 'attachment; filename=LMD_Dam_Gate_1_To_20_Discharge_Report.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    }else{
      res.send(lmdDischargeGateReport1)
    }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdOpeningGateReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, res, req) => {
  try {
    const pipelineWithoutPagination = [
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
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const lmdOpeningGateReportWithoutPagination = await LMD_DAM_OVERVIEW_POS.aggregate(pipelineWithoutPagination);

    const hyderabadImagePath = path.join(__dirname, '../../views/hyderabad.png');
    const chetasImagePath = path.join(__dirname, '../../views/chetas1.png');

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('LMD Position Gate Report');

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
      addImageToWorksheet(chetasImagePath, [17, 19]);

      worksheet.getCell('H9').value = 'LMD DAM Gate 1 To 20 Opening Report';
      const cell = worksheet.getCell('H9');
      cell.font = { bold: true, size: 20 };

      const headers = ['DateTime', ...Array.from({ length: 20 }, (_, i) => `Gate ${i + 1} \n (Feet)`)];
      worksheet.addRow([]);
      worksheet.addRow(headers);

      lmdOpeningGateReportWithoutPagination.forEach((row) => {
        const rowData = [row.dateTime, ...Array.from({ length: 20 }, (_, i) => row[`gate${i + 1}Position`])];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
      });

      worksheet.mergeCells('A1:U8');
      const mergedCell = worksheet.getCell('A1');

      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF000000' } }, // Top border
        left: { style: 'thin', color: { argb: 'FF000000' } }, // Left border
        bottom: { style: 'thin', color: { argb: 'FF000000' } }, // Bottom border
        right: { style: 'thin', color: { argb: 'FF000000' } }, // Right border
      };

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=LMD_Dam_Gate_1_To_20_Opening_Report.xlsx');

      await workbook.xlsx.write(res);
    } else if (exportToExcel == 2) {
    } else if (exportToExcel == 3) {

      const itemsPerPage = 26; // Number of dates to print per page
      const totalItems = lmdOpeningGateReportWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = lmdOpeningGateReportWithoutPagination.slice(startIndex, endIndex);

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
                    width: 100,
                    height: 100,
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
              text: 'LMD Dam Gate 1 To 20 Opening Report',
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
                      { length: 20 },
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
                        { length: 20 },
                        (_, i) =>
                          new Docx.TableCell({
                            children: [new Docx.Paragraph(item[`gate${i + 1}Position`].toString())],
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
      res.setHeader('Content-Disposition', 'attachment; filename=LMD_Dam_Gate_1_To_20_Opening_Report.doc');

      // Stream the Word document to the response
      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else if (exportToExcel == 4) {
      try {
        const dynamicHtml = await ejs.renderFile(path.join(__dirname, '../../views/lmdOpeningGate.ejs'), {
          lmdOpeningGateReportWithoutPagination: lmdOpeningGateReportWithoutPagination,
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(dynamicHtml);
        const pdfBuffer = await page.pdf({ format: 'Letter' });
        await browser.close();

        res.setHeader('Content-Disposition', 'attachment; filename=LMD_Dam_Gate_1_To_20_Opening_Report.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    }else{
      res.send(lmdOpeningGateReportWithoutPagination)
    }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdPondlevelGateReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, res, req) => {
  try {
    const pipelineWithoutPagination = [
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
          inflow2Level: 1,
          inflow3Level: 1,
          inflow1Discharge: 1,
          inflow2Discharge: 1,
          inflow3Discharge: 1,
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

    const lmdPondlevelGateReportsWithoutPagination = await LMD_POND_LEVEL_OVERVIEW.aggregate(pipelineWithoutPagination);

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('LMD Dam Inflow Outflow PondLevel Report');

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
      addImageToWorksheet(chetasImagePath, [8, 9]);

      worksheet.getCell('E9').value = 'LMD Dam Inflow Outflow Pond Level Report';
      const cell = worksheet.getCell('E9');
      cell.font = { bold: true, size: 20 };

      const headers = [
        'DateTime',
        'Gagillapur\n Inflow Level\n (Feet)',
        'Gagillapur\n Inflow Discharge\n (Cusecs)',
        'Potour Inflow Level\n (Feet)',
        'Potour Inflow\n Discharge\n (Cusecs)',
        'Chintakunta LEVEL\n (Feet)',
        'Chintakunta DICH\n (Cusecs)',
        'Alugunuru Level\n (Feet)',
        'Alugunuru Discharge\n (Cusecs)',
        'Pond Level\n (Feet)',
      ];
      worksheet.addRow([]);
      worksheet.addRow(headers);

      lmdPondlevelGateReportsWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.inflow1Level,
          row.inflow1Discharge,
          row.inflow2Level,
          row.inflow2Discharge,
          row.inflow3Level,
          row.inflow3Discharge,
          row.damDownstreamLevel,
          row.damDownstreamDischarge,
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

      worksheet.getRow(11).eachCell((cell) => {
        cell.font = { bold: true };
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
      res.setHeader('Content-Disposition', 'attachment; filename=LMD_Dam_Inflow_Outflow_PondLevel_Report.xlsx');

      await workbook.xlsx.write(res);

    } else if (exportToExcel == 2) {
    } else if (exportToExcel == 3) {

      const itemsPerPage = 25; // Number of dates to print per page
      const totalItems = lmdPondlevelGateReportsWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = lmdPondlevelGateReportsWithoutPagination.slice(startIndex, endIndex);

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
                    width: 100,
                    height: 100,
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
              text: 'LMD Dam Inflow Outflow Pond-Level Report',
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
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gagillapur Inflow Level (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Gagillapur Inflow Discharge (Cusecs)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Potour Inflow Level (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Potour Inflow Discharge (Cusecs)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Chintakunta Level (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Chintakunta Discharge (Cusecs)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Alugunuru Level (Feet)')] }),
                    new Docx.TableCell({ children: [new Docx.Paragraph('Alugunuru Discharge (Cusecs)')] }),
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
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow1Level.toFixed(3))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow1Discharge.toFixed(3))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow2Level.toFixed(3))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow2Discharge.toFixed(3))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow3Level.toFixed(3))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.inflow3Discharge.toFixed(3))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.damDownstreamLevel.toFixed(3))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.damDownstreamDischarge.toFixed(3))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.pondLevel.toFixed(3))] }),
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
      res.setHeader('Content-Disposition', 'attachment; filename=LMD_Dam_Inflow_Outflow_PondLevel_Report.doc');

      // Stream the Word document to the response
      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else if (exportToExcel == 4)  {
      try {
        const dynamicHtml = await ejs.renderFile(path.join(__dirname, '../../views/lmdInflowOutflowPondLevel.ejs'), {
          lmdPondlevelGateReportsWithoutPagination: lmdPondlevelGateReportsWithoutPagination,
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(dynamicHtml);
        const pdfBuffer = await page.pdf({ format: 'Letter' });
        await browser.close();

        res.setHeader('Content-Disposition', 'attachment; filename=LMD_Dam_Inflow_Outflow_PondLevel_Report.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    }else{
      res.send(lmdPondlevelGateReportsWithoutPagination)
    }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdGateParameterOverviewReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, res, req) => {
  try {
    const pipelineWithoutPagination = [
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

    const lmdGateParameterOverviewReportWithoutPagination = await LMD_POND_LEVEL_OVERVIEW.aggregate(
      pipelineWithoutPagination
    );

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('LMD Dam Paramete Overview Report');

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: 'png',
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 4 },
          br: { col: colRange[1], row: 12 },
          editAs: 'oneCell',
        });
      };

      addImageToWorksheet('C://Dhruvin/Project/NSP-Hyderabad/views/hyderabad.png', [3, 6]);
      addImageToWorksheet('C://Dhruvin/Project/NSP-Hyderabad/views/chetas.png', [16, 18]);

      worksheet.getCell('I9').value = 'LMD Dam Paramete Overview Report';

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
      worksheet.addRow(headers);

      lmdGateParameterOverviewReportWithoutPagination.forEach((row) => {
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
      worksheet.getRow(3).height = 20;

      worksheet.getRow(15).eachCell((cell) => {
        cell.font = { bold: true };
        cell.height = { size: 10 };
      });

      worksheet.getCell('B3').font = { bold: true };

      worksheet.mergeCells('B4:T13');
      // worksheet.mergeCells('B10:T13');
      // worksheet.mergeCells('B9:H9');
      // worksheet.mergeCells('M9:T9');

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=LMD_Dam_Parameter_Overview_Report.xlsx');

      await workbook.xlsx.write(res);
    } else if (exportToExcel == 2) {
    } else if (exportToExcel == 3) {
      const logoImagePath = path.join(__dirname, '../../views/hyderabad.png');
      const chetasImagePath = path.join(__dirname, '../../views/chetas.png');

      const itemsPerPage = 25; // Number of dates to print per page
      const totalItems = lmdGateParameterOverviewReportWithoutPagination.length; // Total number of dates
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages needed

      const sections = [];
      for (let page = 0; page < totalPages; page++) {
        const startIndex = page * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const pageData = lmdGateParameterOverviewReportWithoutPagination.slice(startIndex, endIndex);

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
                  data: fs.readFileSync(logoImagePath),
                  transformation: {
                    width: 100,
                    height: 100,
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
              text: 'LMD Dam Parameter Overview Report',
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
      res.setHeader('Content-Disposition', 'attachment; filename=LMD_Dam_Parameter_Overview_Report.docx');

      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else if (exportToExcel == 4)  {
      try {
        const dynamicHtml = await ejs.renderFile(path.join(__dirname, '../../views/lmdParameterOverview.ejs'), {
          lmdGateParameterOverviewReportWithoutPagination: lmdGateParameterOverviewReportWithoutPagination,
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(dynamicHtml);
        const pdfBuffer = await page.pdf({ format: 'Letter' });
        await browser.close();

        res.setHeader('Content-Disposition', 'attachment; filename=LMD_Dam_Parameter_Overview_Report.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    }else{
      res.send(lmdGateParameterOverviewReportWithoutPagination)
    }
  } catch (error) {
    console.error('Error:', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const lmdGateReportWp = async (startDate, endDate, intervalMinutes, exportToExcel, res, req) => {
  try {
    const pipelineWithoutPagination = [
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
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },

          hrrGate1Position: { $first: '$hrrGate1Position' },
          hrrGate2Position: { $first: '$hrrGate2Position' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrrGate1Position: 1,
          hrrGate2Position: 1,
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
                $subtract: [{ $toLong: '$dateTime' }, { $mod: [{ $toLong: '$dateTime' }, intervalMinutes * 60 * 1000] }],
              },
            },
          },

          hrrGate1Discharge: { $first: '$hrrGate1Discharge' },
          hrrGate2Discharge: { $first: '$hrrGate2Discharge' },
        },
      },
      {
        $project: {
          _id: 0,
          dateTime: '$_id.interval',
          hrrGate1Discharge: 1,
          hrrGate2Discharge: 1,
        },
      },
      {
        $sort: {
          dateTime: 1,
        },
      },
    ];

    const lmdGateReportPosWithoutPagination = await LMD_HR_DAM_OVERVIEW_POS.aggregate(pipelineWithoutPagination);
    const lmdGateReportDisWithoutPagination = await LMD_HR_DAM_OVERVIEW_DICH.aggregate(pipeline1WithoutPagination);
    let posDataWithoutPagination = lmdGateReportPosWithoutPagination || [];
    let disDataWithoutPagination = lmdGateReportDisWithoutPagination || [];
    let minLengthWithoutPagination = Math.max(posDataWithoutPagination.length, disDataWithoutPagination.length);

    // Merge data arrays based on index position
    let mergedDataWithoutPagination = Array.from({ length: minLengthWithoutPagination }, (_, index) => ({
      hrrGate1Position: posDataWithoutPagination[index]?.hrrGate1Position || 0,
      hrrGate2Position: posDataWithoutPagination[index]?.hrrGate2Position || 0,
      hrrGate1Discharge: disDataWithoutPagination[index]?.hrrGate1Discharge || 0,
      hrrGate2Discharge: disDataWithoutPagination[index]?.hrrGate2Discharge || 0,
      totalDischarge:
        disDataWithoutPagination[index]?.hrrGate1Discharge + disDataWithoutPagination[index]?.hrrGate2Discharge,
      dateTime: posDataWithoutPagination[index]?.dateTime || disDataWithoutPagination[index]?.dateTime || null,
    }));

    if (exportToExcel == 1) {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('LMD HR Gate Report');

      const addImageToWorksheet = (imagePath, colRange) => {
        const imageId = workbook.addImage({
          filename: imagePath,
          extension: 'png',
          dimensions: { height: 100, width: 100 },
        });

        worksheet.addImage(imageId, {
          tl: { col: colRange[0], row: 4 },
          br: { col: colRange[1], row: 12 },
          editAs: 'oneCell',
        });
      };

      addImageToWorksheet('C://Dhruvin/Project/NSP-Hyderabad/views/hyderabad.png', [3, 6]);
      addImageToWorksheet('C://Dhruvin/Project/NSP-Hyderabad/views/chetas.png', [16, 18]);

      worksheet.getCell('I9').value = 'LMD HR Gate Report';

      const headers = [
        'DateTime',
        'Gate 1 Opening (Feet)',
        'Gate 1 Discharge (C/S)',
        'Gate 2 Opening (Feet)',
        'Gate 2 Discharge (C/S)',
        'Total Discharge (C/S)',
      ];
      worksheet.addRow([]);
      worksheet.addRow(headers);

      mergedDataWithoutPagination.forEach((row) => {
        const rowData = [
          row.dateTime,
          row.hrrGate1Position,
          row.hrrGate1Discharge,
          row.hrrGate2Position,
          row.hrrGate1Discharge,
          row.totalDischarge,
        ];
        worksheet.addRow(rowData);
      });

      const dateTimeColumn = worksheet.getColumn(1);
      dateTimeColumn.width = 20;
      dateTimeColumn.numFmt = 'yyyy-mm-dd hh:mm:ss';
      worksheet.getRow(3).height = 20;

      worksheet.getRow(15).eachCell((cell) => {
        cell.font = { bold: true };
        cell.height = { size: 10 };
      });

      worksheet.getCell('B3').font = { bold: true };

      worksheet.mergeCells('B4:T13');

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=LMD_HR_Gate_Report.xlsx');

      await workbook.xlsx.write(res);
    } else if (exportToExcel == 2) {
    } else if (exportToExcel == 3) {
      const logoImagePath = path.join(__dirname, '../../views/hyderabad.png');
      const chetasImagePath = path.join(__dirname, '../../views/chetas.png');

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
                  data: fs.readFileSync(logoImagePath),
                  transformation: {
                    width: 100,
                    height: 100,
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
              text: 'LMD HR canal Gate Report',
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
                    new Docx.TableCell({ children: [new Docx.Paragraph('Total Discharge(C/S)')] }),
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
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrrGate1Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrrGate1Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrrGate2Position.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.hrrGate2Discharge.toFixed(2))] }),
                      new Docx.TableCell({ children: [new Docx.Paragraph(item.totalDischarge.toFixed(2))] }),
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
      res.setHeader('Content-Disposition', 'attachment; filename=LMD_HR_Gat_Report.docx');

      const buffer = await Docx.Packer.toBuffer(doc);
      res.end(buffer);
    } else if (exportToExcel == 4) {
      try {
        const dynamicHtml = await ejs.renderFile(path.join(__dirname, '../../views/lmdHrGate.ejs'), {
          mergedDataWithoutPagination: mergedDataWithoutPagination,
        });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(dynamicHtml);
        const pdfBuffer = await page.pdf({ format: 'Letter' });
        await browser.close();

        res.setHeader('Content-Disposition', 'attachment; filename=.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
      } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
      }
    }else{
      res.send(mergedDataWithoutPagination)
    }
  } catch (error) {
    console.error('Error:', error);
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
  sevenDayReport,

  //Report Download
  lmdDischargeGateReportWp,
  lmdOpeningGateReportWp,
  lmdPondlevelGateReportWp,
  lmdGateParameterOverviewReportWp,
  lmdGateReportWp,
};

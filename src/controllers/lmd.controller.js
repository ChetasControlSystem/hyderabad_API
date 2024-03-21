const { lmdService } = require('../services');
const httpStatus = require('http-status');
const moment = require('moment');
const catchAsync = require('../utils/catchAsync');

const LHRA = require('../models/LMD_HR_RIGHT_ADVM');
const LPLO = require('../models/LMD_POND_LEVEL_OVERVIEW');
const LDOP = require('../models/LMD_DAM_OVERVIEW_POS');
const LDAD = require('../models/LMD_DAM_OVERVIEW_DICH');
const LHDOP = require('../models/LMD_HR_DAM_OVERVIEW_POS');
const LHDOD = require('../models/LMD_HR_DAM_OVERVIEW_DICH');

function getWeekNumber(date) {
  const onejan = new Date(date.getFullYear(), 0, 1);
  const millisecsInDay = 86400000;
  return Math.ceil(((date - onejan) / millisecsInDay + onejan.getDay() + 1) / 7);
}

async function lmdMongoDBData(data) {
  try {
    const lmdHrSsdAdvm = data.lmdHrSsdAdvm;
    const lmdPondLevel = data.lmdPondLevel;
    const lmdDamOverviewPosition = data.lmdDamOverviewPosition;
    const lmdDamOverviewDischarge = data.lmdDamOverviewDischarge;
    const lmdHrDamOverviewPosition = data.lmdHrDamOverviewPosition;
    const lmdHrDamOverviewDischarge = data.lmdHrDamOverviewDischarge;

    const mappedData = lmdHrSsdAdvm.map((row) => {
      const dateTime = new Date(row.DateTime);
      const date = dateTime.toISOString().split('T')[0];
      const time = dateTime.toTimeString().slice(0, 8);

      return {
        date: date,
        time: time,
        year: dateTime.getFullYear(),
        month: dateTime.getMonth() + 1,
        week: getWeekNumber(dateTime),
        quarter: Math.floor((dateTime.getMonth() + 3) / 3),
        dateTime: dateTime.toISOString(),
        hrrFlowRate: row.D1,
        hrrTotalizer: row.D2,
        hrrCDQ: row.D3,
        hrrLDQ: row.D4,
        hrrMQ: row.D5,
        hrrVelocity: row.D6,
        hrrAdvmSpare1: row.D7,
        hrrAdvmSpare2: row.D8,
        hrrAdvmSpare3: row.D9,
        hrrAdvmSpare4: row.D10,
        hrrAdvmSpare5: row.D11,
        hrrAdvmSpare6: row.D12,
        D13: row.D13,
        D14: row.D14,
        D15: row.D15,
        D16: row.D16,
        D17: row.D17,
        D18: row.D18,
        D19: row.D19,
        D20: row.D20,
        D21: row.D21,
        D22: row.D22,
        D23: row.D23,
        D24: row.D24,
        D25: row.D25,
        D26: row.D26,
        D27: row.D27,
        D28: row.D28,
        D29: row.D29,
        D30: row.D30,
        D31: row.D31,
        D32: row.D32,
        D33: row.D33,
        D34: row.D34,
        D35: row.D35,
        D36: row.D36,
        D37: row.D37,
        D38: row.D38,
        D39: row.D39,
        D40: row.D40,
        D41: row.D41,
        D42: row.D42,
      };
    });

    const mappedData1 = lmdPondLevel.map((row) => {
      const dateTime = new Date(row.DateTime);
      const date = dateTime.toISOString().split('T')[0];
      const time = dateTime.toTimeString().slice(0, 8);

      return {
        date: date,
        time: time,
        year: dateTime.getFullYear(),
        month: dateTime.getMonth() + 1,
        week: getWeekNumber(dateTime),
        quarter: Math.floor((dateTime.getMonth() + 3) / 3),
        dateTime: dateTime.toISOString(),
        inflow1Level: row.D1,
        inflow2Level: row.D2,
        inflow3Level: row.D3,
        inflow1Discharge: row.D4,
        inflow2Discharge: row.D5,
        inflow3Discharge: row.D6,
        damDownstreamLevel: row.D7,
        damDownstreamDischarge: row.D8,
        hrrDownstreamLevel: row.D9,
        hrrDownstreamDischarge: row.D10,
        D11: row.D11,
        D12: row.D12,
        D13: row.D13,
        D14: row.D14,
        D15: row.D15,
        D16: row.D16,
        liveCapacity: row.D17,
        grossStorage: row.D18,
        catchmentArea: row.D19,
        contourArea: row.D20,
        ayacutArea: row.D21,
        filling: row.D22,
        fullReservoirLevel: row.D23,
        instantaneousGateDischarge: row.D24,
        instantaneousCanalDischarge: row.D25,
        totalDamDischarge: row.D26,
        cumulativeDamDischarge: row.D27,
        pondLevel: row.D28,
        D29: row.D29,
        D30: row.D30,
        D31: row.D31,
        D32: row.D32,
        D33: row.D33,
        D34: row.D34,
        D35: row.D35,
        D36: row.D36,
        D37: row.D37,
        D38: row.D38,
        D39: row.D39,
        D40: row.D40,
        D41: row.D41,
        D42: row.D42,
      };
    });

    const mappedData2 = lmdDamOverviewPosition.map((row) => {
      const dateTime = moment(row.DateTime);
      return {
        date: dateTime.format('YYYY-MM-DD'),
        time: dateTime.format('HH:mm:ss'),
        year: dateTime.year(),
        month: dateTime.month() + 1,
        week: dateTime.week(),
        quarter: dateTime.quarter(),
        dateTime: dateTime.format(),
        gate1Position: row.D1,
        gate2Position: row.D2,
        gate3Position: row.D3,
        gate4Position: row.D4,
        gate5Position: row.D5,
        gate6Position: row.D6,
        gate7Position: row.D7,
        gate8Position: row.D8,
        gate9Position: row.D9,
        gate10Position: row.D10,
        gate11Position: row.D11,
        gate12Position: row.D12,
        gate13Position: row.D13,
        gate14Position: row.D14,
        gate15Position: row.D15,
        gate16Position: row.D16,
        gate17Position: row.D17,
        gate18Position: row.D18,
        gate19Position: row.D19,
        gate20Position: row.D20,
        D21: row.D21,
        D22: row.D22,
        D23: row.D23,
        D24: row.D24,
        D25: row.D25,
        D26: row.D26,
        D27: row.D27,
        D28: row.D28,
        D29: row.D29,
        D30: row.D30,
        D31: row.D31,
        D32: row.D32,
        D33: row.D33,
        D34: row.D34,
        D35: row.D35,
        D36: row.D36,
        D37: row.D37,
        D38: row.D38,
        D39: row.D39,
        D40: row.D40,
        D41: row.D41,
        D42: row.D42,
      };
    });

    const mappedData3 = lmdDamOverviewDischarge.map((row) => {
      const dateTime = new Date(row.DateTime);
      const date = dateTime.toISOString().split('T')[0];
      const time = dateTime.toTimeString().slice(0, 8);

      return {
        date: date,
        time: time,
        year: dateTime.getFullYear(),
        month: dateTime.getMonth() + 1,
        week: getWeekNumber(dateTime),
        quarter: Math.floor((dateTime.getMonth() + 3) / 3),
        dateTime: dateTime.toISOString(),
        gate1Discharge: row.D1,
        gate2Discharge: row.D2,
        gate3Discharge: row.D3,
        gate4Discharge: row.D4,
        gate5Discharge: row.D5,
        gate6Discharge: row.D6,
        gate7Discharge: row.D7,
        gate8Discharge: row.D8,
        gate9Discharge: row.D9,
        gate10Discharge: row.D10,
        gate11Discharge: row.D11,
        gate12Discharge: row.D12,
        gate13Discharge: row.D13,
        gate14Discharge: row.D14,
        gate15Discharge: row.D15,
        gate16Discharge: row.D16,
        gate17Discharge: row.D17,
        gate18Discharge: row.D18,
        gate19Discharge: row.D19,
        gate20Discharge: row.D20,
        D21: row.D21,
        D22: row.D22,
        D23: row.D23,
        D24: row.D24,
        D25: row.D25,
        D26: row.D26,
        D27: row.D27,
        D28: row.D28,
        D29: row.D29,
        D30: row.D30,
        D31: row.D31,
        D32: row.D32,
        D33: row.D33,
        D34: row.D34,
        D35: row.D35,
        D36: row.D36,
        D37: row.D37,
        D38: row.D38,
        D39: row.D39,
        D40: row.D40,
        D41: row.D41,
        D42: row.D42,
      };
    });

    const mappedData4 = lmdHrDamOverviewPosition.map((row) => {
      const dateTime = new Date(row.DateTime);
      const date = dateTime.toISOString().split('T')[0];
      const time = dateTime.toTimeString().slice(0, 8);

      return {
        date: date,
        time: time,
        year: dateTime.getFullYear(),
        month: dateTime.getMonth() + 1,
        week: getWeekNumber(dateTime),
        quarter: Math.floor((dateTime.getMonth() + 3) / 3),
        dateTime: dateTime.toISOString(),
        hrrGate1Position: row.D1,
        hrrGate2Position: row.D2,
        D3: row.D3,
        D4: row.D4,
        D5: row.D5,
        D6: row.D6,
        D7: row.D7,
        D8: row.D8,
        D9: row.D9,
        D10: row.D10,
        D11: row.D11,
        D12: row.D12,
        D13: row.D13,
        D14: row.D14,
        D15: row.D15,
        D16: row.D16,
        D17: row.D17,
        D18: row.D18,
        D19: row.D19,
        D20: row.D20,
        D21: row.D21,
        D22: row.D22,
        D23: row.D23,
        D24: row.D24,
        D25: row.D25,
        D26: row.D26,
        D27: row.D27,
        D28: row.D28,
        D29: row.D29,
        D30: row.D30,
        D31: row.D31,
        D32: row.D32,
        D33: row.D33,
        D34: row.D34,
        D35: row.D35,
        D36: row.D36,
        D37: row.D37,
        D38: row.D38,
        D39: row.D39,
        D40: row.D40,
        D41: row.D41,
        D42: row.D42,
      };
    });

    const mappedData5 = lmdHrDamOverviewDischarge.map((row) => {
      const dateTime = new Date(row.DateTime);
      const date = dateTime.toISOString().split('T')[0];
      const time = dateTime.toTimeString().slice(0, 8);

      return {
        date: date,
        time: time,
        year: dateTime.getFullYear(),
        month: dateTime.getMonth() + 1,
        week: getWeekNumber(dateTime),
        quarter: Math.floor((dateTime.getMonth() + 3) / 3),
        dateTime: dateTime.toISOString(),
        hrrGate1Discharge: row.D1,
        hrrGate2Discharge: row.D2,
        D3: row.D3,
        D4: row.D4,
        D5: row.D5,
        D6: row.D6,
        D7: row.D7,
        D8: row.D8,
        D9: row.D9,
        D10: row.D10,
        D11: row.D11,
        D12: row.D12,
        D13: row.D13,
        D14: row.D14,
        D15: row.D15,
        D16: row.D16,
        D17: row.D17,
        D18: row.D18,
        D19: row.D19,
        D20: row.D20,
        D21: row.D21,
        D22: row.D22,
        D23: row.D23,
        D24: row.D24,
        D25: row.D25,
        D26: row.D26,
        D27: row.D27,
        D28: row.D28,
        D29: row.D29,
        D30: row.D30,
        D31: row.D31,
        D32: row.D32,
        D33: row.D33,
        D34: row.D34,
        D35: row.D35,
        D36: row.D36,
        D37: row.D37,
        D38: row.D38,
        D39: row.D39,
        D40: row.D40,
        D41: row.D41,
        D42: row.D42,
      };
    });

    const lmdHrRightAdnm = await LHRA.find().sort({ dateTime: -1 }).limit(1);
    const lmdPondLevelOverview = await LPLO.find().sort({ dateTime: -1 }).limit(1);
    const lmdDamOverviewPos = await LDOP.find().sort({ dateTime: -1 }).limit(1);
    const lmdDamOverviewDis = await LDAD.find().sort({ dateTime: -1 }).limit(1);
    const lmdHrDamOverviewPos = await LHDOP.find().sort({ dateTime: -1 }).limit(1);
    const lmdHrDamOverviewDis = await LHDOD.find().sort({ dateTime: -1 }).limit(1);

    if (lmdHrRightAdnm.length) {
      const LastDate = new Date(lmdHrRightAdnm[0].dateTime);
      const newArray = mappedData
        .map((datetimeString) => {
          const datetime = new Date(datetimeString.dateTime);
          if (datetime > LastDate) {
            return datetimeString;
          }
          return null;
        })
        .filter((item) => item !== null);

      await LHRA.insertMany(newArray);
    } else {
      await LHRA.insertMany(mappedData);
    }

    if (lmdPondLevelOverview.length) {
      const LastDate = new Date(lmdPondLevelOverview[0].dateTime);
      const newArray = mappedData1
        .map((datetimeString) => {
          const datetime = new Date(datetimeString.dateTime);
          if (datetime > LastDate) {
            return datetimeString;
          }
          return null;
        })
        .filter((item) => item !== null);

      await LPLO.insertMany(newArray);
    } else {
      await LPLO.insertMany(mappedData1);
    }

    if (lmdDamOverviewPos.length) {
      const LastDate = new Date(lmdDamOverviewPos[0].dateTime);
      const newArray = mappedData2
        .map((datetimeString) => {
          const datetime = new Date(datetimeString.dateTime);
          if (datetime > LastDate) {
            return datetimeString;
          }
          return null;
        })
        .filter((item) => item !== null);

      await LDOP.insertMany(newArray);
    } else {
      await LDOP.insertMany(mappedData2);
    }

    if (lmdDamOverviewDis.length) {
      const LastDate = new Date(lmdDamOverviewDis[0].dateTime);
      const newArray = mappedData3
        .map((datetimeString) => {
          const datetime = new Date(datetimeString.dateTime);
          if (datetime > LastDate) {
            return datetimeString;
          }
          return null;
        })
        .filter((item) => item !== null);

      await LDAD.insertMany(newArray);
    } else {
      await LDAD.insertMany(mappedData3);
    }

    if (lmdHrDamOverviewPos.length) {
      const LastDate = new Date(lmdHrDamOverviewPos[0].dateTime);
      const newArray = mappedData4
        .map((datetimeString) => {
          const datetime = new Date(datetimeString.dateTime);
          if (datetime > LastDate) {
            return datetimeString;
          }
          return null;
        })
        .filter((item) => item !== null);

      await LHDOP.insertMany(newArray);
    } else {
      await LHDOP.insertMany(mappedData4);
    }

    if (lmdHrDamOverviewDis.length) {
      const LastDate = new Date(lmdHrDamOverviewDis[0].dateTime);
      const newArray = mappedData5
        .map((datetimeString) => {
          const datetime = new Date(datetimeString.dateTime);
          if (datetime > LastDate) {
            return datetimeString;
          }
          return null;
        })
        .filter((item) => item !== null);

      await LHDOD.insertMany(newArray);
    } else {
      await LHDOD.insertMany(mappedData5);
    }
  } catch (error) {
    console.error('Error handling MongoDB data:', error);
  }
}

const createSalientFeature = catchAsync(async (req, res) => {
  const createSalientFeature = await lmdService.createSalientFeature(req.body, req.user);
  res.status(httpStatus.CREATED).send(createSalientFeature);
});

const getSalientFeature = catchAsync(async (req, res) => {
  const getSalientFeature = await lmdService.getSalientFeature(req.user);
  res.send(getSalientFeature);
});

const lmdDamOverview = catchAsync(async (req, res) => {
  const getLastDataLmdDamOverview = await lmdService.getLastDataLmdDamOverview(req.user);
  res.json(getLastDataLmdDamOverview);
});

const getLastDataLmdDamSpareAdvm = catchAsync(async (req, res) => {
  const getLastDataLmdDamSpareAdvm = await lmdService.getLastDataLmdDamSpareAdvm(req.user);
  res.send(getLastDataLmdDamSpareAdvm);
});

const lmdDischargeGateReport = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes } = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const currentPage = parseInt(req.query.currentPage) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  let startIndex = (currentPage - 1) * perPage;

  const lmdDischargeGateReport = await lmdService.lmdDischargeGateReport(
    startDate,
    endDate,
    intervalMinutes,
    currentPage,
    perPage,
    startIndex,
    res,
    req,
    req.user
  );

  return res.json(lmdDischargeGateReport);
});

const lmdOpeningGateReport = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes } = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const currentPage = parseInt(req.query.currentPage) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  let startIndex = (currentPage - 1) * perPage;

  const lmdOpeningGateReport = await lmdService.lmdOpeningGateReport(
    startDate,
    endDate,
    intervalMinutes,
    currentPage,
    perPage,
    startIndex,
    res,
    req,
    req.user
  );

  res.json(lmdOpeningGateReport);
});

const lmdPondlevelGateReport = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes } = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const currentPage = parseInt(req.query.currentPage) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  let startIndex = (currentPage - 1) * perPage;

  const lmdPondlevelGateReport = await lmdService.lmdPondlevelGateReport(
    startDate,
    endDate,
    intervalMinutes,
    currentPage,
    perPage,
    startIndex,
    res,
    req,
    req.user
  );

  res.json(lmdPondlevelGateReport);
});

const lmdGateParameterOverviewReport = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes } = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const currentPage = parseInt(req.query.currentPage) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  let startIndex = (currentPage - 1) * perPage;

  const lmdGateParameterOverviewReport = await lmdService.lmdGateParameterOverviewReport(
    startDate,
    endDate,
    intervalMinutes,
    currentPage,
    perPage,
    startIndex,
    res,
    req,
    req.user
  );

  res.json(lmdGateParameterOverviewReport);
});

const lmdHrGateReport = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes } = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const currentPage = parseInt(req.query.currentPage) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  let startIndex = (currentPage - 1) * perPage;

  const lmdGateParameterOverviewReport = await lmdService.lmdGateReport(
    startDate,
    endDate,
    intervalMinutes,
    currentPage,
    perPage,
    startIndex,
    res,
    req,
    req.user
  );

  res.json(lmdGateParameterOverviewReport);
});

const sevenDayReport = catchAsync(async (req, res) => {
  const sevenDayReport = await lmdService.sevenDayReport(req.user);
  res.send(sevenDayReport);
});

///Report Download
const lmdDischargeGateReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel } = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const lmdDischargeGateReport = await lmdService.lmdDischargeGateReportWp(
    startDate,
    endDate,
    intervalMinutes,
    exportToExcel,
    res,
    req,
    req.user
  );
  return res.json(lmdDischargeGateReport);
});

const lmdOpeningGateReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel } = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const lmdOpeningGateReport = await lmdService.lmdOpeningGateReportWp(
    startDate,
    endDate,
    intervalMinutes,
    exportToExcel,
    res,
    req,
    req.user
  );

  res.json(lmdOpeningGateReport);
});

const lmdPondlevelGateReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel } = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const lmdPondlevelGateReport = await lmdService.lmdPondlevelGateReportWp(
    startDate,
    endDate,
    intervalMinutes,
    exportToExcel,
    res,
    req,
    req.user
  );

  res.json(lmdPondlevelGateReport);
});

const lmdGateParameterOverviewReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel } = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const lmdGateParameterOverviewReport = await lmdService.lmdGateParameterOverviewReportWp(
    startDate,
    endDate,
    intervalMinutes,
    exportToExcel,
    res,
    req,
    req.user
  );

  res.json(lmdGateParameterOverviewReport);
});

const lmdHrGateReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel } = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const lmdHrGateReportWp = await lmdService.lmdGateReportWp(
    startDate,
    endDate,
    intervalMinutes,
    exportToExcel,
    res,
    req,
    req.user
  );

  res.json(lmdHrGateReportWp);
});

module.exports = {
  lmdMongoDBData,
  createSalientFeature,
  getSalientFeature,
  lmdDamOverview,
  getLastDataLmdDamSpareAdvm,
  lmdDischargeGateReport,
  lmdOpeningGateReport,
  lmdPondlevelGateReport,
  lmdGateParameterOverviewReport,
  lmdHrGateReport,
  sevenDayReport,

  //without pagination
  lmdDischargeGateReportWp,
  lmdOpeningGateReportWp,
  lmdPondlevelGateReportWp,
  lmdGateParameterOverviewReportWp,
  lmdHrGateReportWp,
};

const { lmdService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const LHRA = require('../models/LMD_HR_RIGHT_ADVM');
const LPLO = require('../models/LMD_POND_LEVEL_OVERVIEW');
const LDOP = require('../models/LMD_DAM_OVERVIEW_POS');
const LDAD = require('../models/LMD_DAM_OVERVIEW_DICH');
const LHDOP = require('../models/LMD_HR_DAM_OVERVIEW_POS');
const LHDOD = require('../models/LMD_HR_DAM_OVERVIEW_DICH');

async function lmdMongoDBData(data) {
  try {
  
    const mapLmdHrSsdAdvm = row => ({
        dateTime: row.DateTime.toISOString(),
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
    });

    const mapLmdPondLevel = row => ({
      dateTime: row.DateTime.toISOString(),
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
    });

    const mapLmdDamOverviewPosition = row => ({
        dateTime: row.DateTime.toISOString(),
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
    });

    const mapLmdDamOverviewDischarge = row => ({
        dateTime: row.DateTime.toISOString(),
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
    });

    const mapLmdHrDamOverviewPosition = row => ({
        dateTime: row.DateTime.toISOString(),
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
    });

    const mapLmdHrDamOverviewDischarge = row => ({
        dateTime: row.DateTime.toISOString(),
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
    });

    const collections = [
      { source: data?.lmdHrSsdAdvm, destination: LHRA, mapFunction: mapLmdHrSsdAdvm },
      { source: data?.lmdPondLevel, destination: LPLO, mapFunction: mapLmdPondLevel },
      { source: data?.lmdDamOverviewPosition, destination: LDOP, mapFunction: mapLmdDamOverviewPosition },
      { source: data?.lmdDamOverviewDischarge, destination: LDAD, mapFunction: mapLmdDamOverviewDischarge },
      { source: data?.lmdHrDamOverviewPosition, destination: LHDOP, mapFunction: mapLmdHrDamOverviewPosition },
      { source: data?.lmdHrDamOverviewDischarge, destination: LHDOD, mapFunction: mapLmdHrDamOverviewDischarge }
    ];

    const mapDataAndInsert = async (source, destination, mapFunction) => {
      if (source && source.length > 0) {
        const mappedData = source.map(mapFunction);
        await destination.insertMany(mappedData);
      }
    };

    await Promise.all(collections.map(async ({ source, destination, mapFunction }) => {
      await mapDataAndInsert(source, destination, mapFunction);
    }));

  } catch (error) {
    console.error('Error handling MongoDB data:', error);
  }
}

const createSalientFeature = catchAsync(async (req, res) => {
  const createSalientFeature = await lmdService.createSalientFeature(req.body, req.user);
  res.status(httpStatus.CREATED).json(createSalientFeature);
});

const getSalientFeature = catchAsync(async (req, res) => {
  const getSalientFeature = await lmdService.getSalientFeature(req.user);
  res.json(getSalientFeature);
});

const lmdDamOverview = catchAsync(async (req, res) => {
  const getLastDataLmdDamOverview = await lmdService.getLastDataLmdDamOverview(req.user);
  res.json(getLastDataLmdDamOverview);
});

const getLastDataLmdDamSpareAdvm = catchAsync(async (req, res) => {
  const getLastDataLmdDamSpareAdvm = await lmdService.getLastDataLmdDamSpareAdvm(req.user);
  res.json(getLastDataLmdDamSpareAdvm);
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
    req.user,
    res,
    req,
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
    req.user,
    res,
    req
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
    req.user,
    res,
    req,
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
    req.user,
    res,
    req,
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
    req.user,
    res,
    req,
  );

  res.json(lmdGateParameterOverviewReport);
});

const sevenDayReport = catchAsync(async (req, res) => {
  const sevenDayReport = await lmdService.sevenDayReport(req.user);
  res.json(sevenDayReport);
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
    req.user,
    res,
    req,
  );
  res.json(lmdDischargeGateReport);
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
    req.user,
    res,
    req
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
    req.user,
    res,
    req
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
    req.user,
    res,
    req
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
    req.user,
    res,
    req
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

const { knrService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const KPLO = require('../models/KNR_POND_LEVEL_OVERVIEW');
const KDOP = require('../models/KNR_DAM_OVERVIEW_POS');
const KDOD = require('../models/KNR_DAM_OVERVIEW_DICH');
const KHDOP = require('../models/KNR_HR_DAM_OVERVIEW_POS');
const KHDOD = require('../models/KNR_HR_DAM_OVERVIEW_DICH');
const KSADVM = require('../models/KNR_SPARE_ADVM');

async function kadamMongoDBData(data) {
  try {

    const mapKadamPondLevel = row => ({
      dateTime: row.DateTime.toISOString(),
      inflow1Level: row.D1,
      inflow2Level: row.D2,
      inflow3Level: row.D3,
      inflow1Discharge: row.D4,
      inflow2Discharge: row.D5,
      inflow3Discharge: row.D6,
      damOutflowLevel: row.D7,
      damOutflowDischarge: row.D8,
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

    const mapKadamKnrDamOverviewPosition = row => ({
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

    const mapKadamKnrDamOverviewDischarge = row => ({
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

    const mapKadamHrDamOverviewPosition = row => ({
        dateTime: row.DateTime.toISOString(),
        hrklManGate1Position: row.D1,
        hrklManGate2Position: row.D2,
        hrklManGate3Position: row.D3,
        hrklManGate4Position: row.D4,
        hrklManGate5Position: row.D5,
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

    const mapKadamHrDamOverviewDischarge = row => ({
      dateTime: row.DateTime.toISOString(),
      hrklManGate1Discharge: row.D1,
      hrklManGate2Discharge: row.D2,
      hrklManGate3Discharge: row.D3,
      hrklManGate4Discharge: row.D4,
      hrklManGate5Discharge: row.D5,
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

    const mapKadamHrKnrAdvm = row => ({
      dateTime: row.DateTime.toISOString(),
      D1: row.D1,
      D2: row.D2,
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
      { source: data?.kadamPondLevel, destination: KPLO, mapFunction: mapKadamPondLevel },
      { source: data?.kadamKnrDamOverviewPosition, destination: KDOP, mapFunction: mapKadamKnrDamOverviewPosition },
      { source: data?.kadamKnrDamOverviewDischarge, destination: KDOD, mapFunction: mapKadamKnrDamOverviewDischarge },
      { source: data?.kadamHrDamOverviewPosition, destination: KHDOP, mapFunction: mapKadamHrDamOverviewPosition },
      { source: data?.kadamHrDamOverviewDischarge, destination: KHDOD, mapFunction: mapKadamHrDamOverviewDischarge },
      { source: data?.kadamHrKnrAdvm, destination: KSADVM, mapFunction: mapKadamHrKnrAdvm }
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
  const createSalientFeature = await knrService.createSalientFeature(req.body, req.user);
  res.status(httpStatus.CREATED).json(createSalientFeature);
});

const getSalientFeature = catchAsync(async (req, res) => {
  const getSalientFeature = await knrService.getSalientFeature(req.user);
  res.json(getSalientFeature);
});

const kadamDamOverview = catchAsync(async (req, res) => {
  const getLastDataKadamDamOverview = await knrService.getLastDataKadamDamOverview(req.user);
  res.json(getLastDataKadamDamOverview);
});

const getLastDataKadamDamSpareAdvm = catchAsync(async (req, res) => {
  const getLastDataKadamDamSpareAdvm = await knrService.getLastDataKadamDamSpareAdvm(req.user);
  res.json(getLastDataKadamDamSpareAdvm);
});

const sevenDayReport = catchAsync(async (req, res) => {
  const sevenDayReport = await knrService.sevenDayReport(req.user);
  res.json(sevenDayReport);
});

const kadamOpeningGate1To18Report = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const currentPage = parseInt(req.query.currentPage) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  let startIndex = (currentPage - 1) * perPage;

  const kadamOpeningGate1To18Report = await knrService.kadamOpeningGate1To18Report(startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, req.user, res, req);

  res.json(kadamOpeningGate1To18Report);
});

const kadamDishchargeGate1To18Report = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const currentPage = parseInt(req.query.currentPage) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  let startIndex = (currentPage - 1) * perPage;

  const kadamDishchargeGate1To18Report = await knrService.kadamDishchargeGate1To18Report(startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, req.user, res, req);

  res.json(kadamDishchargeGate1To18Report);
});

const kadamInflowOutflowPondLevelReport = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const currentPage = parseInt(req.query.currentPage) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  let startIndex = (currentPage - 1) * perPage;

  const kadamInflowOutflowPondLevelReport = await knrService.kadamInflowOutflowPondLevelReport(startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, req.user, res, req);

  res.json(kadamInflowOutflowPondLevelReport);
});

const kadamGateParameterOverviewReport = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const currentPage = parseInt(req.query.currentPage) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  let startIndex = (currentPage - 1) * perPage;

  const kadamGateParameterOverviewReport = await knrService.kadamGateParameterOverviewReport(startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, req.user, res, req);

  res.json(kadamGateParameterOverviewReport);
});

const kadamHrDamGateReport = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const currentPage = parseInt(req.query.currentPage) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  let startIndex = (currentPage - 1) * perPage;

  const kadamHrDamGateReport = await knrService.kadamHrDamGateReport(startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, req.user, res, req);

  res.json(kadamHrDamGateReport);
});
 

///Report Download
const kadamOpeningGate1To18ReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const kadamOpeningGate1To18Report = await knrService.kadamOpeningGate1To18ReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(kadamOpeningGate1To18Report);
});

const kadamDishchargeGate1To18ReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const kadamDishchargeGate1To18Report = await knrService.kadamDishchargeGate1To18ReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(kadamDishchargeGate1To18Report);
});

const kadamInflowOutflowPondLevelReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const kadamInflowOutflowPondLevelReport = await knrService.kadamInflowOutflowPondLevelReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(kadamInflowOutflowPondLevelReport);
});

const kadamGateParameterOverviewReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const kadamGateParameterOverviewReport = await knrService.kadamGateParameterOverviewReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(kadamGateParameterOverviewReport);
});

const kadamHrDamGateReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const kadamHrDamGateReport = await knrService.kadamHrDamGateReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(kadamHrDamGateReport);
});


module.exports = {
  kadamMongoDBData,
  createSalientFeature,
  getSalientFeature,
  kadamDamOverview,
  getLastDataKadamDamSpareAdvm,
  kadamOpeningGate1To18Report,
  kadamDishchargeGate1To18Report,
  kadamInflowOutflowPondLevelReport,
  kadamGateParameterOverviewReport,
  kadamHrDamGateReport,
  sevenDayReport,

  //without pagination
  kadamOpeningGate1To18ReportWp,
  kadamDishchargeGate1To18ReportWp,
  kadamInflowOutflowPondLevelReportWp,
  kadamGateParameterOverviewReportWp,
  kadamHrDamGateReportWp
};

const { srspService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment');

const SPLO = require('../models/SRSP_POND_LEVEL_OVERVIEW');
const SSDOP = require('../models/SRSP_SSD_DAM_OVERVIEW_POS');
const SHDOP = require('../models/SRSP_HR_DAM_OVERVIEW_POS');
const SDOD = require('../models/SRSP_SSD_DAM_OVERVIEW_DICH');
const SHKA = require('../models/SRSP_HR_KAKATIYA_ADVM');
const SHDOD = require('../models/SRSP_HR_DAM_OVERVIEW_DICH');

async function handleMongoDBData(data) {
  try {

    const mapSrspPondLevel = row => ({
      dateTime: row.DateTime.toISOString(),
      inflow1Level: row.D1,
      inflow2Level: row.D2,
      D3: row.D3,
      inflow1Discharge: row.D4,
      inflow2Discharge: row.D5,
      D6: row.D6,
      damDownstreamLevel: row.D7,
      damDownstreamDischarge: row.D8,
      hrkDownstreamLevel: row.D9,
      hrkDownstreamDischarge: row.D10,
      hrsDownstreamLevel: row.D11,
      hrsDownstreamDischarge: row.D12,
      hrfDownstreamLevel: row.D13,
      hrfDownstreamDischarge: row.D14,
      hrlDownstreamLevel: row.D15,
      hrlDownstreamDischarge: row.D16,
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

    const mapsrspSsdDamOverviewPosition = row => ({
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
      gate21Position: row.D21,
      gate22Position: row.D22,
      gate23Position: row.D23,
      gate24Position: row.D24,
      gate25Position: row.D25,
      gate26Position: row.D26,
      gate27Position: row.D27,
      gate28Position: row.D28,
      gate29Position: row.D29,
      gate30Position: row.D30,
      gate31Position: row.D31,
      gate32Position: row.D32,
      gate33Position: row.D33,
      gate34Position: row.D34,
      gate35Position: row.D35,
      gate36Position: row.D36,
      gate37Position: row.D37,
      gate38Position: row.D38,
      gate39Position: row.D39,
      gate40Position: row.D40,
      gate41Position: row.D41,
      gate42Position: row.D42,
    });

    const mapsrspHrDamOverviewPosition = row => ({
      dateTime: row.DateTime.toISOString(),
      hrkGate1Position: row.D1,
        hrkGate2Position: row.D2,
        hrkGate3Position: row.D3,
        hrkGate4Position: row.D4,
        hrsGate1Position: row.D5,
        hrsGate2Position: row.D6,
        hrfGate1Position: row.D7,
        hrfGate2Position: row.D8,
        hrfGate3Position: row.D9,
        hrfGate4Position: row.D10,
        hrfGate5Position: row.D11,
        hrfGate6Position: row.D12,
        hrlManGate1Position: row.D13,
        hrlManGate2Position: row.D14,
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

    const mapsrspSsdDamOverviewDischarge = row => ({
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
        gate21Discharge: row.D21,
        gate22Discharge: row.D22,
        gate23Discharge: row.D23,
        gate24Discharge: row.D24,
        gate25Discharge: row.D25,
        gate26Discharge: row.D26,
        gate27Discharge: row.D27,
        gate28Discharge: row.D28,
        gate29Discharge: row.D29,
        gate30Discharge: row.D30,
        gate31Discharge: row.D31,
        gate32Discharge: row.D32,
        gate33Discharge: row.D33,
        gate34Discharge: row.D34,
        gate35Discharge: row.D35,
        gate36Discharge: row.D36,
        gate37Discharge: row.D37,
        gate38Discharge: row.D38,
        gate39Discharge: row.D39,
        gate40Discharge: row.D40,
        gate41Discharge: row.D41,
        gate42Discharge: row.D42,
    });

    const mapsrspHrSsdAdvm = row => ({
      dateTime: row.DateTime.toISOString(),
      hrkFlowRate: row.D1,
        hrkCDQ: row.D2,
        hrkLDQ: row.D3,
        hrkMQ: row.D4,
        hrkVelocity: row.D5,
        hrkAdvmSpare1: row.D6,
        hrkAdvmSpare2: row.D7,
        hrkAdvmSpare3: row.D8,
        hrkAdvmSpare4: row.D9,
        hrkAdvmSpare5: row.D10,
        hrkAdvmSpare6: row.D11,
        hrfGate6Position: row.D12,
        hrlManGate1Position: row.D13,
        hrlManGate2Position: row.D14,
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

    const mapsrspHrDamOverviewDischarge = row => ({
      dateTime: row.DateTime.toISOString(),
      hrkGate1Discharge: row.D1,
      hrkGate2Discharge: row.D2,
      hrkGate3Discharge: row.D3,
      hrkGate4Discharge: row.D4,
      hrsGate1Discharge: row.D5,
      hrsGate2Discharge: row.D6,
      hrfGate1Discharge: row.D7,
      hrfGate2Discharge: row.D8,
      hrfGate3Discharge: row.D9,
      hrfGate4Discharge: row.D10,
      hrfGate5Discharge: row.D11,
      hrfGate6Discharge: row.D12,
      hrlManGate1Discharge: row.D13,
      hrlManGate2Discharge: row.D14,
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
      { source: data?.srspPondLevel, destination: SPLO, mapFunction: mapSrspPondLevel },
      { source: data?.srspSsdDamOverviewPosition, destination: SSDOP, mapFunction: mapsrspSsdDamOverviewPosition },
      { source: data?.srspHrDamOverviewPosition, destination: SHDOP, mapFunction: mapsrspHrDamOverviewPosition },
      { source: data?.srspSsdDamOverviewDischarge, destination: SDOD, mapFunction: mapsrspSsdDamOverviewDischarge },
      { source: data?.srspHrSsdAdvm, destination: SHKA, mapFunction: mapsrspHrSsdAdvm },
      { source: data?.srspHrDamOverviewDischarge, destination: SHDOD, mapFunction: mapsrspHrDamOverviewDischarge }
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
  const createSalientFeature = await srspService.createSalientFeature(req.body);
  res.status(httpStatus.CREATED).json(createSalientFeature);
});

const getSalientFeature = catchAsync(async (req, res) => {
  const getSalientFeature = await srspService.getSalientFeature(req.user);
  res.json(getSalientFeature);
});

const srspDamOverview = catchAsync(async (req, res) => {
  const getLastDataSrspDamOverview = await srspService.getLastDataSrspDamOverview(req.user);
  res.json(getLastDataSrspDamOverview);
});

const getLastDataSrspDamSpareAdvm = catchAsync(async (req, res) => {
  const getLastDataLmdDamSpareAdvm = await srspService.getLastDataSrspDamSpareAdvm(req.user);
  res.json(getLastDataLmdDamSpareAdvm);
});

const srspDischargeGate1TO21Report = catchAsync(async (req, res) => {
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

  const srspDischargeGate1TO21Report = await srspService.srspDischargeGate1TO21Report(startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, req.user, res, req);

  res.json(srspDischargeGate1TO21Report);
});

const srspDischargeGate22TO42Report = catchAsync(async (req, res) => {
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

  const srspDischargeGate22TO42Report = await srspService.srspDischargeGate22TO42Report(startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, req.user, res, req);
  res.json(srspDischargeGate22TO42Report);
});

const srspOpeningGate1TO21Report = catchAsync(async (req, res) => {
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

  const srspOpeningGate1TO21Report = await srspService.srspOpeningGate1TO21Report(startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, req.user, res, req);

  res.json(srspOpeningGate1TO21Report);
});

const srspOpeningGate22TO42Report = catchAsync(async (req, res) => {
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

  const srspOpeningGate22TO42Report = await srspService.srspOpeningGate22TO42Report(startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, req.user, res, req);

  res.json(srspOpeningGate22TO42Report);
});

const srspInflowOutflowPondLevelReport = catchAsync(async (req, res) => {
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

  const srspInflowOutflowPondLevelReport = await srspService.srspInflowOutflowPondLevelReport(startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, req.user, res, req);

  res.json(srspInflowOutflowPondLevelReport);
});

const srspParameterOverviewReport = catchAsync(async (req, res) => {
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

  const srspParameterOverviewReport = await srspService.srspParameterOverviewReport(startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, req.user, res, req);

  res.json(srspParameterOverviewReport);
});

const srspHrDamGateReport = catchAsync(async (req, res) => {
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

  const srspHrDamGateReport = await srspService.srspHrDamGateReport(startDate, endDate, intervalMinutes, currentPage, perPage, startIndex, req.user, res, req);

  res.json(srspHrDamGateReport);
});

const sevenDayReport = catchAsync(async (req, res) => {
  const sevenDayReport = await srspService.sevenDayReport(req.user);
  res.json(sevenDayReport);
});



//Download report

const srspDischargeGate1TO21ReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const srspDischargeGate1TO21Report = await srspService.srspDischargeGate1TO21ReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(srspDischargeGate1TO21Report);
});

const srspDischargeGate22TO42ReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const srspDischargeGate22TO42Report = await srspService.srspDischargeGate22TO42ReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user,res, req);
  res.json(srspDischargeGate22TO42Report);
});

const srspOpeningGate1TO21ReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const srspOpeningGate1TO21Report = await srspService.srspOpeningGate1TO21ReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(srspOpeningGate1TO21Report);
});

const srspOpeningGate22TO42ReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const srspOpeningGate22TO42Report = await srspService.srspOpeningGate22TO42ReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(srspOpeningGate22TO42Report);
});

const srspInflowOutflowPondLevelReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const srspInflowOutflowPondLevelReport = await srspService.srspInflowOutflowPondLevelReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(srspInflowOutflowPondLevelReport);
});

const srspParameterOverviewReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const srspParameterOverviewReport = await srspService.srspParameterOverviewReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(srspParameterOverviewReport);
});

const srspHrKakatitaDamGateReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const srspHrDamGateReport = await srspService.srspHrKakatitaDamGateReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(srspHrDamGateReport);
});

const srspHrSaraswatiDamGateReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const srspHrDamGateReport = await srspService.srspHrSaraswatiDamGateReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(srspHrDamGateReport);
});

const srspHrFloodFlowDamGateReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const srspHrDamGateReport = await srspService.srspHrFloodFlowDamGateReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(srspHrDamGateReport);
});

const srspHrLakshmiDamGateReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const srspHrDamGateReport = await srspService.srspHrLakshmiDamGateReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(srspHrDamGateReport);
});

const srspHrDamGateReportWp = catchAsync(async (req, res) => {
  let { startDate, endDate, intervalMinutes, exportToExcel} = req.query;

  if (!startDate && !endDate) {
    return res.status(400).json({ message: 'Please provide startDate or endDate' });
  }

  if (startDate === '' || endDate === '') {
    return res.status(400).json({ message: 'Please ensure you pick two dates' });
  }

  const srspHrDamGateReport = await srspService.srspHrDamGateReportWp(startDate, endDate, intervalMinutes, exportToExcel, req.user, res, req);

  res.json(srspHrDamGateReport);
});

module.exports = {
  handleMongoDBData,
  createSalientFeature,
  getSalientFeature,
  srspDamOverview,
  getLastDataSrspDamSpareAdvm,
  srspDischargeGate1TO21Report,
  srspDischargeGate22TO42Report,
  srspOpeningGate1TO21Report,
  srspOpeningGate22TO42Report,
  srspInflowOutflowPondLevelReport,
  srspParameterOverviewReport,
  srspHrDamGateReport,
  sevenDayReport,
  

  //without pagination
  srspDischargeGate1TO21ReportWp,
  srspDischargeGate22TO42ReportWp,
  srspOpeningGate1TO21ReportWp,
  srspOpeningGate22TO42ReportWp,
  srspInflowOutflowPondLevelReportWp,
  srspParameterOverviewReportWp,
  srspHrDamGateReportWp,
  srspHrSaraswatiDamGateReportWp,
  srspHrKakatitaDamGateReportWp,
  srspHrFloodFlowDamGateReportWp,
  srspHrLakshmiDamGateReportWp
};

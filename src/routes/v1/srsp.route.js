const express = require('express');
const srspController = require('../../controllers/srsp.controller');
const auth = require('../../middlewares/auth');
const {validate} = require('../../middlewares/validation.helper');

const router = express.Router() 

router.post('/create-salientfeature', auth(), srspController.createSalientFeature);
router.get('/get-salientfeature', auth(), srspController.getSalientFeature);

router.get('/srsp-overview', auth(), srspController.srspDamOverview);
router.get('/overview-advm', auth(), srspController.getLastDataSrspDamSpareAdvm);

router.get('/srsp-1to21-dis-gatereport',  [auth(), validate('srspReportShow'), srspController.srspDischargeGate1TO21Report]);
router.get('/srsp-22to42-dis-gatereport', [auth(), validate('srspReportShow'), srspController.srspDischargeGate22TO42Report]);
router.get('/srsp-1to21-opn-gatereport',  [auth(), validate('srspReportShow'), srspController.srspOpeningGate1TO21Report]);
router.get('/srsp-22to42-opn-gatereport', [auth(), validate('srspReportShow'), srspController.srspOpeningGate22TO42Report]);
router.get('/srsp-pondlevel-gatereport', [auth(), validate('srspReportShow'), srspController.srspInflowOutflowPondLevelReport]);
router.get('/srsp-parameter-overview-gatereport', [auth(), validate('srspReportShow'), srspController.srspParameterOverviewReport]);
router.get('/srsp-hr-dam-gatereport', [auth(), validate('srspReportShow'), srspController.srspHrDamGateReport]);

router.get('/srsp-sevenday-report', auth(), srspController.sevenDayReport);

//without pagination
router.get('/srsp-1to21-dis-gatereport-download', [ validate('srspReportDownload'), srspController.srspDischargeGate1TO21ReportWp]);
router.get('/srsp-22to42-dis-gatereport-download', [ validate('srspReportDownload'), srspController.srspDischargeGate22TO42ReportWp]);
router.get('/srsp-1to21-opn-gatereport-download',  [ validate('srspReportDownload'), srspController.srspOpeningGate1TO21ReportWp]);
router.get('/srsp-22to42-opn-gatereport-download',  [ validate('srspReportDownload'), srspController.srspOpeningGate22TO42ReportWp]);
router.get('/srsp-pondlevel-gatereport-download',  [ validate('srspReportDownload'), srspController.srspInflowOutflowPondLevelReportWp]);
router.get('/srsp-parameter-overview-gatereport-download',  [ validate('srspReportDownload'), srspController.srspParameterOverviewReportWp]);
router.get('/srsp-hr-Kakatita-dam-gatereport-download', [ validate('srspReportDownload'), srspController.srspHrKakatitaDamGateReportWp]);
router.get('/srsp-hr-saraswati-dam-gatereport-download', [ validate('srspReportDownload'), srspController.srspHrSaraswatiDamGateReportWp]);
router.get('/srsp-hr-lakshmi-dam-gatereport-download', [ validate('srspReportDownload'), srspController.srspHrLakshmiDamGateReportWp]);
router.get('/srsp-hr-Floodflow-dam-gatereport-download', [ validate('srspReportDownload'), srspController.srspHrFloodFlowDamGateReportWp]);

router.get('/srsp-hr-dam-gatereport-download', [ validate('srspReportDownload'), srspController.srspHrDamGateReportWp]);
module.exports = router;
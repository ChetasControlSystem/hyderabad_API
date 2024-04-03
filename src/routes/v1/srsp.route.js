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
router.get('/srsp-1to21-dis-gatereport-download', srspController.srspDischargeGate1TO21ReportWp);
router.get('/srsp-22to42-dis-gatereport-download', srspController.srspDischargeGate22TO42ReportWp);
router.get('/srsp-1to21-opn-gatereport-download',  srspController.srspOpeningGate1TO21ReportWp);
router.get('/srsp-22to42-opn-gatereport-download',  srspController.srspOpeningGate22TO42ReportWp);
router.get('/srsp-pondlevel-gatereport-download',  srspController.srspInflowOutflowPondLevelReportWp);
router.get('/srsp-parameter-overview-gatereport-download',  srspController.srspParameterOverviewReportWp);
router.get('/srsp-hr-dam-gatereport-download', srspController.srspHrDamGateReportWp);
router.get('/srsp-hr-KS-dam-gatereport-download', srspController.srspHrKakatitaAndSaraswatiDamGateReportWp);
router.get('/srsp-hr-FL-dam-gatereport-download', srspController.srspHrFloodFlowAndLakshmiDamGateReportWp);

module.exports = router;
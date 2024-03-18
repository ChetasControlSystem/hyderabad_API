const express = require('express');
const srspController = require('../../controllers/srsp.controller');
const auth = require('../../middlewares/auth');

const router = express.Router()

router.post('/create-salientfeature', auth(), srspController.createSalientFeature);
router.get('/get-salientfeature', auth(), srspController.getSalientFeature);

router.get('/srsp-overview', auth(), srspController.srspDamOverview);
router.get('/overview-advm', auth(), srspController.getLastDataSrspDamSpareAdvm);

router.get('/srsp-1to21-dis-gatereport', srspController.srspDischargeGate1TO21Report);
router.get('/srsp-22to42-dis-gatereport', srspController.srspDischargeGate22TO42Report);
router.get('/srsp-1to21-opn-gatereport',  srspController.srspOpeningGate1TO21Report);
router.get('/srsp-22to42-opn-gatereport',  srspController.srspOpeningGate22TO42Report);
router.get('/srsp-pondlevel-gatereport',  srspController.srspInflowOutflowPondLevelReport);
router.get('/srsp-parameter-overview-gatereport',  srspController.srspParameterOverviewReport);
router.get('/srsp-hr-dam-gatereport', srspController.srspHrDamGateReport);

router.get('/sevenDayReport', auth(), srspController.sevenDayReport);

//without pagination
router.get('/srsp-1to21-dis-gatereport-wp', srspController.srspDischargeGate1TO21ReportWp);
router.get('/srsp-22to42-dis-gatereport-wp', srspController.srspDischargeGate22TO42ReportWp);
router.get('/srsp-1to21-opn-gatereport-wp',  srspController.srspOpeningGate1TO21ReportWp);
router.get('/srsp-22to42-opn-gatereport-wp',  srspController.srspOpeningGate22TO42ReportWp);
router.get('/srsp-pondlevel-gatereport-wp',  srspController.srspInflowOutflowPondLevelReportWp);
router.get('/srsp-parameter-overview-gatereport-wp',  srspController.srspParameterOverviewReportWp);
router.get('/srsp-hr-dam-gatereport-wp', srspController.srspHrDamGateReportWp);

module.exports = router;
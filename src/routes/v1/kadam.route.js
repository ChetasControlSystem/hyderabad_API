const express = require('express');
const kadamController = require('../../controllers/kadam.controller');
const auth = require('../../middlewares/auth');
const {validate} = require('../../middlewares/validation.helper');

const router = express.Router()

router.post('/create-salientfeature', auth(), kadamController.createSalientFeature);
router.get('/get-salientfeature', auth(), kadamController.getSalientFeature);

router.get('/kadam-overview', auth(), kadamController.kadamDamOverview);
router.get('/overview-advm', auth(), kadamController.getLastDataKadamDamSpareAdvm);

router.get('/kadam-1to18-opn-gatereport',[validate('kadamReportShow'), kadamController.kadamOpeningGate1To18Report]);
router.get('/kadam-1to18-dis-gatereport',  [validate('kadamReportShow'),kadamController.kadamDishchargeGate1To18Report]);
router.get('/kadam-pondlevel-report', [validate('kadamReportShow'),kadamController.kadamInflowOutflowPondLevelReport]);
router.get('/kadam-parameter-overview-report',  [validate('kadamReportShow'),kadamController.kadamGateParameterOverviewReport]);
router.get('/kadam-hr-dam-gatereport',  [validate('kadamReportShow'),kadamController.kadamHrDamGateReport]);

router.get('/kadam-sevenday-report', auth(), kadamController.sevenDayReport);

//Download Report 
router.get('/kadam-1to18-opn-gatereport-download', kadamController.kadamOpeningGate1To18ReportWp);
router.get('/kadam-1to18-dis-gatereport-download',  kadamController.kadamDishchargeGate1To18ReportWp);
router.get('/kadam-pondlevel-report-download', kadamController.kadamInflowOutflowPondLevelReportWp);
router.get('/kadam-parameter-overview-report-download',  kadamController.kadamGateParameterOverviewReportWp);
router.get('/kadam-hr-dam-gatereport-download',  kadamController.kadamHrDamGateReportWp);


 
module.exports = router;
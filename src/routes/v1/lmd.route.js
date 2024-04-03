const express = require('express');
const lmdController = require('../../controllers/lmd.controller');
const auth = require('../../middlewares/auth');
const {validate} = require('../../middlewares/validation.helper');

const router = express.Router()

router.post('/create-salientfeature', auth(), lmdController.createSalientFeature);
router.get('/get-salientfeature', auth(), lmdController.getSalientFeature);

router.get('/lmd-overview', auth(), lmdController.lmdDamOverview);
router.get('/overview-advm', auth(), lmdController.getLastDataLmdDamSpareAdvm);

router.get('/lmd-1to20-dis-gatereport', [validate('lmdReportShow'), lmdController.lmdDischargeGateReport]);
router.get('/lmd-1to20-opn-gatereport',  [validate('lmdReportShow'), lmdController.lmdOpeningGateReport]);
router.get('/lmd-pondlevel-report', [validate('lmdReportShow'), lmdController.lmdPondlevelGateReport]);
router.get('/lmd-parameter-overview-report', [validate('lmdReportShow'), lmdController.lmdGateParameterOverviewReport]);
router.get('/lmd-hr-gate-report', [validate('lmdReportShow'), lmdController.lmdHrGateReport]);
 
router.get('/lmd-sevenday-report', auth(), lmdController.sevenDayReport);


//Download Report
router.get('/lmd-1to20-dis-gatereport-download', lmdController.lmdDischargeGateReportWp);
router.get('/lmd-1to20-opn-gatereport-download', lmdController.lmdOpeningGateReportWp);
router.get('/lmd-pondlevel-report-download',lmdController.lmdPondlevelGateReportWp);
router.get('/lmd-parameter-overview-report-download', lmdController.lmdGateParameterOverviewReportWp);
router.get('/lmd-hr-gate-report-download', lmdController.lmdHrGateReportWp);


module.exports = router;
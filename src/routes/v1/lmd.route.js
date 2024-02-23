const express = require('express');
const lmdController = require('../../controllers/lmd.controller');
const auth = require('../../middlewares/auth');

const router = express.Router()

router.post('/create-salientfeature', auth(), lmdController.createSalientFeature);
router.get('/get-salientfeature', auth(), lmdController.getSalientFeature);

router.get('/lmd-overview', auth(), lmdController.lmdDamOverview);
router.get('/overview-advm', auth(), lmdController.getLastDataLmdDamSpareAdvm);

router.get('/lmd-1to20-dis-gatereport', lmdController.lmdDischargeGateReport);
router.get('/lmd-1to20-opn-gatereport', auth(), lmdController.lmdOpeningGateReport);
router.get('/lmd-pondlevel-report', auth(), lmdController.lmdPondlevelGateReport);
router.get('/lmd-parameter-overview-report', auth(), lmdController.lmdGateParameterOverviewReport);
router.get('/lmd-hr-gate-report', auth(), lmdController.lmdHrGateReport);

router.get('/sevenDayReport', auth(), lmdController.sevenDayReport);




module.exports = router;
const express = require('express');
const srspController = require('../../controllers/srsp.controller');
const auth = require('../../middlewares/auth');

const router = express.Router()

router.post('/create-salientfeature', auth(), srspController.createSalientFeature);
router.get('/get-salientfeature', auth(), srspController.getSalientFeature);

router.get('/srsp-overview', auth(), srspController.srspDamOverview);
router.get('/overview-advm', auth(), srspController.getLastDataSrspDamSpareAdvm);

router.get('/srsp-1to21-dis-gatereport', auth(), srspController.srspDischargeGate1TO21Report);
router.get('/srsp-22to42-dis-gatereport', auth(), srspController.srspDischargeGate22TO42Report);
router.get('/srsp-1to21-opn-gatereport', auth(), srspController.srspDischargeGate1TO21Report);
router.get('/srsp-22to42-opn-gatereport', auth(), srspController.srspDischargeGate22TO42Report);
router.get('/srsp-pondlevel-gatereport', auth(), srspController.srspInflowOutflowPondLevelReport);
router.get('/srsp-parameter-overview-gatereport', auth(), srspController.srspParameterOverviewReport);
router.get('/srsp-hr-dam-gatereport', auth(), srspController.srspHrDamGateReport);

router.get('/sevenDayReport', auth(), srspController.sevenDayReport);



module.exports = router;
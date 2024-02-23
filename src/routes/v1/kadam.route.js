const express = require('express');
const kadamController = require('../../controllers/kadam.controller');
const auth = require('../../middlewares/auth');

const router = express.Router()

router.post('/create-salientfeature', auth(), kadamController.createSalientFeature);
router.get('/get-salientfeature', auth(), kadamController.getSalientFeature);

router.get('/kadam-overview', auth(), kadamController.kadamDamOverview);
router.get('/overview-advm', auth(), kadamController.getLastDataKadamDamSpareAdvm);

router.get('/kadam-1to18-opn-gatereport', auth(), kadamController.kadamOpeningGate1To18Report);
router.get('/kadam-1to18-dis-gatereport', auth(), kadamController.kadamDishchargeGate1To18Report);
router.get('/kadam-pondlevel-report', auth(), kadamController.kadamInflowOutflowPondLevelReport);
router.get('/kadam-parameter-overview-report', auth(), kadamController.kadamGateParameterOverviewReport);
router.get('/kadam-hr-dam-gatereport', auth(), kadamController.kadamHrDamGateReport);




router.get('/sevenDayReport', auth(), kadamController.sevenDayReport);

 

module.exports = router;
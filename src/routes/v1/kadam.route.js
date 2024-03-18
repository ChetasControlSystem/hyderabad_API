const express = require('express');
const kadamController = require('../../controllers/kadam.controller');
const auth = require('../../middlewares/auth');

const router = express.Router()

router.post('/create-salientfeature', auth(), kadamController.createSalientFeature);
router.get('/get-salientfeature', auth(), kadamController.getSalientFeature);

router.get('/kadam-overview', auth(), kadamController.kadamDamOverview);
router.get('/overview-advm', auth(), kadamController.getLastDataKadamDamSpareAdvm);

router.get('/kadam-1to18-opn-gatereport', kadamController.kadamOpeningGate1To18Report);
router.get('/kadam-1to18-dis-gatereport',  kadamController.kadamDishchargeGate1To18Report);
router.get('/kadam-pondlevel-report', kadamController.kadamInflowOutflowPondLevelReport);
router.get('/kadam-parameter-overview-report',  kadamController.kadamGateParameterOverviewReport);
router.get('/kadam-hr-dam-gatereport',  kadamController.kadamHrDamGateReport);


 

router.get('/sevenDayReport', auth(), kadamController.sevenDayReport);

 

module.exports = router;
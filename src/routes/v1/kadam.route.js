const express = require('express');
const kadamController = require('../../controllers/kadam.controller');
const auth = require('../../middlewares/auth');

const router = express.Router()

router.post('/create-salientfeature', auth(), kadamController.createSalientFeature);
router.get('/get-salientfeature', auth(), kadamController.getSalientFeature);

router.get('/kadam-overview', auth(), kadamController.kadamDamOverview);
router.get('/overview-advm', auth(), kadamController.getLastDataKadamDamSpareAdvm);

router.get('/sevenDayReport', auth(), kadamController.sevenDayReport);



module.exports = router;
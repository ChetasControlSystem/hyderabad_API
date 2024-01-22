const express = require('express');
const srspController = require('../../controllers/srsp.controller');
const auth = require('../../middlewares/auth');

const router = express.Router()

router.post('/create-salientfeature', auth(), srspController.createSalientFeature);
router.get('/get-salientfeature', auth(), srspController.getSalientFeature);

router.get('/srsp-overview', auth(), srspController.srspDamOverview);
router.get('/overview-advm', auth(), srspController.getLastDataSrspDamSpareAdvm);

router.get('/sevenDayReport', auth(), srspController.sevenDayReport);



module.exports = router;
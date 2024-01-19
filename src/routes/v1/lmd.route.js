const express = require('express');
const lmdController = require('../../controllers/lmd.controller');
const auth = require('../../middlewares/auth');

const router = express.Router()

router.post('/create-salientfeature', auth(), lmdController.createSalientFeature);
router.get('/get-salientfeature', auth(), lmdController.getSalientFeature);

router.get('/lmd-overview', auth(), lmdController.lmdDamOverview);
router.get('/overview-advm', auth(), lmdController.getLastDataLmdDamSpareAdvm);

router.get('/adv-report', auth(), lmdController.lmdHrRightAdvmReport);



module.exports = router;
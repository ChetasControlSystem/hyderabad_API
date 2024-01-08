const express = require('express');
const lmdController = require('../../controllers/lmd.controller');
const auth = require('../../middlewares/auth');

const router = express.Router()

router.post('/create-salientfeature', auth(), lmdController.createSalientFeature);



module.exports = router;
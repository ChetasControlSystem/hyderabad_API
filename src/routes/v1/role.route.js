const express = require('express');
const roleController = require('../../controllers/role.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/create-role', auth(), roleController.createRole);



module.exports = router;
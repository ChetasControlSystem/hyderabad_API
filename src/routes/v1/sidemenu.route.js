const express = require('express');
const sidemenuController = require('../../controllers/sidemenu.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/create-sidemenu', auth(), sidemenuController.createSidemenu);
router.get('/show-sidemenu', auth(), sidemenuController.showSidemenu);



module.exports = router;
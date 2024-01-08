const express = require('express');
const permissionController = require('../../controllers/permission');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/create-permission', auth(), permissionController.createPermission);
router.get('/get-permission', auth(), permissionController.getPermission);
router.put('/update-permission/:id',  permissionController.updatePermission);
router.delete('/delete-permission/:id',  permissionController.deletePermission);

router.post('/adduser-permission/:userId', auth(), permissionController.addUserPermission);
router.get('/getuser-permission/:userId', auth(), permissionController.getUserPermission);
router.delete('/deleteuser-permission/:userId',  permissionController.deleteUserPermission);


module.exports = router;
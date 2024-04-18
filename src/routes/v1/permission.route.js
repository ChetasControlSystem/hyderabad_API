const express = require('express');
const permissionController = require('../../controllers/permission');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/create-permission', auth(), permissionController.createPermission);
router.get('/get-permission', auth(), permissionController.getPermission);
router.get('/get-login-user-permission', auth(), permissionController.getLoginUserPermission);
router.put('/update-permission/:id', auth(), permissionController.updatePermission);
router.delete('/delete-permission/:id', auth(), permissionController.deletePermission);

router.post('/adduser-permission/:permissionId', auth(), permissionController.addUserPermission);
router.get('/getuser-permission/:userId', auth(), permissionController.getUserPermission);
router.delete('/deleteuser-permission/:permissionId',auth(),  permissionController.deleteUserPermission);


module.exports = router;
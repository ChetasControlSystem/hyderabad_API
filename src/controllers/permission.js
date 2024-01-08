const { permissionService } = require('../services')
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');


const createPermission = catchAsync(async (req, res) => {
  const permission = await permissionService.createPermission(req.body, req.user);
  res.status(httpStatus.CREATED).send(permission);
});

const getPermission = catchAsync(async (req, res) => {
  const result = await permissionService.getPermission(req.user);
  res.send(result);
});

const updatePermission = catchAsync(async (req, res) => {
  const updatePermission = await permissionService.updatePermission(req.params.id, req.body, req.user)
  res.send(updatePermission);
})

const deletePermission = catchAsync(async (req, res) => {
  const deletePermission = await permissionService.deletePermission(req.params.id, req.user)
  res.send("Record deleted successfully")
})

const addUserPermission = catchAsync(async (req ,res) =>{
  const addPermission = await permissionService.addUserPermission(req.params.userId, req.body.permissionId, req.user)
  res.send(addPermission)
}) 

const getUserPermission = catchAsync(async (req, res) =>{
  const getPermission = await permissionService.getUserPermission(req.params.userId, req.user)
  res.send(getPermission)
})

const deleteUserPermission = catchAsync(async (req, res)=>{
  const deletePermission = await permissionService.deleteUserPermission(req.params.userId, req.body.permissionId, req.user)
  res.send(deletePermission)
})

module.exports = {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
  addUserPermission,
  getUserPermission,
  deleteUserPermission
};
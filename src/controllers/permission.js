const { permissionService } = require('../services')
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');


const createPermission = catchAsync(async (req, res) => {
  const permission = await permissionService.createPermission(req.body, req.user);
  res.status(httpStatus.CREATED).json(permission);
});

const getPermission = catchAsync(async (req, res) => {
  console.log(req.user, "++++++++++++111111111111111");

  const result = await permissionService.getPermission(req.user);
  res.json(result);
});

const getLoginUserPermission = catchAsync(async (req, res) => {
  const result = await permissionService.getLoginUserPermission(req.user);
  res.json(result);
});

const updatePermission = catchAsync(async (req, res) => {
  const updatePermission = await permissionService.updatePermission(req.params.id, req.user,  req.body)
  res.json(updatePermission);
})

const deletePermission = catchAsync(async (req, res) => {
  const deletePermission = await permissionService.deletePermission(req.params.id, req.user)
  res.json("Record deleted successfully")
})

const addUserPermission = catchAsync(async (req ,res) =>{
  const addPermission = await permissionService.addUserPermission(req.params.permissionId, req.user, req.body)
  res.json(addPermission)
}) 

const getUserPermission = catchAsync(async (req, res) =>{
  const getPermission = await permissionService.getUserPermission(req.params.userId, req.user)
  res.json(getPermission)
})

const deleteUserPermission = catchAsync(async (req, res)=>{
  const deletePermission = await permissionService.deleteUserPermission(req.params.permissionId, req.user, req.body,)
  res.json(deletePermission)
})

module.exports = {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
  addUserPermission,
  getUserPermission,
  deleteUserPermission,
  getLoginUserPermission
};
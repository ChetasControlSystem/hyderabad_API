const { permissionService } = require('../services')
const pick = require('../utils/pick');
const httpStatus = require('http-status');

const catchAsync = require('../utils/catchAsync');


const createPermission = catchAsync(async (req, res) => {
  const permission = await permissionService.createPermission(req.body);
  res.status(httpStatus.CREATED).send(permission);
});

const getPermission = catchAsync(async (req, res) => {
  const result = await permissionService.getPermission(req.user);
  res.send(result);
});

const updatePermission = catchAsync(async (req, res) => {
  const updatePermission = await permissionService.updatePermission(req.params.id, req.body)
  res.send(updatePermission);
})

const deletePermission = catchAsync(async (req, res) => {
  const deletePermission = await permissionService.deletePermission(req.params.id)
  res.send("Record deleted successfully")
})

module.exports = {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission
};
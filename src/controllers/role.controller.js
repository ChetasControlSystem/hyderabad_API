const { roleService} = require('../services')
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');


const createRole = catchAsync(async (req, res) => {
  const role = await roleService.createRole(req.body);
  res.status(httpStatus.CREATED).json(role);
});

const getRole = catchAsync(async (req, res) => {
  const getRole = await roleService.getRole();
  res.json(getRole)
})



module.exports = {
    createRole,
    getRole
};
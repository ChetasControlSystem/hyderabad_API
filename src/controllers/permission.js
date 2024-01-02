const {permissionService} = require('../services')
const httpStatus = require('http-status');

const catchAsync = require('../utils/catchAsync');


const createPermission = catchAsync(async (req, res) => {
    const permission = await permissionService.createPermission(req.body);
    res.status(httpStatus.CREATED).send( permission);
  });



  module.exports = {
    createPermission
  };
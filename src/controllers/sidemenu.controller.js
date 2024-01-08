const { sidemenuService } = require('../services')
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');


const createSidemenu = catchAsync(async (req, res) => {
  const sidemenu = await sidemenuService.createSidemenu(req.body);
  res.status(httpStatus.CREATED).send(sidemenu);
});

const showSidemenu = catchAsync(async (req, res) =>{
  const showSidemenu = await sidemenuService.showSidemenu(req.user)
  res.send(showSidemenu)
})




module.exports = {
    createSidemenu,
    showSidemenu
  };
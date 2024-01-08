const httpStatus = require('http-status');
const LmdSalient = require('../models/Lmdsalientfeature')
const { LMDS } = require('../models');

const ApiError = require('../utils/ApiError');


const createSalientFeature = async (userBody) => {
    try {
      return LMDS.create({userBody});
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }



  module.exports = {
    createSalientFeature
  };
const httpStatus = require('http-status');
const { SRSPS } = require('../models');
const ApiError = require('../utils/ApiError');


const createSalientFeature = async (userBody) => {
    try {
      return SRSPS.create(userBody);
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  const getSalientFeature = async()=>{
    try {
        const showOneSalientFeature = await SRSPS.findOne();
        return showOneSalientFeature
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
        
    }
  }



  module.exports = {
    createSalientFeature,
    getSalientFeature
  };
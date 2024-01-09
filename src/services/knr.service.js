const httpStatus = require('http-status');
const { KNRS } = require('../models');
const ApiError = require('../utils/ApiError');


const createSalientFeature = async (userBody) => {
    try {
      return KNRS.create(userBody);
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  const getSalientFeature = async()=>{
    try {
        const showOneSalientFeature = await KNRS.findOne();
        return showOneSalientFeature
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
        
    }
  }



  module.exports = {
    createSalientFeature,
    getSalientFeature
  };
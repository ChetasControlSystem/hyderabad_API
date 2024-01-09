const httpStatus = require('http-status');
const { LMDS } = require('../models');

const ApiError = require('../utils/ApiError');


const createSalientFeature = async (userBody) => {
    try {
      return LMDS.create(userBody);
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
  }

  const getSalientFeature = async()=>{
    try {
        const showOneSalientFeature = await LMDS.findOne();
        console.log(showOneSalientFeature , "++++++++++++++++++++++++");
        return showOneSalientFeature
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
        
    }
  }



  module.exports = {
    createSalientFeature,
    getSalientFeature
  };
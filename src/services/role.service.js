const httpStatus = require('http-status');
const Role = require("../models/Role.model");
const ApiError = require('../utils/ApiError');



const createRole = async (userBody) => {
  try {
    return Role.create(userBody);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}

const getRole = async () => {
  try {
    return Role.find();
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}



module.exports = {
    createRole,
    getRole
  };
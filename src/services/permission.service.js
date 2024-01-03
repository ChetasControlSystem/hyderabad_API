const httpStatus = require('http-status');
const Permission = require("../models/permission.model")
const ApiError = require('../utils/ApiError');



const createPermission = async (userBody) => {
  return Permission.create(userBody);
}

const getPermission = async (user) => {
  const permission = await Permission.find().select("name");
  return permission;
};

const updatePermission = async (id, updateBody) => {

  const checkPermission = await Permission.findById(id);

  if (!checkPermission) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Please provide current Permission id, This id is ${id} wrong `);
    }
   
  const updatePermission = await Permission.findByIdAndUpdate(id, { $set: { name: updateBody.name } }, { new: true })
  return updatePermission
}

const deletePermission = async(id, deleteBody)=>{
  const checkPermission = await Permission.findById(id);

  if(!checkPermission){
    throw new ApiError(httpStatus.BAD_REQUEST, `Please provide current Permission id, This id is ${id} wrong `);
  }

  await checkPermission.remove();
  return checkPermission;
}


module.exports = {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission
};
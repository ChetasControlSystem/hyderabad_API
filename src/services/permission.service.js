const httpStatus = require('http-status');
const Permission = require("../models/permission.model");
const User = require("../models/user.model");
const ApiError = require('../utils/ApiError');



const createPermission = async (userBody, user) => {
  try {

    if(user.role === "admin"){
      return Permission.create(userBody);
    } else {
      return 'You are not authorized to access this data';
    }

  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }

}

const getPermission = async (user) => {
  try {

    if(user.role === "admin"){
      const permission = await Permission.find().select("name");
      return permission;
    } else {
      return 'You are not authorized to access this data';
    }

  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }

};

const getLoginUserPermission = async (user) =>{
  try {
      const permission = await Permission.find({roleName : {$in :user.role}}).select("name");
      return permission;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}

const updatePermission = async (id, updateBody, user) => {
  try {

    if(user.role === "admin"){
    const checkPermission = await Permission.findById(id);

    if (!checkPermission) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Please provide current Permission id, This id is ${id} wrong `);
    }

    const updatePermission = await Permission.findByIdAndUpdate(id, { $set: { name: updateBody.name } }, { new: true })
    return updatePermission
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }

}

const deletePermission = async (id, user) => {
  try {

    if(user.role === "admin"){
    const checkPermission = await Permission.findById(id);

    if (!checkPermission) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Please provide current Permission id, This id is ${id} wrong `);
    }

    await checkPermission.remove();
    return checkPermission;
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }

}

const addUserPermission = async (userId, permissionId, user) => {
  try {

    if(user.role === "admin"){
    const checkUser = await User.findById(userId);
    if (!checkUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Update the user's permissions (permission is an array)
    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { permission: permissionId } }, // Use $addToSet to avoid duplicate permissions
      { new: true }
    );

    if (!updateUser) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update user permissions');
    }

    return updateUser;
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getUserPermission = async (userId, user) => {
  try {

    if(user.role === "admin"){
    const checkUser = await User.findById(userId).populate("permission", "name -_id")
    if (!checkUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return checkUser
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}

const deleteUserPermission = async (userId, permissionIds, user) => {
  try {

    if(user.role === "admin"){
    const checkUser = await User.findById(userId);

    if (!checkUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    const permissionIdsArray = Array.isArray(permissionIds) ? permissionIds : [permissionIds];
    const hasPermission = permissionIdsArray.some(id => checkUser.permission.includes(id));

    if (!hasPermission) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Permission not found for this user');
    }

    const updateUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { permission: { $in: permissionIdsArray } } },
      { new: true }
    );

    return updateUser;
  } else {
    return 'You are not authorized to access this data';
  }
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};


module.exports = {
  createPermission,
  getPermission,
  updatePermission,
  deletePermission,
  addUserPermission,
  getUserPermission,
  deleteUserPermission,
  getLoginUserPermission
};
const httpStatus = require('http-status');
const Permission = require("../models/permission.model");
const User = require("../models/user.model");
const ApiError = require('../utils/ApiError');



const createPermission = async (userBody, user) => {
  try {

    const requestingUser = await User.findById(user);
    // if (!requestingUser || requestingUser.role !== 'admin') {
    //   throw new ApiError(httpStatus.FORBIDDEN, 'Access forbidden. User does not have admin role.');
    // }

    return Permission.create(userBody);
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }

}

const getPermission = async (user) => {
  try {

    const requestingUser = await User.findById(user);
    if (!requestingUser || requestingUser.role !== 'admin') {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access forbidden. User does not have admin role.');
    }

    const permission = await Permission.find().select("name");
    return permission;

  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }

};

const updatePermission = async (id, updateBody, user) => {
  try {

    const requestingUser = await User.findById(user);
    if (!requestingUser || requestingUser.role !== 'admin') {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access forbidden. User does not have admin role.');
    }

    const checkPermission = await Permission.findById(id);

    if (!checkPermission) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Please provide current Permission id, This id is ${id} wrong `);
    }

    const updatePermission = await Permission.findByIdAndUpdate(id, { $set: { name: updateBody.name } }, { new: true })
    return updatePermission

  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }

}

const deletePermission = async (id, user) => {
  try {

    const requestingUser = await User.findById(user);
    if (!requestingUser || requestingUser.role !== 'admin') {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access forbidden. User does not have admin role.');
    }

    const checkPermission = await Permission.findById(id);

    if (!checkPermission) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Please provide current Permission id, This id is ${id} wrong `);
    }

    await checkPermission.remove();
    return checkPermission;

  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }

}

const addUserPermission = async (userId, permissionId, user) => {
  try {

    const requestingUser = await User.findById(user);
    if (!requestingUser || requestingUser.role !== 'admin') {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access forbidden. User does not have admin role.');
    }

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
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

const getUserPermission = async (userId, user) => {
  try {

    const requestingUser = await User.findById(user);
    if (!requestingUser || requestingUser.role !== 'admin') {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access forbidden. User does not have admin role.');
    }

    const checkUser = await User.findById(userId).populate("permission", "name -_id")
    if (!checkUser) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }

    return checkUser

  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}

const deleteUserPermission = async (userId, permissionIds, user) => {
  try {

    const requestingUser = await User.findById(user);
    if (!requestingUser || requestingUser.role !== 'admin') {
      throw new ApiError(httpStatus.FORBIDDEN, 'Access forbidden. User does not have admin role.');
    }

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
  deleteUserPermission
};
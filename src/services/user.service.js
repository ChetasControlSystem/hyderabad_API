const httpStatus = require('http-status');
const { User, Permission } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody, user) => {

  const checkPermission = await Permission.find({ _id: { $in: user.permission } }).select("name");

  // Check if 'userPermission' is present in the checkPermission array
  const hasUserPermission = checkPermission.some(permission => permission.name === "userPermission");

  // Check either the user has 'userPermission' or is an admin
  if (hasUserPermission || user.role === "admin") {
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return User.create(userBody);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are a not access creating user');
  }
};


/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options, user) => {
  const checkPermission = await Permission.find({ _id: { $in: user.permission } }).select("name");

  // Check if 'userPermission' is present in the checkPermission array
  const hasUserPermission = checkPermission.some(permission => permission.name === "userPermission");

  // Check either the user has 'userPermission' or is an admin
  if (hasUserPermission || user.role === "admin") {

    const users = await User.paginate(filter, options);
    return users;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are a not access get user');
  }
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id, user) => {
  const checkPermission = await Permission.find({ _id: { $in: user.permission } }).select("name");
  const hasUserPermission = checkPermission.some(permission => permission.name === "userPermission");

  if (hasUserPermission || user.role === "admin") {
    return User.findById(id);

  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are a not access get user');
  }
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
    return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody, user) => {

  const checkPermission = await Permission.find({ _id: { $in: user.permission } }).select("name");
  const hasUserPermission = checkPermission.some(permission => permission.name === "userPermission");

  if (hasUserPermission || user.role === "admin") {

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are a not access get user');
  }
};


/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId, user) => {

  const checkPermission = await Permission.find({ _id: { $in: user.permission } }).select("name");
  const hasUserPermission = checkPermission.some(permission => permission.name === "userPermission");

  if (hasUserPermission || user.role === "admin") {

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.remove();
    return user;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are a not access get user');
  }
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};

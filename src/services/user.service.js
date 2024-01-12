const httpStatus = require('http-status');
const { User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody, user) => {

  // const checkPermission = await Permission.find({ _id: { $in: user.permission } }).select("name");

  // // Check if 'userPermission' is present in the checkPermission array
  // const hasUserPermission = checkPermission.some(permission => permission.name == CheckPer.USER);

  // // Check either the user has 'userPermission' or is an admin
  // if (hasUserPermission || user.role === "admin") {
    if(user.role === "admin"){
    if (await User.isEmailTaken(userBody.email)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    return User.create(userBody);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to access this data');
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

  if (user.role === "admin") {
    const users = await User.paginate(filter, options);
    return users;

  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to access this data');
  }
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id, user) => {

  if ( user.role === "admin") {
    return User.findById(id);

  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to access this data');
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

  if ( user.role === "admin") {

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
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to access this data');
  }
};


/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId, user) => {

  if (user.role === "admin") {

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    await user.remove();
    return user;
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You are not authorized to access this data');
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

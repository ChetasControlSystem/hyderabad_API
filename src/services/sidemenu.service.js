const httpStatus = require('http-status');
const Sidemenu = require("../models/sidemenu.model");
const ApiError = require('../utils/ApiError');

const createSidemenu = async (sidemenuBody) =>{
  try {
    
      if (sidemenuBody.children && !Array.isArray(sidemenuBody.children)) {
          throw new Error('Invalid format for the "children" field. It should be an array.');
      }

      return Sidemenu.create(sidemenuBody);
  } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};


const showSidemenu = async (user) => {
  try {
    let sidemenu;

    if (user.role === "admin") {
      sidemenu = await Sidemenu.find();
    } else {
      sidemenu = await Sidemenu.find({
        permission: { $in: user.permission }
      });
    }

    const filteredSidemenu = sidemenu.map(menuItem => {
      const filteredChildren = menuItem.children.filter(child => {
        return user.permission.includes(child.permission.toString());
      });

      return {
        ...menuItem.toObject(),
        children: filteredChildren
      };
    });

    const uniqueIds = [...new Set(filteredSidemenu.map(item => item._id))];

    const matchRecords = await Sidemenu.find({ sidemenu: { $in: uniqueIds } });

    matchRecords.forEach(matchRecord => {
      const matchingMenuItem = filteredSidemenu.find(item => item._id.equals(matchRecord.sidemenu));

      if (matchingMenuItem) {
        matchingMenuItem.children.push(matchRecord);
      }
    });

    // Filter out items with 'sidemenu' key for admin users
    const finalSidemenu = user.role === "admin"
      ? filteredSidemenu.filter(item => !item.sidemenu)
      : filteredSidemenu;

    return finalSidemenu;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};


  module.exports = {
    createSidemenu,
    showSidemenu
  };
  
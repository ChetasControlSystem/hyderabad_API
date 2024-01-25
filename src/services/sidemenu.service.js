const httpStatus = require('http-status');
const Sidemenu = require("../models/sidemenu.model");
const ApiError = require('../utils/ApiError');
const  Permission  = require('../models/permission.model');

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
    }else if(user.role === "lmdSuperuser"){
      sidemenu = await Sidemenu.findOne({title : "LMD DAM"});

      const checkPermission = await Permission.find({ roleName: { $in: user.role } }).select('name').exec();

      const permissionNames = checkPermission.map(permission => permission.name);

      sidemenu = await Sidemenu.aggregate([
        {
          $match: {
            'children.permissionName': { $in: permissionNames }
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            type: 1,
            icon: 1,
            children: {
              $filter: {
                input: '$children',
                as: 'child',
                cond: { $in: ['$$child.permissionName', permissionNames] }
              }
            }
          }
        }
      ]);

    }else if(user.role === "srspSuperuser"){
      sidemenu = await Sidemenu.findOne({title : "SRSP DAM"});

      const checkPermission = await Permission.find({ roleName: { $in: user.role } }).select('name').exec();

      const permissionNames = checkPermission.map(permission => permission.name);

      sidemenu = await Sidemenu.aggregate([
        {
          $match: {
            'children.permissionName': { $in: permissionNames }
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            type: 1,
            icon: 1,
            children: {
              $filter: {
                input: '$children',
                as: 'child',
                cond: { $in: ['$$child.permissionName', permissionNames] }
              }
            }
          }
        }
      ]);

    }else if(user.role === "kadamSuperuser"){
      sidemenu = await Sidemenu.findOne({title : "KADAM DAM"});

      const checkPermission = await Permission.find({ roleName: { $in: user.role } }).select('name').exec();

      const permissionNames = checkPermission.map(permission => permission.name);

      sidemenu = await Sidemenu.aggregate([
        {
          $match: {
            'children.permissionName': { $in: permissionNames }
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            type: 1,
            icon: 1,
            children: {
              $filter: {
                input: '$children',
                as: 'child',
                cond: { $in: ['$$child.permissionName', permissionNames] }
              }
            }
          }
        }
      ]);

    }else {
      const checkPermission = await Permission.find({ roleName: { $in: user.role } }).select('name').exec();

      const permissionNames = checkPermission.map(permission => permission.name);

      sidemenu = await Sidemenu.aggregate([
        {
          $match: {
            'children.permissionName': { $in: permissionNames }
          }
        },
        {
          $project: {
            _id: 1,
            title: 1,
            type: 1,
            icon: 1,
            children: {
              $filter: {
                input: '$children',
                as: 'child',
                cond: { $in: ['$$child.permissionName', permissionNames] }
              }
            }
          }
        }
      ]);
    }
    return sidemenu;
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

  module.exports = {
    createSidemenu,
    showSidemenu
  };
  
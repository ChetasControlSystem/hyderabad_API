const mongoose = require('mongoose');

const permissionSchema = mongoose.Schema(
  {
    lmd: {
      type: Number, // Fixed typo here
      default: 0   // 0 for not, 1 for yes
    },
    srsp: {
      type: Number,
      default: 0   // 0 for not, 1 for yes
    },
    kadam: {
      type: Number,
      default: 0   // 0 for not, 1 for yes
    },
    lmdReport: {
      type: Number,
      default: 0   // 0 for not, 1 for yes
    },
    srspReport: {
      type: Number,
      default: 0   // 0 for not, 1 for yes
    },
    kadamReport: {
      type: Number,
      default: 0   // 0 for not, 1 for yes
    },
    userPermission: {
      type: Number,
      default: 0   // 0 for not, 1 for yes
    }
  },
  {
    timestamps: true, versionKey: false,
  }
);

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;

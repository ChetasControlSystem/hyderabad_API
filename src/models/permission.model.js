const mongoose = require('mongoose');

const permissionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, versionKey: false,
  }
);

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;

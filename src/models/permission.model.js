const mongoose = require('mongoose');

const permissionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    roleName:[{
      type : String,
      enum: ["user", "admin", "lmdSuperuser", "lmdUser", "srspSuperuser", "srspUser", "kadamSuperuser", "kadamUser"],
    }],
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true, versionKey: false,
  }
);

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;

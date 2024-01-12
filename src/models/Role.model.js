const mongoose = require('mongoose');

const roleSchema = mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["user", "admin", "lmdSuperuser", "lmdUser", "srspSuperuser", "srspUser", "kadamSuperuser", "kadamUser"],
      default: 'user',
    },
  },
  {
    timestamps: true, versionKey: false,
  }
);

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;

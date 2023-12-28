const mongoose = require('mongoose');

const SDOverflow = mongoose.Schema(
  {
    DateTime: Date,
    D1: Number,
    D2: Number,
    D3: Number,
    D4: Number,
    D5: Number,
    D6: Number,
    D7: Number,
    D8: Number,
    D9: Number,
    D10: Number,
    D11: Number,
    D12: Number,
    D13: Number,
    D14: Number,
    D15: Number,
    D16: Number,
    D17: Number,
    D18: Number,
    D19: Number,
    D20: Number,
    D21: Number,
    D22: Number,
    D23: Number,
    D24: Number,
    D25: Number,
    D26: Number,
    D27: Number,
    D28: Number,
    D29: Number,
    D30: Number,
    D31: Number,
    D32: Number,
    D33: Number,
    D34: Number,
    D35: Number,
    D36: Number,
    D37: Number,
    D38: Number,
    D39: Number,
    D40: Number,
    D41: Number,
    D42: Number,
  },
  {
    timestamps: true, versionKey: false
  }
);


const SDO = mongoose.model('SDOverflow', SDOverflow);

module.exports = SDO;

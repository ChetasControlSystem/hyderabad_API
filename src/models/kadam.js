const mongoose = require('mongoose');

const kadamDem = mongoose.Schema(
    {
        gagillapurInflowLevel:{
            type: Number,
            require : true
        },
        potourInflowLevel:{
            type: Number,
            require : true
        },
        chintakuntaInflowLevel:{
            type: Number,
            require : true
        },
        gagillapurInflowDischarge:{
            type: Number,
            require : true
        },
        potourInflowDischarge:{
            type: Number,
            require : true
        },
        chintakuntaInflowDischarge:{
            type: Number,
            require : true
        },
        alugunuruBridgeOutflowLevel:{
            type: Number,
            require : true
        },
        alugunuruBridgeOutflowDischarge:{
            type: Number,
            require : true
        },
        hrDownstreamLevel:{
            type: Number,
            require : true
        },
        hrDownstreamDischarge:{
            type: Number,
            require : true
        },
        D11: Number,
        D12: Number,
        D13: Number,
        D14: Number,
        D15: Number,
        D16: Number,
        liveCapacity:{
    
            type: Number,
            require : true
        },
        grossStorage:{
            type: Number,
            require : true
        },
        cathmentArea:{
            type: Number,
            require : true
        },
        contourArea:{
            type: Number,
            require : true
        },
        ayucutArea:{
            type: Number,
            require : true
        },
        fillingPercetage:{
            type: Number,
            require : true
        },
        fullReserveWater:{
            type: Number,
            require : true
        },
        instGateDischarge:{
            type: Number,
            require : true
        }, 
        instCannalDischarge:{
            type: Number,
            require : true
        },
        totalDamDischarge:{
            type: Number,
            require : true
        },
        cumulativeDamDischarge:{
            type: Number,
            require : true
        },
        pondLevel:{
            type: Number,
            require : true
        },
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


const kadam  = mongoose.model('kadam', kadamDem);

module.exports = kadam;
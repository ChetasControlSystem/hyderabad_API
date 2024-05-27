const mongoose = require('mongoose');

const  srspSsdDamOverviewDicharge = mongoose.Schema(
  {
    gate1Discharge:{
        type : Number,
        require : true
    },
   gate2Discharge:{
        type : Number,
        require : true
    },
   gate3Discharge:{
        type : Number,
        require : true
    },
   gate4Discharge:{
        type : Number,
        require : true
    },
   gate5Discharge:{
        type : Number,
        require : true
    },
   gate6Discharge:{
        type : Number,
        require : true
    },
   gate7Discharge:{
        type : Number,
        require : true
    },
   gate8Discharge:{
        type : Number,
        require : true
    },
   gate9Discharge:{
        type : Number,
        require : true
    },
   gate10Discharge:{
        type : Number,
        require : true
    },
   gate11Discharge:{
        type : Number,
        require : true
    },
   gate12Discharge:{
        type : Number,
        require : true
    },
   gate13Discharge:{
        type : Number,
        require : true
    },
   gate14Discharge:{
        type : Number,
        require : true
    },
   gate15Discharge:{
        type : Number,
        require : true
    },
   gate16Discharge:{
        type : Number,
        require : true
    },
   gate17Discharge:{
        type : Number,
        require : true
    },
   gate18Discharge:{
        type : Number,
        require : true
    },
   gate19Discharge:{
        type : Number,
        require : true
    },
   gate20Discharge:{
        type : Number,
        require : true
    },
   gate21Discharge:{
        type : Number,
        require : true
    },
   gate22Discharge:{
        type : Number,
        require : true
    },
   gate23Discharge:{
        type : Number,
        require : true
    },
   gate24Discharge:{
        type : Number,
        require : true
    },
   gate25Discharge:{
        type : Number,
        require : true
    },
   gate26Discharge:{
        type : Number,
        require : true
    },
   gate27Discharge:{
        type : Number,
        require : true
    },
   gate28Discharge:{
        type : Number,
        require : true
    },
   gate29Discharge:{
        type : Number,
        require : true
    },
   gate30Discharge:{
        type : Number,
        require : true
    },
    
   gate31Discharge:{
        type : Number,
        require : true
    },
   gate32Discharge:{
        type : Number,
        require : true
    },
   gate33Discharge:{
        type : Number,
        require : true
    },
   gate34Discharge:{
        type : Number,
        require : true
    },
   gate35Discharge:{
        type : Number,
        require : true
    },
   gate36Discharge:{
        type : Number,
        require : true
    },
   gate37Discharge:{
        type : Number,
        require : true
    },
   gate38Discharge:{
        type : Number,
        require : true
    },
   gate39Discharge:{
        type : Number,
        require : true
    },
   gate40Discharge:{
        type : Number,
        require : true
    },
   gate41Discharge:{
        type : Number,
        require : true
    },
   gate42Discharge:{
        type : Number,
        require : true
    },
    dateTime:{
        type: Date,
        require : true,
        index : true
    } ,
  },
  {
    timestamps: true, versionKey: false
  }
);

 srspSsdDamOverviewDicharge.index({dateTime : 1})
const SDO = mongoose.model('srsp_Ssd_Dam_Overview_Discharge',  srspSsdDamOverviewDicharge);

module.exports = SDO;

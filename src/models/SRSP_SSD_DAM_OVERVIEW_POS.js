const mongoose = require('mongoose');

const SanjaySsdDamOverviewPos = mongoose.Schema(
  {
    gate1Position:{
        type : Number,
        
    },
   gate2Position:{
        type : Number,
        
    },
   gate3Position:{
        type : Number,
        
    },
   gate4Position:{
        type : Number,
        
    },
   gate5Position:{
        type : Number,
        
    },
   gate6Position:{
        type : Number,
        
    },
   gate7Position:{
        type : Number,
        
    },
   gate8Position:{
        type : Number,
        
    },
   gate9Position:{
        type : Number,
        
    },
   gate10Position:{
        type : Number,
        
    },
   gate11Position:{
        type : Number,
        
    },
   gate12Position:{
        type : Number,
        
    },
   gate13Position:{
        type : Number,
        
    },
   gate14Position:{
        type : Number,
        
    },
   gate15Position:{
        type : Number,
        
    },
   gate16Position:{
        type : Number,
        
    },
   gate17Position:{
        type : Number,
        
    },
   gate18Position:{
        type : Number,
        
    },
   gate19Position:{
        type : Number,
        
    },
   gate20Position:{
        type : Number,
        
    },
   gate21Position:{
        type : Number,
        
    },
   gate22Position:{
        type : Number,
        
    },
   gate23Position:{
        type : Number,
        
    },
   gate24Position:{
        type : Number,
        
    },
   gate25Position:{
        type : Number,
        
    },
   gate26Position:{
        type : Number,
        
    },
   gate27Position:{
        type : Number,
        
    },
   gate28Position:{
        type : Number,
        
    },
   gate29Position:{
        type : Number,
        
    },
   gate30Position:{
        type : Number,
        
    },
    
   gate31Position:{
        type : Number,
        
    },
   gate32Position:{
        type : Number,
        
    },
   gate33Position:{
        type : Number,
        
    },
   gate34Position:{
        type : Number,
        
    },
   gate35Position:{
        type : Number,
        
    },
   gate36Position:{
        type : Number,
        
    },
   gate37Position:{
        type : Number,
        
    },
   gate38Position:{
        type : Number,
        
    },
   gate39Position:{
        type : Number,
        
    },
   gate40Position:{
        type : Number,
        
    },
   gate41Position:{
        type : Number,
        
    },
   gate42Position:{
        type : Number,
        
    },
    dateTime:{
        type: Date,
        
    },
  },
  {
    timestamps: true, versionKey: false
  }
);


module.exports = mongoose.model('Sanjay_Ssd_Dam_Overview_Position', SanjaySsdDamOverviewPos);




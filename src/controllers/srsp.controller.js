const { srspService } = require('../services');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const moment = require('moment');

const SPLO = require('../models/SRSP_POND_LEVEL_OVERVIEW')
const SSDOP = require("../models/SRSP_SSD_DAM_OVERVIEW_POS")
const SHDOP = require("../models/SRSP_HR_DAM_OVERVIEW_POS")
const SDOD = require("../models/SRSP_SSD_DAM_OVERVIEW_DICH")
const SHKA = require("../models/SRSP_HR_KAKATIYA_ADVM")
const SHDOD = require("../models/SRSP_HR_DAM_OVERVIEW_DICH")

async function handleMongoDBData(data) {
  try {

    const srspPondLevel = data.srspPondLevel;
    const srspSsdDamOverviewPosition = data.srspSsdDamOverviewPosition;
    const srspHrDamOverviewPosition = data.srspHrDamOverviewPosition;
    const srspSsdDamOverviewDischarge = data.srspSsdDamOverviewDischarge;
    const srspHrSsdAdvm = data.srspHrSsdAdvm;
    const srspHrDamOverviewDischarge = data.srspHrDamOverviewDischarge;

    const mappedData = srspPondLevel.map(row => {

      const dateTime = moment(row.DateTime);
      return {
        date: dateTime.format('YYYY-MM-DD'),
        time: dateTime.format('HH:mm:ss'),
        year: dateTime.year(),
        month: dateTime.month() + 1,
        week: dateTime.week(),
        quarter: dateTime.quarter(),
        dateTime: dateTime.format(),
        inflow1Level: row.D1,
        inflow2Level: row.D2,
        D3: row.D3,
        inflow1Discharge: row.D4,
        inflow2Discharge: row.D5,
        D6: row.D6,
        damDownstreamLevel: row.D7,
        damDownstreamDischarge: row.D8,
        hrkDownstreamLevel: row.D9,
        hrkDownstreamDischarge: row.D10,
        hrsDownstreamLevel: row.D11,
        hrsDownstreamDischarge: row.D12,
        hrfDownstreamLevel: row.D13,
        hrfDownstreamDischarge: row.D14,
        hrlDownstreamLevel: row.D15,
        hrlDownstreamDischarge: row.D16,
        liveCapacIty: row.D17,
        grossStorage: row.D18,
        catchmentArea: row.D19,
        contourArea: row.D20,
        ayacutArea: row.D21,
        filling: row.D22,
        fullReservoirLevel: row.D23,
        instantaneousGateDischarge: row.D24,
        instantaneousCanalDischarge: row.D25,
        totalDamDischarge: row.D26,
        cumulativeDamDischarge: row.D27,
        pondLevel: row.D28,
        D29: row.D29,
        D30: row.D30,
        D31: row.D31,
        D32: row.D32,
        D33: row.D33,
        D34: row.D34,
        D35: row.D35,
        D36: row.D36,
        D37: row.D37,
        D38: row.D38,
        D39: row.D39,
        D40: row.D40,
        D41: row.D41,
        D42: row.D42,
      }
    });

    const mappedData1 = srspSsdDamOverviewPosition.map(row => {
      const dateTime = moment(row.DateTime);
      return {
        date: dateTime.format('YYYY-MM-DD'),
        time: dateTime.format('HH:mm:ss'),
        year: dateTime.year(),
        month: dateTime.month() + 1,
        week: dateTime.week(),
        quarter: dateTime.quarter(),
        dateTime: dateTime.format(),
        gate1Position: row.D1,
        gate2Position: row.D2,
        gate3Position: row.D3,
        gate4Position: row.D4,
        gate5Position: row.D5,
        gate6Position: row.D6,
        gate7Position: row.D7,
        gate8Position: row.D8,
        gate9Position: row.D9,
        gate10Position: row.D10,
        gate11Position: row.D11,
        gate12Position: row.D12,
        gate13Position: row.D13,
        gate14Position: row.D14,
        gate15Position: row.D15,
        gate16Position: row.D16,
        gate17Position: row.D17,
        gate18Position: row.D18,
        gate19Position: row.D19,
        gate20Position: row.D20,
        gate21Position: row.D21,
        gate22Position: row.D22,
        gate23Position: row.D23,
        gate24Position: row.D24,
        gate25Position: row.D25,
        gate26Position: row.D26,
        gate27Position: row.D27,
        gate28Position: row.D28,
        gate29Position: row.D29,
        gate30Position: row.D30,
        gate31Position: row.D31,
        gate32Position: row.D32,
        gate33Position: row.D33,
        gate34Position: row.D34,
        gate35Position: row.D35,
        gate36Position: row.D36,
        gate37Position: row.D37,
        gate38Position: row.D38,
        gate39Position: row.D39,
        gate40Position: row.D40,
        gate41Position: row.D41,
        gate42Position: row.D42,

      }
    })

    const mappedData2 = srspHrDamOverviewPosition.map(row => {
      const dateTime = moment(row.DateTime);
      return {
        date: dateTime.format('YYYY-MM-DD'),
        time: dateTime.format('HH:mm:ss'),
        year: dateTime.year(),
        month: dateTime.month() + 1,
        week: dateTime.week(),
        quarter: dateTime.quarter(),
        dateTime: dateTime.format(),
        hrkGate1Position: row.D1,
        hrkGate2Position: row.D2,
        hrkGate3Position: row.D3,
        hrkGate4Position: row.D4,
        hrsGate1Position: row.D5,
        hrsGate2Position: row.D6,
        hrfGate1Position: row.D7,
        hrfGate2Position: row.D8,
        hrfGate3Position: row.D9,
        hrfGate4Position: row.D10,
        hrfGate5Position: row.D11,
        hrfGate6Position: row.D12,
        hrlManGate1Position: row.D13,
        hrlManGate2Position: row.D14,
        D15: row.D15,
        D16: row.D16,
        D17: row.D17,
        D18: row.D18,
        D19: row.D19,
        D20: row.D20,
        D21: row.D21,
        D22: row.D22,
        D23: row.D23,
        D24: row.D24,
        D25: row.D25,
        D26: row.D26,
        D27: row.D27,
        D28: row.D28,
        D29: row.D29,
        D30: row.D30,
        D31: row.D31,
        D32: row.D32,
        D33: row.D33,
        D34: row.D34,
        D35: row.D35,
        D36: row.D36,
        D37: row.D37,
        D38: row.D38,
        D39: row.D39,
        D40: row.D40,
        D41: row.D41,
        D42: row.D42,
      }
    })

    const mappedData3 = srspSsdDamOverviewDischarge.map(row => {
      const dateTime = moment(row.DateTime);
      return {
        date: dateTime.format('YYYY-MM-DD'),
        time: dateTime.format('HH:mm:ss'),
        year: dateTime.year(),
        month: dateTime.month() + 1,
        week: dateTime.week(),
        quarter: dateTime.quarter(),
        dateTime: dateTime.format(),
        gate1Discharge: row.D1,
        gate2Discharge: row.D2,
        gate3Discharge: row.D3,
        gate4Discharge: row.D4,
        gate5Discharge: row.D5,
        gate6Discharge: row.D6,
        gate7Discharge: row.D7,
        gate8Discharge: row.D8,
        gate9Discharge: row.D9,
        gate10Discharge: row.D10,
        gate11Discharge: row.D11,
        gate12Discharge: row.D12,
        gate13Discharge: row.D13,
        gate14Discharge: row.D14,
        gate15Discharge: row.D15,
        gate16Discharge: row.D16,
        gate17Discharge: row.D17,
        gate18Discharge: row.D18,
        gate19Discharge: row.D19,
        gate20Discharge: row.D20,
        gate21Discharge: row.D21,
        gate22Discharge: row.D22,
        gate23Discharge: row.D23,
        gate24Discharge: row.D24,
        gate25Discharge: row.D25,
        gate26Discharge: row.D26,
        gate27Discharge: row.D27,
        gate28Discharge: row.D28,
        gate29Discharge: row.D29,
        gate30Discharge: row.D30,
        gate31Discharge: row.D31,
        gate32Discharge: row.D32,
        gate33Discharge: row.D33,
        gate34Discharge: row.D34,
        gate35Discharge: row.D35,
        gate36Discharge: row.D36,
        gate37Discharge: row.D37,
        gate38Discharge: row.D38,
        gate39Discharge: row.D39,
        gate40Discharge: row.D40,
        gate41Discharge: row.D41,
        gate42Discharge: row.D42,
      }
    })

    const mappedData4 = srspHrSsdAdvm.map(row => {
      const dateTime = moment(row.DateTime);
      return {
        date: dateTime.format('YYYY-MM-DD'),
        time: dateTime.format('HH:mm:ss'),
        year: dateTime.year(),
        month: dateTime.month() + 1,
        week: dateTime.week(),
        quarter: dateTime.quarter(),
        dateTime: dateTime.format(),
        hrkFlowRate: row.D1,
        hrkCDQ: row.D2,
        hrkLDQ: row.D3,
        hrkMQ: row.D4,
        hrkVelocity: row.D5,
        hrkAdvmSpare1: row.D6,
        hrkAdvmSpare2: row.D7,
        hrkAdvmSpare3: row.D8,
        hrkAdvmSpare4: row.D9,
        hrkAdvmSpare5: row.D10,
        hrkAdvmSpare6: row.D11,
        hrfGate6Position: row.D12,
        hrlManGate1Position: row.D13,
        hrlManGate2Position: row.D14,
        D15: row.D15,
        D16: row.D16,
        D17: row.D17,
        D18: row.D18,
        D19: row.D19,
        D20: row.D20,
        D21: row.D21,
        D22: row.D22,
        D23: row.D23,
        D24: row.D24,
        D25: row.D25,
        D26: row.D26,
        D27: row.D27,
        D28: row.D28,
        D29: row.D29,
        D30: row.D30,
        D31: row.D31,
        D32: row.D32,
        D33: row.D33,
        D34: row.D34,
        D35: row.D35,
        D36: row.D36,
        D37: row.D37,
        D38: row.D38,
        D39: row.D39,
        D40: row.D40,
        D41: row.D41,
        D42: row.D42,
      }
    })

    const mappedData5 = srspHrDamOverviewDischarge.map(row => {
      const dateTime = moment(row.DateTime);
      return {
        date: dateTime.format('YYYY-MM-DD'),
        time: dateTime.format('HH:mm:ss'),
        year: dateTime.year(),
        month: dateTime.month() + 1,
        week: dateTime.week(),
        quarter: dateTime.quarter(),
        dateTime: dateTime.format(),
        hrkGate1Discharge: row.D1,
        hrkGate2Discharge: row.D2,
        hrkGate3Discharge: row.D3,
        hrkGate4Discharge: row.D4,
        hrsGate1Discharge: row.D5,
        hrsGate2Discharge: row.D6,
        hrfGate1Discharge: row.D7,
        hrfGate2Discharge: row.D8,
        hrfGate3Discharge: row.D9,
        hrfGate4Discharge: row.D10,
        hrfGate5Discharge: row.D11,
        hrfGate6Discharge: row.D12,
        hrlManGate1Discharge: row.D13,
        hrlManGate2Discharge: row.D14,
        D15: row.D15,
        D16: row.D16,
        D17: row.D17,
        D18: row.D18,
        D19: row.D19,
        D20: row.D20,
        D21: row.D21,
        D22: row.D22,
        D23: row.D23,
        D24: row.D24,
        D25: row.D25,
        D26: row.D26,
        D27: row.D27,
        D28: row.D28,
        D29: row.D29,
        D30: row.D30,
        D31: row.D31,
        D32: row.D32,
        D33: row.D33,
        D34: row.D34,
        D35: row.D35,
        D36: row.D36,
        D37: row.D37,
        D38: row.D38,
        D39: row.D39,
        D40: row.D40,
        D41: row.D41,
        D42: row.D42,
      }
    })

    const pondLevelLastData = await SPLO.find().sort({ dateTime: -1 }).limit(1);
    const ssdDamOverviewLastData = await SSDOP.find().sort({ dateTime: -1 }).limit(1);
    const hrDamOverviewLastData = await SHDOP.find().sort({ dateTime: -1 }).limit(1);
    const ssdDamOverviewDischargeLastData = await SDOD.find().sort({ dateTime: -1 }).limit(1);
    const hrKakatiyaAdvm = await SHKA.find().sort({ dateTime: -1 }).limit(1);
    const hrDamOverviewDischarge = await SHDOD.find().sort({ dateTime: -1 }).limit(1);

    if (pondLevelLastData.length) {
      const LastDate = new Date(pondLevelLastData[0].dateTime);
      const newArray = srspPondLevel
        .map(datetimeString => {
          const datetime = new Date(datetimeString.DateTime);
          if (datetime > LastDate) {
            return datetimeString;
          }
          return null;
        }).filter(item => item !== null);

      await SPLO.insertMany(newArray);
    } else {
      await SPLO.insertMany(mappedData);
    }

    if (ssdDamOverviewLastData.length) {
      const LastDate1 = new Date(ssdDamOverviewLastData[0].dateTime);
      const newArray = srspSsdDamOverviewPosition
        .map(datetimeString => {
          const datetime = new Date(datetimeString.DateTime);
          if (datetime > LastDate1) {
            console.log(`${datetime} is later than ${LastDate1}`);
            return datetimeString;
          }
          return null;
        }).filter(item => item !== null);

      await SSDOP.insertMany(newArray);

    } else {
      await SSDOP.insertMany(mappedData1);
    }

    if (hrDamOverviewLastData.length) {
      const LastDate1 = new Date(hrDamOverviewLastData[0].dateTime);
      const newArray = srspHrDamOverviewPosition
        .map(datetimeString => {
          const datetime = new Date(datetimeString.DateTime);
          if (datetime > LastDate1) {
            console.log(`${datetime} is later than ${LastDate1}`);
            return datetimeString;
          }
          return null;
        }).filter(item => item !== null);

      await SHDOP.insertMany(newArray);

    } else {
      await SHDOP.insertMany(mappedData2);
    }

    if (ssdDamOverviewDischargeLastData.length) {
      const LastDate1 = new Date(ssdDamOverviewDischargeLastData[0].dateTime);
      const newArray = srspSsdDamOverviewDischarge
        .map(datetimeString => {
          const datetime = new Date(datetimeString.DateTime);
          if (datetime > LastDate1) {
            console.log(`${datetime} is later than ${LastDate1}`);
            return datetimeString;
          }
          return null;
        }).filter(item => item !== null);

      await SDOD.insertMany(newArray);

    } else {
      await SDOD.insertMany(mappedData3);
    }

    if (hrKakatiyaAdvm.length) {
      const LastDate1 = new Date(hrKakatiyaAdvm[0].dateTime);
      const newArray = srspHrSsdAdvm
        .map(datetimeString => {
          const datetime = new Date(datetimeString.DateTime);
          if (datetime > LastDate1) {
            console.log(`${datetime} is later than ${LastDate1}`);
            return datetimeString;
          }
          return null;
        }).filter(item => item !== null);

      await SHKA.insertMany(newArray);

    } else {
      await SHKA.insertMany(mappedData4);
    }

    if (hrDamOverviewDischarge.length) {
      const LastDate1 = new Date(hrDamOverviewDischarge[0].dateTime);
      const newArray = srspHrDamOverviewDischarge
        .map(datetimeString => {
          const datetime = new Date(datetimeString.DateTime);
          if (datetime > LastDate1) {
            console.log(`${datetime} is later than ${LastDate1}`);
            return datetimeString;
          }
          return null;
        }).filter(item => item !== null);

      await SHDOD.insertMany(newArray);

    } else {
      await SHDOD.insertMany(mappedData5);
    }

  } catch (error) {
    console.error('Error handling MongoDB data:', error);
    throw error;
  }
}


const createSalientFeature = catchAsync(async (req, res) => {
  const createSalientFeature = await srspService.createSalientFeature(req.body);
  res.status(httpStatus.CREATED).send(createSalientFeature);
});

const getSalientFeature = catchAsync(async (req, res) => {
  const getSalientFeature = await srspService.getSalientFeature();
  res.send(getSalientFeature);
})

const srspDamOverview = catchAsync(async (req, res) => {

  const getLastDataSrspDamPondLevelOverview = await srspService.getLastDataSrspDamPondLevelOverview();
  const getLastDataSrspDamOverviewPos = await srspService.getLastDataSrspDamOverviewPos();
  const getLastDataSrspDamOverviewDish = await srspService.getLastDataSrspDamOverviewDish();
  const getLastDataSrspHrDamOverviewPos = await srspService.getLastDataSrspHrDamOverviewPos();
  const getLastDataSrspHrDamOverviewDish = await srspService.getLastDataSrspHrDamOverviewDish();

  const combinedData = {
    getLastDataSrspDamPondLevelOverview,
    getLastDataSrspDamOverviewPos,
    getLastDataSrspDamOverviewDish,
    getLastDataSrspHrDamOverviewPos,
    getLastDataSrspHrDamOverviewDish,
  };

  res.json(combinedData);


})

const getLastDataSrspDamSpareAdvm = catchAsync(async (req, res) => {
  const getLastDataLmdDamSpareAdvm = await srspService.getLastDataSrspDamSpareAdvm();
  res.send(getLastDataLmdDamSpareAdvm);
})


module.exports = { handleMongoDBData, createSalientFeature, getSalientFeature, srspDamOverview, getLastDataSrspDamSpareAdvm }

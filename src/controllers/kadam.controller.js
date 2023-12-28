const mongoose = require('mongoose');
const KPLO = require("../models/KNR_POND_LEVEL_OVERVIEW")
const KDOP = require("../models/KNR_DAM_OVERVIEW_POS")
const KDOD = require("../models/KNR_DAM_OVERVIEW_DICH")
const KHDOP = require("../models/NKR_HR_DAM_OVERVIEW_POS")
const KHDOD = require("../models/NKR_HR_DAM_OVERVIEW_DICH")
const KSADVM = require("../models/NKR_SPARE_ADVM")
const { log } = require('winston');

async function connectToMongoDBKadam() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/hyderabad');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

async function kadamMongoDBData(data) {
    try {
        
        const kadamPondLevel = data.kadamPondLevel
        const kadamKnrDamOverviewPosition = data.kadamKnrDamOverviewPosition
        const kadamKnrDamOverviewDischarge = data.kadamKnrDamOverviewDischarge
        const kadamHrDamOverviewPosition = data.kadamHrDamOverviewPosition
        const kadamHrDamOverviewDischarge = data.kadamHrDamOverviewDischarge
        const kadamHrKnrAdvm = data.kadamHrKnrAdvm

        const mappedData = kadamPondLevel.map(row => ({
            dateTime: row.DateTime,
            inflow1Level: row.D1,
            inflow2Level: row.D2,
            inflow3Level: row.D3,
            inflow1Discharge: row.D4,
            inflow2Discharge: row.D5,
            inflow3Discharge: row.D6,
            damDownstreamLevel: row.D7,
            damDownstreamDischarge: row.D8,
            hrrDownstreamLevel: row.D9,
            hrrDownstreamDischarge: row.D10,
            D11: row.D11,
            D12: row.D12,
            D13: row.D13,
            D14: row.D14,
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
        }));

        const mappedData1 = kadamKnrDamOverviewPosition.map(row => ({
            dateTime: row.DateTime,
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
        }))

        const mappedData2 = kadamKnrDamOverviewDischarge.map(row => ({
            dateTime: row.DateTime,
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
        }))

        const mappedData3 = kadamHrDamOverviewPosition.map(row => ({
            dateTime: row.DateTime,
            hrklManGate1Position: row.D1,
            hrklManGate2Position: row.D2,
            hrklManGate3Position: row.D3,
            hrklManGate4Position: row.D4,
            hrklManGate5Position: row.D5,
            D6: row.D6,
            D7: row.D7,
            D8: row.D8,
            D9: row.D9,
            D10: row.D10,
            D11: row.D11,
            D12: row.D12,
            D13: row.D13,
            D14: row.D14,
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
        }))

        const mappedData4 = kadamHrDamOverviewDischarge.map(row => ({
            dateTime: row.DateTime,
            hrklManGate1Discharge: row.D1,
            hrklManGate2Discharge: row.D2,
            hrklManGate3Discharge: row.D3,
            hrklManGate4Discharge: row.D4,
            hrklManGate5Discharge: row.D5,
            D6: row.D6,
            D7: row.D7,
            D8: row.D8,
            D9: row.D9,
            D10: row.D10,
            D11: row.D11,
            D12: row.D12,
            D13: row.D13,
            D14: row.D14,
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
        }))

        const mappedData5 = kadamHrKnrAdvm.map(row => ({
            dateTime: row.DateTime,
            D1: row.D1,
            D2: row.D2,
            D3: row.D3,
            D4: row.D4,
            D5: row.D5,
            D6: row.D6,
            D7: row.D7,
            D8: row.D8,
            D9: row.D9,
            D10: row.D10,
            D11: row.D11,
            D12: row.D12,
            D13: row.D13,
            D14: row.D14,
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
        }))

        const kadamPondLevelOverview = await KPLO.find().sort({ dateTime: -1 }).limit(1);
        const kadamDamOverviewPosition = await KDOP.find().sort({ dateTime: -1 }).limit(1);
        const kadamDamOverviewDischarge = await KDOD.find().sort({ dateTime: -1 }).limit(1);
        const kadamHrDamOverviewPos = await KHDOP.find().sort({ dateTime: -1 }).limit(1);
        const kadamHrDamOverviewDis = await KHDOD.find().sort({ dateTime: -1 }).limit(1);
        const kadamAdvm = await KSADVM.find().sort({ dateTime: -1 }).limit(1);

        if (kadamPondLevelOverview.length) {
            const LastDate = new Date(kadamPondLevelOverview[0].dateTime);
            const newArray = kadamPondLevel
                .map(datetimeString => {
                    const datetime = new Date(datetimeString.DateTime);
                    if (datetime > LastDate) {
                        console.log(`${datetime} is later than ${LastDate}`);
                        return datetimeString;
                    }
                    return null;
                }).filter(item => item !== null);

            await KPLO.insertMany(newArray);
        } else {
            await KPLO.insertMany(mappedData);
        }

        if (kadamDamOverviewPosition.length) {
            const LastDate = new Date(kadamDamOverviewPosition[0].dateTime);
            const newArray = kadamKnrDamOverviewPosition
                .map(datetimeString => {
                    const datetime = new Date(datetimeString.DateTime);
                    if (datetime > LastDate) {
                        console.log(`${datetime} is later than ${LastDate}`);
                        return datetimeString;
                    }
                    return null;
                }).filter(item => item !== null);

            await KDOP.insertMany(newArray);
        } else {
            await KDOP.insertMany(mappedData1);
        }

        if (kadamDamOverviewDischarge.length) {
            const LastDate = new Date(kadamDamOverviewDischarge[0].dateTime);
            const newArray = kadamKnrDamOverviewDischarge
                .map(datetimeString => {
                    const datetime = new Date(datetimeString.DateTime);
                    if (datetime > LastDate) {
                        console.log(`${datetime} is later than ${LastDate}`);
                        return datetimeString;
                    }
                    return null;
                }).filter(item => item !== null);

            await KDOD.insertMany(newArray);
        } else {
            await KDOD.insertMany(mappedData2);
        }

        if (kadamHrDamOverviewPos.length) {
            const LastDate = new Date(kadamHrDamOverviewPos[0].dateTime);
            const newArray = kadamHrDamOverviewPosition
                .map(datetimeString => {
                    const datetime = new Date(datetimeString.DateTime);
                    if (datetime > LastDate) {
                        console.log(`${datetime} is later than ${LastDate}`);
                        return datetimeString;
                    }
                    return null;
                }).filter(item => item !== null);

            await KHDOP.insertMany(newArray);
        } else {
            await KHDOP.insertMany(mappedData3);
        }

        if (kadamHrDamOverviewDis.length) {
            const LastDate = new Date(kadamHrDamOverviewDis[0].dateTime);
            const newArray = kadamHrDamOverviewDischarge
                .map(datetimeString => {
                    const datetime = new Date(datetimeString.DateTime);
                    if (datetime > LastDate) {
                        console.log(`${datetime} is later than ${LastDate}`);
                        return datetimeString;
                    }
                    return null;
                }).filter(item => item !== null);

            await KHDOD.insertMany(newArray);
        } else {
            await KHDOD.insertMany(mappedData4);
        }

        if (kadamAdvm.length) {
            const LastDate = new Date(kadamAdvm[0].dateTime);
            const newArray = kadamHrKnrAdvm
                .map(datetimeString => {
                    const datetime = new Date(datetimeString.DateTime);
                    if (datetime > LastDate) {
                        console.log(`${datetime} is later than ${LastDate}`);
                        return datetimeString;
                    }
                    return null;
                }).filter(item => item !== null);

            await KSADVM.insertMany(newArray);
        } else {
            await KSADVM.insertMany(mappedData5);
        }
       

    } catch (error) {
        console.error('Error handling MongoDB data:', error);
    }
}

module.exports = {  kadamMongoDBData };

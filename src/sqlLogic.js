const sql = require('mssql');
const sqlconfig = require('./config/sql.config');
const { lmdMongoDBData } = require('./controllers/lmd.controller');
const { kadamMongoDBData } = require('./controllers/kadam.controller');


const LHRA = require('./models/LMD_HR_RIGHT_ADVM');
const LPLO = require('./models/LMD_POND_LEVEL_OVERVIEW');
const LDOP = require('./models/LMD_DAM_OVERVIEW_POS');
const LDAD = require('./models/LMD_DAM_OVERVIEW_DICH');
const LHDOP = require('./models/LMD_HR_DAM_OVERVIEW_POS');
const LHDOD = require('./models/LMD_HR_DAM_OVERVIEW_DICH');

const SPLO = require('./models/SRSP_POND_LEVEL_OVERVIEW');
const SSDOP = require('./models/SRSP_SSD_DAM_OVERVIEW_POS');
const SHDOP = require('./models/SRSP_HR_DAM_OVERVIEW_POS');
const SDOD = require('./models/SRSP_SSD_DAM_OVERVIEW_DICH');
const SHKA = require('./models/SRSP_HR_KAKATIYA_ADVM');
const SHDOD = require('./models/SRSP_HR_DAM_OVERVIEW_DICH');

const KPLO = require('./models/KNR_POND_LEVEL_OVERVIEW');
const KDOP = require('./models/KNR_DAM_OVERVIEW_POS');
const KDOD = require('./models/KNR_DAM_OVERVIEW_DICH');
const KHDOP = require('./models/KNR_HR_DAM_OVERVIEW_POS');
const KHDOD = require('./models/KNR_HR_DAM_OVERVIEW_DICH');
const KSADVM = require('./models/KNR_SPARE_ADVM');

const lmd_config = {
    user: sqlconfig.LMD_DAM_USER,
    password: sqlconfig.LMD_DAM_PASSWORD,
    server: sqlconfig.LMD_DAM_IP,
    port: sqlconfig.LMD_DAM_PORT,
    database: sqlconfig.LMD_DAM_DATABASE,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };
  
  const sesp_config = {
    user: sqlconfig.SRSP_DAM_USER,
    password: sqlconfig.SRSP_DAM_PASSWORD,
    server: sqlconfig.SRSP_DAM_IP,
    port: sqlconfig.SRSP_DAM_PORT,
    database: sqlconfig.SRSP_DAM_DATABASE,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };
  
  const kadam_config = {
    user: sqlconfig.KADDAM_DAM_USER,
    password: sqlconfig.KADDAM_DAM_PASSWORD,
    server: sqlconfig.KADDAM_DAM_IP,
    port: sqlconfig.KADDAM_DAM_PORT,
    database: sqlconfig.KADDAM_DAM_DATABASE,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };

  async function connectToSQL(config, serverName) {
    try {
      await sql.connect(config);
      console.log(`Connected to ${serverName} SQL Server!`);
    } catch (error) {
      console.error(`Error connecting to ${serverName} SQL Server:`, error);
      // throw error;
    }
  }

async function LMDDAM() {
  try {
    await connectToSQL(lmd_config, "LMD SERVER");

   let datas = {
      lmdPondLevel: null,
      lmdDamOverviewPosition: null,
      lmdDamOverviewDischarge: null,
      lmdHrDamOverviewPosition: null,
      lmdHrDamOverviewDischarge: null,
      lmdHrSsdAdvm: null
    };
    const getLastRecord = async (Model) => {
      return await Model.findOne().sort({ dateTime: -1 }).lean();
    };

    const getLastRecordWithSQLQuery = async (Model, tableName) => {
      const lastRecord = await getLastRecord(Model);

      console.log(lastRecord , "+++++++++++++++++");
      if (lastRecord) {
        const date = new Date(lastRecord?.dateTime).toISOString().slice(0, 19) + ".000Z";
        const result = await sql.query(`SELECT * FROM [DATA_DB_LMD].[dbo].[${tableName}] WHERE DateTime > '${date}'`);
        return result.recordset;
      } else {
        const result = await sql.query(`SELECT * FROM ${tableName}`);
        return result.recordset;
      }
    };

    const mapLmdPondLevel = await getLastRecordWithSQLQuery(LPLO, 'POND_LEVEL_OVERVIEW');
    await lmdMongoDBData(mapLmdPondLevel, LPLO, 'mapLmdPondLevel');
    
    const mapLmdDamOverviewPosition = await getLastRecordWithSQLQuery(LDOP, 'LMD_DAM_OVERVIEW_POS');
    await lmdMongoDBData(mapLmdDamOverviewPosition, LDOP, 'mapLmdDamOverviewPosition');

    const mapLmdDamOverviewDischarge = await getLastRecordWithSQLQuery(LDAD, 'LMD_DAM_OVERVIEW_DICH');
    await lmdMongoDBData(mapLmdDamOverviewDischarge, LDAD, 'mapLmdDamOverviewDischarge');

    const mapLmdHrDamOverviewPosition = await getLastRecordWithSQLQuery(LHDOP, 'HR_DAM_OVERVIEW_POS');
    await lmdMongoDBData(mapLmdHrDamOverviewPosition, LHDOP, 'mapLmdHrDamOverviewPosition');
    
    const mapLmdHrDamOverviewDischarge = await getLastRecordWithSQLQuery(LHDOD, 'HR_DAM_OVERVIEW_DICH');
    await lmdMongoDBData(mapLmdHrDamOverviewDischarge, LHDOD, 'mapLmdHrDamOverviewDischarge');

    const mapLmdHrSsdAdvm = await getLastRecordWithSQLQuery(LHRA, 'HR_LMD_ADVM');
    await lmdMongoDBData(mapLmdHrSsdAdvm, LHRA, 'mapLmdHrSsdAdvm');

    
  } catch (error) {
    console.error("Error fetching data from LMD SQL Server:", error);
    throw error;
  } finally {
    // Close SQL connection
    await sql.close();
  }
}

async function SRSPDAM() {
  try {
    await connectToSQL(sesp_config, "SRSP SERVER");

    const datas = {
      srspPondLevel: null,
      srspSsdDamOverviewPosition: null,
      srspSsdDamOverviewDischarge: null,
      srspHrDamOverviewPosition: null,
      srspHrDamOverviewDischarge: null,
      srspHrSsdAdvm: null
    };

    const getLastRecord = async (Model) => {
      return await Model.findOne().sort({ dateTime: -1 }).lean();
    };

    const getLastRecordWithSQLQuery = async (Model, tableName) => {
      const lastRecord = await getLastRecord(Model);

      console.log(lastRecord ,"================");
      if (lastRecord) {
        const date = new Date(lastRecord?.dateTime).toISOString().slice(0, 19) + ".000Z";
        const result = await sql.query(`SELECT * FROM [DATA_DB_SSD].[dbo].[${tableName}] WHERE DateTime > '${date}'`);
        return result.recordset;
      } else {
        const result = await sql.query(`SELECT * FROM ${tableName}`);
        return result.recordset;
      }
    };

    datas.srspPondLevel = await getLastRecordWithSQLQuery(SPLO, 'POND_LEVEL_OVERVIEW');
    datas.srspSsdDamOverviewPosition = await getLastRecordWithSQLQuery(SSDOP, 'SSD_DAM_OVERVIEW_POS');
    datas.srspSsdDamOverviewDischarge = await getLastRecordWithSQLQuery(SDOD, 'SSD_DAM_OVERVIEW_DICH');
    datas.srspHrDamOverviewPosition = await getLastRecordWithSQLQuery(SHDOP, 'HR_DAM_OVERVIEW_POS');
    datas.srspHrDamOverviewDischarge = await getLastRecordWithSQLQuery(SHDOD, 'HR_DAM_OVERVIEW_DICH');
    datas.srspHrSsdAdvm = await getLastRecordWithSQLQuery(SHKA, 'HR_SSD_ADVM');

    return datas;
  } catch (error) {
    console.error("Error fetching data from LMD SQL Server:", error);
    throw error;
  } finally {
    // Close SQL connection
    await sql.close();
  }
}

async function KADAM() {
  try {
    await connectToSQL(kadam_config, "KADDAM SERVER");

    const datas = {
      kadamPondLevel: null,
      kadamKnrDamOverviewPosition: null,
      kadamKnrDamOverviewDischarge: null,
      kadamHrDamOverviewPosition: null,
      kadamHrDamOverviewDischarge: null,
      kadamHrKnrAdvm: null
    };

    const getLastRecord = async (Model) => {
      return await Model.findOne().sort({ dateTime: -1 }).lean();
    };

    const getLastRecordWithSQLQuery = async (Model, tableName) => {
      const lastRecord = await getLastRecord(Model);

      console.log(lastRecord, "*********************");
      if (lastRecord) {
        const date = new Date(lastRecord?.dateTime).toISOString().slice(0, 19) + ".000Z";
        const result = await sql.query(`SELECT * FROM [DATA_DB_KNR].[dbo].[${tableName}] WHERE DateTime > '${date}'`);
        return result.recordset;
      } else {
        const result = await sql.query(`SELECT * FROM ${tableName}`);
        return result.recordset;
      }
    };

    // datas.kadamPondLevel = await getLastRecordWithSQLQuery(KPLO, 'POND_LEVEL_OVERVIEW');
    // datas.kadamKnrDamOverviewPosition = await getLastRecordWithSQLQuery(KDOP, 'KNR_DAM_OVERVIEW_POS');
    datas.kadamKnrDamOverviewDischarge = await getLastRecordWithSQLQuery(KDOD, 'KNR_DAM_OVERVIEW_DICH');
    datas.kadamHrDamOverviewPosition = await getLastRecordWithSQLQuery(KHDOP, 'HR_DAM_OVERVIEW_POS');
    datas.kadamHrDamOverviewDischarge = await getLastRecordWithSQLQuery(KHDOD, 'HR_DAM_OVERVIEW_DICH');
    datas.kadamHrKnrAdvm = await getLastRecordWithSQLQuery(KSADVM, 'HR_KNR_ADVM');

    kadamMongoDBData(datas);
    return datas;
  } catch (error) {
    console.error("Error fetching data from LMD SQL Server:", error);
    throw error;
  } finally {
    // Close SQL connection
    await sql.close();
  }
}

module.exports = { SRSPDAM, KADAM, LMDDAM };

const sql = require('mssql');
const sqlconfig = require('./config/sql.config');
const { lmdMongoDBData } = require('./controllers/lmd.controller');
const { kadamMongoDBData } = require('./controllers/kadam.controller');
const { handleMongoDBData } = require('./controllers/srsp.controller');


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

    const getLastRecord = async (Model) => {
      return await Model.findOne().sort({ dateTime: -1 }).lean();
    };

    const getLastRecordWithSQLQuery = async (Model, tableName) => {
      const lastRecord = await getLastRecord(Model);

      let query;

      if (lastRecord) {
        const date = new Date(lastRecord?.dateTime).toISOString().slice(0, 19) + ".000Z";
       query = `SELECT * FROM [DATA_DB_LMD].[dbo].[${tableName}] WHERE DateTime > '${date}'`;
      } else {
        query = `SELECT * FROM ${tableName}`;
      }
      const result = await sql.query(query);
      return result.recordset;

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
    console.error("Error fetching data from LMD SQL Server:", error.message);
    // throw error;
  } finally {
    // Close SQL connection
    await sql.close();
  }
}

async function SRSPDAM() {
  try {
    await connectToSQL(sesp_config, "SRSP SERVER");

    const getLastRecord = async (Model) => {
      return await Model.findOne().sort({ dateTime: -1 }).lean();
    };

    const getLastRecordWithSQLQuery = async (Model, tableName) => {
      const lastRecord = await getLastRecord(Model);
   let query;
      if (lastRecord) {
        const date = new Date(lastRecord?.dateTime).toISOString().slice(0, 19) + ".000Z";
        query = `SELECT * FROM [DATA_DB_SSD].[dbo].[${tableName}] WHERE DateTime > '${date}'`;
       
      } else {
        query =`SELECT * FROM ${tableName}`;
      }
      const result = await sql.query(query);
      return result.recordset;

    };

    const mapSrspPondLevel = await getLastRecordWithSQLQuery(SPLO, 'POND_LEVEL_OVERVIEW');
    await handleMongoDBData(mapSrspPondLevel, SPLO, 'mapSrspPondLevel');
    
    const mapsrspSsdDamOverviewPosition = await getLastRecordWithSQLQuery(SSDOP, 'SSD_DAM_OVERVIEW_POS');
    await handleMongoDBData(mapsrspSsdDamOverviewPosition, SSDOP, 'mapsrspSsdDamOverviewPosition');

    const mapsrspSsdDamOverviewDischarge = await getLastRecordWithSQLQuery(SDOD, 'SSD_DAM_OVERVIEW_DICH');
    await handleMongoDBData(mapsrspSsdDamOverviewDischarge, SDOD, 'mapsrspSsdDamOverviewDischarge');

    const mapsrspHrDamOverviewPosition = await getLastRecordWithSQLQuery(SHDOP, 'HR_DAM_OVERVIEW_POS');
    await handleMongoDBData(mapsrspHrDamOverviewPosition, SHDOP, 'mapsrspHrDamOverviewPosition');
    
    const mapsrspHrDamOverviewDischarge = await getLastRecordWithSQLQuery(SHDOD, 'HR_DAM_OVERVIEW_DICH');
    await handleMongoDBData(mapsrspHrDamOverviewDischarge, SHDOD, 'mapsrspHrDamOverviewDischarge');

    const mapsrspHrSsdAdvm = await getLastRecordWithSQLQuery(SHKA, 'HR_SSD_ADVM');
    await handleMongoDBData(mapsrspHrSsdAdvm, SHKA, 'mapsrspHrSsdAdvm');

  } catch (error) {
    console.error("Error fetching data from SRSP SQL Server:", error.message);
    // throw error;
  } finally {
    // Close SQL connection
    await sql.close();
  }
}

async function KADAM() {
  try {
    await connectToSQL(kadam_config, "KADDAM SERVER");

    const getLastRecord = async (Model) => {
      return await Model.findOne().sort({ dateTime: -1 }).lean();
    };

    const getLastRecordWithSQLQuery = async (Model, tableName) => {
      const lastRecord = await getLastRecord(Model);
      let query;

      if (lastRecord) {
        const date = new Date(lastRecord?.dateTime).toISOString().slice(0, 19) + ".000Z";
        query =`SELECT * FROM [DATA_DB_KNR].[dbo].[${tableName}] WHERE DateTime > '${date}'`;
      } else {
        query = `SELECT * FROM ${tableName}`;
       
      }
      const result = await sql.query(query);
      return result.recordset;
    };


    const mapKadamPondLevel = await getLastRecordWithSQLQuery(KPLO, 'POND_LEVEL_OVERVIEW');
    await kadamMongoDBData(mapKadamPondLevel, KPLO, 'mapKadamPondLevel');
    
    const mapKadamKnrDamOverviewPosition = await getLastRecordWithSQLQuery(KDOP, 'KNR_DAM_OVERVIEW_POS');
    await kadamMongoDBData(mapKadamKnrDamOverviewPosition, KDOP, 'mapKadamKnrDamOverviewPosition');

    const mapKadamKnrDamOverviewDischarge = await getLastRecordWithSQLQuery(KDOD, 'KNR_DAM_OVERVIEW_DICH');
    await kadamMongoDBData(mapKadamKnrDamOverviewDischarge, KDOD, 'mapKadamKnrDamOverviewDischarge');

    const mapKadamHrDamOverviewPosition = await getLastRecordWithSQLQuery(KHDOP, 'HR_DAM_OVERVIEW_POS');
    await kadamMongoDBData(mapKadamHrDamOverviewPosition, KHDOP, 'mapKadamHrDamOverviewPosition');
    
    const mapKadamHrDamOverviewDischarge = await getLastRecordWithSQLQuery(KHDOD, 'HR_DAM_OVERVIEW_DICH');
    await kadamMongoDBData(mapKadamHrDamOverviewDischarge, KHDOD, 'mapKadamHrDamOverviewDischarge');

    const mapKadamHrKnrAdvm = await getLastRecordWithSQLQuery(KSADVM, 'HR_KNR_ADVM');
    await kadamMongoDBData(mapKadamHrKnrAdvm, KSADVM, 'mapKadamHrKnrAdvm');

  } catch (error) {
    console.error("Error fetching data from Kadam SQL Server:", error.message);
    // throw error;
  } finally {
    // Close SQL connection
    await sql.close();
  }
}

module.exports = { SRSPDAM, KADAM, LMDDAM };

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

// Define database names if they are not defined in the configuration
const DATA_DB_LMD = sqlconfig.LMD_DAM_DATABASE;
const DATA_DB_SSD = sqlconfig.SRSP_DAM_DATABASE;
const DATA_DB_KNR = sqlconfig.KADDAM_DAM_DATABASE;

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
    throw error;
  }
}

async function getLastRecord(Model) {
  return await Model.findOne().sort({ dateTime: -1 });
}

async function getLastRecordWithSQLQuery(Model, databaseName, tableName) {
  const lastRecord = await getLastRecord(Model);
  let query;

  if (lastRecord) {
    const date = new Date(lastRecord.dateTime).toISOString().slice(0, 19) + ".000Z";
    query = `SELECT * FROM [${databaseName}].[dbo].[${tableName}] WHERE DateTime > '${date}'`;
  } else {
    query = `SELECT * FROM [${databaseName}].[dbo].[${tableName}]`;
  }
  const result = await sql.query(query);
  return result.recordset;
}

async function processTableData(Model, databaseName, tableName, mapFunctionName, controllerFunction) {
  const data = await getLastRecordWithSQLQuery(Model, databaseName, tableName);
  await controllerFunction(data, Model, mapFunctionName);
}

async function LMDDAM() {
  try {
    await connectToSQL(lmd_config, "LMD SERVER");

    const tasks = [
      processTableData(LPLO, DATA_DB_LMD, 'POND_LEVEL_OVERVIEW', 'mapLmdPondLevel', lmdMongoDBData),
      processTableData(LDOP, DATA_DB_LMD, 'LMD_DAM_OVERVIEW_POS', 'mapLmdDamOverviewPosition', lmdMongoDBData),
      processTableData(LDAD, DATA_DB_LMD, 'LMD_DAM_OVERVIEW_DICH', 'mapLmdDamOverviewDischarge', lmdMongoDBData),
      processTableData(LHDOP, DATA_DB_LMD, 'HR_DAM_OVERVIEW_POS', 'mapLmdHrDamOverviewPosition', lmdMongoDBData),
      processTableData(LHDOD, DATA_DB_LMD, 'HR_DAM_OVERVIEW_DICH', 'mapLmdHrDamOverviewDischarge', lmdMongoDBData),
      processTableData(LHRA, DATA_DB_LMD, 'HR_LMD_ADVM', 'mapLmdHrSsdAdvm', lmdMongoDBData),
    ];

    await Promise.all(tasks);

    console.log("Data fetched and stored successfully from LMD SQL Server.");
  } catch (error) {
    console.error("Error fetching data from LMD SQL Server:", error.message);
  } finally {
    await sql.close();
  }
}

async function SRSPDAM() {
  try {
    await connectToSQL(sesp_config, "SRSP SERVER");

    const tasks = [
      processTableData(SPLO, DATA_DB_SSD, 'POND_LEVEL_OVERVIEW', 'mapSrspPondLevel', handleMongoDBData),
      processTableData(SSDOP, DATA_DB_SSD, 'SSD_DAM_OVERVIEW_POS', 'mapsrspSsdDamOverviewPosition', handleMongoDBData),
      processTableData(SDOD, DATA_DB_SSD, 'SSD_DAM_OVERVIEW_DICH', 'mapsrspSsdDamOverviewDischarge', handleMongoDBData),
      processTableData(SHDOP, DATA_DB_SSD, 'HR_DAM_OVERVIEW_POS', 'mapsrspHrDamOverviewPosition', handleMongoDBData),
      processTableData(SHDOD, DATA_DB_SSD, 'HR_DAM_OVERVIEW_DICH', 'mapsrspHrDamOverviewDischarge', handleMongoDBData),
      processTableData(SHKA, DATA_DB_SSD, 'HR_SSD_ADVM', 'mapsrspHrSsdAdvm', handleMongoDBData),
    ];

    await Promise.all(tasks);

    console.log("Data fetched and stored successfully from SRSP SQL Server.");
  } catch (error) {
    console.error("Error fetching data from SRSP SQL Server:", error.message);
  } finally {
    await sql.close();
  }
}

async function KADAM() {
  try {
    await connectToSQL(kadam_config, "KADDAM SERVER");

    const tasks = [
      processTableData(KPLO, DATA_DB_KNR, 'POND_LEVEL_OVERVIEW', 'mapKadamPondLevel', kadamMongoDBData),
      processTableData(KDOP, DATA_DB_KNR, 'KNR_DAM_OVERVIEW_POS', 'mapKadamKnrDamOverviewPosition', kadamMongoDBData),
      processTableData(KDOD, DATA_DB_KNR, 'KNR_DAM_OVERVIEW_DICH', 'mapKadamKnrDamOverviewDischarge', kadamMongoDBData),
      processTableData(KHDOP, DATA_DB_KNR, 'HR_DAM_OVERVIEW_POS', 'mapKadamHrDamOverviewPosition', kadamMongoDBData),
      processTableData(KHDOD, DATA_DB_KNR, 'HR_DAM_OVERVIEW_DICH', 'mapKadamHrDamOverviewDischarge', kadamMongoDBData),
      processTableData(KSADVM, DATA_DB_KNR, 'HR_KNR_ADVM', 'mapKadamHrKnrAdvm', kadamMongoDBData),
    ];

    await Promise.all(tasks);

    console.log("Data fetched and stored successfully from KADDAM SQL Server.");
  } catch (error) {
    console.error("Error fetching data from Kadam SQL Server:", error.message);
  } finally {
    await sql.close();
  }
}

module.exports = { SRSPDAM, KADAM, LMDDAM };

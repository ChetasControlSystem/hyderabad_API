const sql = require('mssql');
const sqlconfig = require('./config/sql.config');

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


async function connectToSrspSQL() {
  try {
    await sql.connect(sesp_config);
    console.log('Connected to SRSP SQL Server!');
  } catch (error) {
    console.error('Error connecting to SRSP SQL Server:', error);
    // throw error;
  }
}

async function connectTokadamSQL(){
    try {
        await sql.connect(kadam_config);
        console.log('Connected to KADDAM SQL Server!');
    } catch (error) {
        console.error('Error connecting to KADDAM SQL Server:', error);
        // throw error;
    }
}

async function connectToLmdSQl(){
  try {
    await sql.connect(lmd_config);
    console.log('Connected to LMD SQL Server!');
} catch (error) {
    console.error('Error connecting to LMD SQL Server:', error);
    // throw error;
}
}

async function LMDDAM() {
  try {
    await connectToLmdSQl();
    const lmdPondLevel = await sql.query`SELECT * FROM POND_LEVEL_OVERVIEW`;
    const lmdDamOverviewPosition = await sql.query`SELECT * FROM LMD_DAM_OVERVIEW_POS`;
    const lmdDamOverviewDischarge = await sql.query`SELECT * FROM LMD_DAM_OVERVIEW_DICH`;
    const lmdHrDamOverviewPosition = await sql.query`SELECT * FROM HR_DAM_OVERVIEW_POS`;
    const lmdHrDamOverviewDischarge = await sql.query`SELECT * FROM HR_DAM_OVERVIEW_DICH`;
    const lmdHrSsdAdvm = await sql.query`SELECT * FROM HR_LMD_ADVM`;
    
    return {
       lmdPondLevel: lmdPondLevel.recordset,
       lmdDamOverviewPosition: lmdDamOverviewPosition.recordset,
       lmdDamOverviewDischarge: lmdDamOverviewDischarge.recordset,
       lmdHrDamOverviewPosition: lmdHrDamOverviewPosition.recordset,
       lmdHrDamOverviewDischarge: lmdHrDamOverviewDischarge.recordset,
       lmdHrSsdAdvm: lmdHrSsdAdvm.recordset
    };
  } catch (error) {
    console.error('Error fetching data from LMD SQL Server:', error);
    // throw error;
  } finally {
    // Close SQL connection
    await sql.close();
  }
}

async function SRSPDAM() {
  try {
    await connectToSrspSQL();
    const srspPondLevel = await sql.query`SELECT * FROM POND_LEVEL_OVERVIEW`;
    const srspSsdDamOverviewPosition = await sql.query`SELECT * FROM SSD_DAM_OVERVIEW_POS`;
    const srspSsdDamOverviewDischarge = await sql.query`SELECT * FROM SSD_DAM_OVERVIEW_DICH`;
    const srspHrDamOverviewPosition = await sql.query`SELECT * FROM HR_DAM_OVERVIEW_POS`;
    const srspHrDamOverviewDischarge = await sql.query`SELECT * FROM HR_DAM_OVERVIEW_DICH`;
    const srspHrSsdAdvm = await sql.query`SELECT * FROM HR_SSD_ADVM`;

    return {
      srspPondLevel: srspPondLevel.recordset,
      srspSsdDamOverviewPosition: srspSsdDamOverviewPosition.recordset,
      srspSsdDamOverviewDischarge: srspSsdDamOverviewDischarge.recordset,
      srspHrDamOverviewPosition: srspHrDamOverviewPosition.recordset,
      srspHrDamOverviewDischarge: srspHrDamOverviewDischarge.recordset,
      srspHrSsdAdvm: srspHrSsdAdvm.recordset
    };
  } catch (error) {
    console.error('Error fetching data from SRSP SQL Server:', error);
    // throw error;
  } finally {
    // Close SQL connection
    await sql.close();
  }
}

async function KADAM(){
  try {
    await connectTokadamSQL();
    const kadamPondLevel = await sql.query`SELECT * FROM POND_LEVEL_OVERVIEW`;
    const kadamKnrDamOverviewPosition = await sql.query`SELECT * FROM KNR_DAM_OVERVIEW_POS`
    const kadamKnrDamOverviewDischarge = await sql.query`SELECT * FROM KNR_DAM_OVERVIEW_DICH`
    const kadamHrDamOverviewPosition = await sql.query`SELECT * FROM HR_DAM_OVERVIEW_POS`
    const kadamHrDamOverviewDischarge = await sql.query`SELECT * FROM HR_DAM_OVERVIEW_DICH`
    const kadamHrKnrAdvm = await sql.query`SELECT * FROM HR_KNR_ADVM`

    return {
      kadamPondLevel: kadamPondLevel.recordset,
      kadamKnrDamOverviewPosition: kadamKnrDamOverviewPosition.recordset,
      kadamKnrDamOverviewDischarge: kadamKnrDamOverviewDischarge.recordset,
      kadamHrDamOverviewPosition: kadamHrDamOverviewPosition.recordset,
      kadamHrDamOverviewDischarge: kadamHrDamOverviewDischarge.recordset,
      kadamHrKnrAdvm: kadamHrKnrAdvm.recordset
   };
  }  catch (error) {
    console.error('Error fetching data from KADDAM SQL Server:', error);
    // throw error;
  } finally {
    // Close SQL connection
    await sql.close();
  }
}

module.exports = { SRSPDAM, KADAM, LMDDAM };

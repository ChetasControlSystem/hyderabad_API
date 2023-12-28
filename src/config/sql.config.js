const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
      LMD_DAM_IP: Joi.string().required().description('LMD_DAM_IP'),
      LMD_DAM_USER: Joi.string().required().description('JLMD_DAM_USER NAME'),
      LMD_DAM_PASSWORD: Joi.string().description('LMD_DAM_PASSWORD'),
      LMD_DAM_PORT: Joi.number().default(1989),
      LMD_DAM_DATABASE: Joi.string().description('LMD_DAM_DATABASE'),

      SRSP_DAM_IP: Joi.string().required().description('SRSP_DAM_IP'),
      SRSP_DAM_USER: Joi.string().required().description('JSRSP_DAM_USER NAME'),
      SRSP_DAM_PASSWORD: Joi.string().description('SRSP_DAM_PASSWORD'),
      SRSP_DAM_PORT: Joi.number().default(1989),
      SRSP_DAM_DATABASE: Joi.string().description('SRSP_DAM_DATABASE'),

      KADDAM_DAM_IP: Joi.string().required().description('KADDAM_DAM_IP'),
      KADDAM_DAM_USER: Joi.string().required().description('JKADDAM_DAM_USER NAME'),
      KADDAM_DAM_PASSWORD: Joi.string().description('KADDAM_DAM_PASSWORD'),
      KADDAM_DAM_PORT: Joi.number().default(1989),
      KADDAM_DAM_DATABASE: Joi.string().description('KADDAM_DAM_DATABASE'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  LMD_DAM_IP : envVars.LMD_DAM_IP,
  LMD_DAM_USER : envVars.LMD_DAM_USER,
  LMD_DAM_PASSWORD : envVars.LMD_DAM_PASSWORD,
  LMD_DAM_PORT : envVars.LMD_DAM_PORT,
  LMD_DAM_DATABASE : envVars.LMD_DAM_DATABASE,
  
  SRSP_DAM_IP : envVars.SRSP_DAM_IP,
  SRSP_DAM_USER : envVars.SRSP_DAM_USER,
  SRSP_DAM_PASSWORD : envVars.SRSP_DAM_PASSWORD,
  SRSP_DAM_PORT : envVars.SRSP_DAM_PORT,
  SRSP_DAM_DATABASE : envVars.SRSP_DAM_DATABASE,
  
  KADDAM_DAM_IP : envVars.KADDAM_DAM_IP,
  KADDAM_DAM_USER : envVars.KADDAM_DAM_USER,
  KADDAM_DAM_PASSWORD : envVars.KADDAM_DAM_PASSWORD,
  KADDAM_DAM_PORT : envVars.KADDAM_DAM_PORT,
  KADDAM_DAM_DATABASE : envVars.KADDAM_DAM_DATABASE,
};

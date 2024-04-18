const Validator = require('validatorjs');
const schemas = require("./validation.rules");
const logger = require("../helpers/logger-helper");

var validation_helper = {
    validate_request: async (body, rules, customErrorMessages = {}) => {

        Validator.register('ymd_format', function (value, requirement, attribute) {
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            return dateRegex.test(value);
        }, 'The :attribute must be in YMD (YYYY-MM-DD) format.');

        Validator.register('interval_Minutes', function (value, requirement, attribute) {
            const validValues = ['10', '15', '30', '60', '240', '360'];
            return validValues.includes(value);
        }, 'Please select one of the following values for intervalMinutes: 10, 15, 30, 60, 240, 360.');

        const validator = new Validator(body, rules, customErrorMessages);
        if (validator.passes()) {
            return true;
        } else {
            return validator.errors.all();
        }
    },

    validate: (validation_key) => {

        return async (req, res, next) => {
            try {
                const { body, query, params } = req;

                const schema = schemas[validation_key];
                if (!schema) {
                    return next();
                }

                // Body Validation
                if (schema.body) {
                    const is_valid = await validation_helper.validate_request(body, schema.body);
                    if (is_valid !== true) {
                        const firstPropertyName = Object.keys(is_valid)[0];
                        const errorMessage = is_valid[firstPropertyName][0];
                        return res.status(400).json({ error: true, msg: errorMessage });
                    }
                }

                // Query Validation
                if (schema.query) {
                    const is_valid = await validation_helper.validate_request(query, schema.query);
                 
                    if (is_valid !== true) {
                        const firstPropertyName = Object.keys(is_valid)[0];
                        const errorMessage = is_valid[firstPropertyName][0];
                        return res.status(400).json({ error: true, msg: errorMessage });
                    }
                }

                // Params Validation
                if (schema.params) {
                    const is_valid = await validation_helper.validate_request(params, schema.params);
                    if (is_valid !== true) {
                        const firstPropertyName = Object.keys(is_valid)[0];
                        const errorMessage = is_valid[firstPropertyName][0];
                        return res.status(400).json({ error: true, msg: errorMessage });
                    }
                }
                next();
            } catch (error) {
                logger.error(error);
                return res.status(400).json({
                    error: true,
                    msg: "An error occurred during validation: " + error.message
                });
            }
        };
    }
}

module.exports = validation_helper;
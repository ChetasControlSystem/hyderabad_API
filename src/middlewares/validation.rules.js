const validation_rules = {

    srspReportShow: {
        query: {
            "startDate": "required|string|ymd_format",
            "endDate": "required|string|ymd_format",
            "intervalMinutes": "required|interval_Minutes",
        }
    },

    lmdReportShow: {
        query: {
            "startDate": "required|string|ymd_format",
            "endDate": "required|string|ymd_format",
            "intervalMinutes": "required|interval_Minutes",
        }
    },

    kadamReportShow: {
        query: {
            "startDate": "required|string|ymd_format",
            "endDate": "required|string|ymd_format",
            "intervalMinutes": "required|interval_Minutes",
        }
    },
   
}

module.exports = validation_rules;

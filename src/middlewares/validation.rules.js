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

    kadamReportDownload: {
        query: {
            "startDate": "required|string|ymd_format",
            "endDate": "required|string|ymd_format",
            "intervalMinutes": "required|interval_Minutes",
            "exportToExcel" : "required|in:0,1,2,3,4"
        }
    },

    srspReportDownload: {
        query: {
            "startDate": "required|string|ymd_format",
            "endDate": "required|string|ymd_format",
            "intervalMinutes": "required|interval_Minutes",
            "exportToExcel" : "required|in:0,1,2,3,4"
        }
    },

    lmdReportDownload: {
        query: {
            "startDate": "required|string|ymd_format",
            "endDate": "required|string|ymd_format",
            "intervalMinutes": "required|interval_Minutes",
            "exportToExcel" : "required|in:0,1,2,3,4"
        }
    },
   
}

module.exports = validation_rules;

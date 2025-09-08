sap.ui.define([
    "sap/ui/core/format/DateFormat"
], function (DateFormat) {
    "use strict";

    return {
        formatDate: function (sValue) {
            if (!sValue) return "";
            // Parse Microsoft JSON Date format: /Date(1696204800000)/
            let timestamp = parseInt(sValue.replace(/[^0-9]/g, ""), 10);
            let oDate = new Date(timestamp);
            return DateFormat.getDateInstance({pattern: "yyyy-MM-dd"}).format(oDate);
        }
    }

});
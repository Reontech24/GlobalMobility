sap.ui.define([
     "sap/m/MessageBox"
], function (MessageBox) {
    "use strict";

    return {

        /**
         * Private helper to show error message
         * @param {object} oError - OData error object
         */
        _parseError: function (oError) {
            MessageBox.error(oError);
        },

        /**
         *  Helper to get the data from node API
         * @param {String} sUrl - URL of the API
         * @returns 
         */
        getData: function (sUrl) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: sUrl,
                    method: "GET",
                    dataType: "json",
                    success: function (results) {
                        resolve(results);
                    },
                    error: function (oError) {
                        reject(this._parseError(oError))
                    }
                })
            });
        },

        /**
         * Helper to post the data using node API
         * @param {string} sUrl - URL of the API
         * @param {array/Object} payLoad - Data to be posted in SF
         * @returns 
         */
        postData: function (sUrl, payLoad) {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: sUrl,
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(payLoad),
                    success: function (data) {
                        resolve(data);
                    },
                    error: function (oError) {
                         reject(this._parseError(oError))
                    }
                })
            });
        }
    };
});
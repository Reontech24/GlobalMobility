sap.ui.define([], function () {
    "use strict";

    return {
        /**
         * Perform an OData READ operation
         * @param {sap.ui.model.odata.v2.ODataModel} oModel - OData model instance
         * @param {string} sPath - Entity path
         * @param {Object} [mParameters] - Additional read parameters (e.g. filters, expand)        
         */
        read: function (oModel, sPath, mParameters) {
            return new Promise(function (resolve, reject) {
                oModel.read(sPath, this._returnData(resolve, reject, mParameters));
            }.bind(this));
        },

        /**
         * Perform an OData CREATE or UPDATE (UPSERT) operation
         * @param {sap.ui.model.odata.v2.ODataModel} oModel - OData model instance
         * @param {Array} oPayload - Payload in array format       
         * @returns {Promise<Object>} - Resolves with response or rejects with error
         */

        upsertWorkflow: function (oModel, oPayload) {
            return new Promise(function (resolve, reject) {
                oModel.create("/upsert", oPayload, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    urlParameters: {
                        "workflowConfirmed":true
                    },
                    success: function (response) {
                        resolve(response);
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                });
            });

        },
         upsert: function (oModel, oPayload) {
            return new Promise(function (resolve, reject) {
                oModel.create("/upsert", oPayload, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    success: function (response) {
                        resolve(response);
                    },
                    error: function (oError) {
                        reject(oError);
                    }
                });
            });

        },
        /**
        * Private function to return response success/error
        * @param {Function} resolve - Function to call on successful response
        * @param {Function} reject - Function to call on error response
        * @returns {Promise<Object>} - Resolves with data or rejects with error
        */
        _returnData: function (resolve, reject, mParameters) {
            return {
                urlParameters: !!mParameters ? mParameters.urlParameters : '',
                filters: !!mParameters ? mParameters.filters : '',
                sorters: !!mParameters ? mParameters.sorters : '',
                success: function (data) {
                    resolve(data);
                },
                error: function (oError) {
                    reject(this._parseError(oError))
                }
            };

        },

        /**
         * Private helper to parse error response
         * @param {object} oError - OData error object
         * @returns {string} - Parsed error message
         */
        _parseError: function (oError) {
            try {
                const response = JSON.parse(oError.responseText);
                return response.error.message.value || "Unknown OData error.";
            } catch (e) {
                return oError.message || "Unknown error occurred.";
            }
        },
        callPostAPI: function (sUrl) {
            return new Promise(function (resolve, reject) {               
                $.ajax({
                    url: sUrl,
                    method: "GET",                 
                  
                    success: function (results) {
                        resolve(results);
                    },
                    error: function (oError) {
                        reject(this._parseError(oError))
                    }
                })
            });
        },
    };
});
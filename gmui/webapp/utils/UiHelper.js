sap.ui.define([
    "com/exyte/gmui/utils/ODataHelper",
], function (ODataHelper) {
    "use strict";

    return {
        _setEmployeeFilterData: async function (oEvent, aFilters, oDataModel, oUIModel) {
            const oComboBox = oEvent.getSource();
            try {
                // Build OData parameters
                const oParameters = {
                    urlParameters: {
                        "$select": oUIModel.getProperty("/selectEmpInititaionFilter").join(","),
                        "$expand": "personKeyNav",
                        "$orderby": "displayName"
                    },
                    filters: aFilters || []
                };

                // Fetch employee data
                const oResponse = await ODataHelper.read(oDataModel, "/User", oParameters);
                const aResults = oResponse?.results || [];
                const aEmployees = aResults.filter(items => items.custom06 === "Employee");

                // Update UI model
                oUIModel.setProperty("/User", aEmployees);

                // Bind items to combo box (bind only once ideally)
                oComboBox.bindItems({
                    path: "UIModel>/User",
                    template: new sap.ui.core.ListItem({
                        key: "{UIModel>userId}",
                        text: "{UIModel>displayName}",        
                        additionalText: "{UIModel>title}"
                    })
                });

            } catch (error) {
                // Optional: log or show error
                console.log("Error while fetching employee data:", error);
            }
        },
        _getPosition:function(oStartDate) {
            
        }

    }

});
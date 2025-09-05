sap.ui.define([
    "com/exyte/gmui/utils/ODataHelper",
    "com/exyte/gmui/utils/QueryHelper"
], function (ODataHelper, QueryHelper) {
    "use strict";

    return {
        _setEmployeeFilterData: async function (oEvent, oDataModel, oUIModel, isFilterable) {
            const oComboBox = oEvent.getSource();
            try {
                const oParameters = QueryHelper._getEmployeeParameter(oUIModel, isFilterable);
                const oResponse = await ODataHelper.read(oDataModel, "/User", oParameters);
                const aResults = oResponse?.results || [];
                const aEmployees = aResults.filter(items => items.custom06 === "Employee");
                oUIModel.setProperty("/User", aEmployees);
                oComboBox.bindItems({
                    path: "UIModel>/User",
                    template: new sap.ui.core.ListItem({
                        key: "{UIModel>userId}",
                        text: "{UIModel>displayName}",
                        additionalText: "{UIModel>title}"
                    })
                });
            } catch (error) {
                console.log("Error while fetching employee data:", error);
            }
        },
        _getPosition: function (oStartDate, sLegatEntity, oDataModel) {
            return new Promise(async function (resolve, reject) {
                const oParameters = QueryHelper._getPositionParameter(oStartDate, sLegatEntity);
                const oResponse = await ODataHelper.read(oDataModel, "/Position", oParameters);
                resolve(oResponse.results)
            });
        },
        _setLoggedUserDetails: function(oController, currentUserData) {
            const sInitails = currentUserData.firstName.charAt(0).toUpperCase() + currentUserData.lastName.charAt(0).toUpperCase();
            const LoggedUserName= currentUserData.firstName +" "+ currentUserData.lastName;
            const oModel = oController.getOwnerComponent().getModel("UIModel");
            oModel.setProperty("/InitialName",sInitails);
            oModel.setProperty("/LoggedUserName",LoggedUserName);
        }

    }

});
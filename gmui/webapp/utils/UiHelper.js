sap.ui.define([
    "com/exyte/gmui/utils/ODataHelper",
    "com/exyte/gmui/utils/QueryHelper"
], function (ODataHelper, QueryHelper) {
    "use strict";

    return {
        _setEmployeeFilterData: async function (oUIModel, name) {
            let sUri = "/node-api/getemplist"
            if(name) {
                sUri = "/node-api/getemplist?name="+name;
            }
            fetch(sUri).then(res => res.json()).then( data =>
                oUIModel.setProperty("/User", data))
                .catch(err => console.error("Error fetching data:", err));        
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
        const LoggedUserName = currentUserData.firstName + " " + currentUserData.lastName;
        const oModel = oController.getOwnerComponent().getModel("UIModel");
        oModel.setProperty("/InitialName", sInitails);
        oModel.setProperty("/LoggedUserName", LoggedUserName);
    }

}

});
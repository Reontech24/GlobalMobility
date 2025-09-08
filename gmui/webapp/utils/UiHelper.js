sap.ui.define([
    "com/exyte/gmui/utils/ODataHelper",
    "com/exyte/gmui/utils/QueryHelper",
    "sap/ui/model/json/JSONModel"
], function (ODataHelper, QueryHelper, JSONModel) {
    "use strict";

    return {
        _setEmpData: async function (oUIModel, name) {
            try {
                let sUri = "/node-api/getemplist";
                if (name) {
                    sUri += "?name=" + encodeURIComponent(name);
                }

                const res = await fetch(sUri);
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();
                oUIModel.setProperty("/user", data);
            } catch (err) {
                console.error("Error fetching employees:", err);
            }
        },
        _setManagerData: async function (oUIModel, name) {
            try {
                let sUri = "/node-api/gethostmanager";
                if (name) {
                    sUri += "?manager=" + encodeURIComponent(name);
                }

                const res = await fetch(sUri);
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }

                const data = await res.json();

                oUIModel.setProperty("/hostManager", data);
            } catch (err) {
                console.error("Error fetching employees:", err);
            }
        },
        _getPosition: function (oStartDate, sLegatEntity, oController) {
            if (sLegatEntity) {
                const sUri = `/node-api/initiate/getposition?entity=${encodeURIComponent(sLegatEntity)}&startDate=${encodeURIComponent(oStartDate)}`;
                const oModel = new JSONModel();
                oModel.loadData(sUri);
                oController.getView().setModel(oModel, "Position");
            }

        },
        _setLoggedUserDetails: function (oController, currentUserData) {
            const sInitails = currentUserData.firstName.charAt(0).toUpperCase() + currentUserData.lastName.charAt(0).toUpperCase();
            const LoggedUserName = currentUserData.firstName + " " + currentUserData.lastName;
            oController.setGlobalProperty("UIModel", "initialName", sInitails);
            oController.setGlobalProperty("UIModel", "loggedUserName", LoggedUserName);
            oController.setGlobalProperty("UIModel", "userId", currentUserData.name);
            oController.setGlobalProperty("UIModel", "onBehalf", currentUserData.onBehalf);
        },
        _setPickListUI: function (oController) {
            const oModel = new JSONModel();
            oModel.loadData("/node-api/getpicklist?name=GA_Type");
            oController.getView().setModel(oModel, "processType");
        }

    }

});
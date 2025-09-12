sap.ui.define([
    "com/exyte/gmui/utils/ApiHelper",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (ApiHelper,MessageToast,MessageBox) {
    "use strict";

    async function _fetchAndSet(oModel, sViewName, sPath, sUri) {
        try {
            const data = await ApiHelper.getData(sUri);
            oModel.setProperty(`/${sViewName}/${sPath}`, data);
        } catch (err) {
            console.error(`Error fetching ${sPath}:`, err);
        }
    }

    return {
        async setEmpData(oModel, sViewName, name) {
            let sUri = "/node-api/getemplist";
            if (name) {
                sUri += `?name=${name}`;
            }
            await _fetchAndSet(oModel, sViewName, "Employee", sUri);
        },

        async setManagerData(oModel, sViewName, name) {
            let sUri = "/node-api/gethostmanager";
            if (name) {
                sUri += `?manager=${name}`;
            }
            await _fetchAndSet(oModel, sViewName, "HostManager", sUri);
        },

        async getPosition(oModel, sViewName, oStartDate, sLegatEntity) {
            if (!sLegatEntity) return;
            const sUri = `/node-api/initiate/getposition?entity=${sLegatEntity}&startDate=${oStartDate}`;
            await _fetchAndSet(oModel, sViewName, "Position", sUri);
        },

        async getProjectData(oModel, sViewName, oStartDate) {
            const sUri = `/node-api/initiate/getproject?startDate=${oStartDate}`;
            await _fetchAndSet(oModel, sViewName, "ProjectData", sUri);
        },

        async setLoggedUserDetails(oModel) {
            try {
                const data = await ApiHelper.getData("/node-api/currentUser");
                const initials = `${data.firstName?.[0]?.toUpperCase() || ""}${data.lastName?.[0]?.toUpperCase() || ""}`;
                const loggedUserName = `${data.firstName || ""} ${data.lastName || ""}`.trim();

                oModel.setProperty("/initialName", initials);
                oModel.setProperty("/loggedUserName", loggedUserName);
                oModel.setProperty("/userId", data.name || "");
                oModel.setProperty("/onBehalf", data.onBehalf || false);
            } catch (err) {
                console.error("Error fetching logged user details:", err);
            }
        },

        async setPickListUI(oModel, sViewName) {
            const sUri = "/node-api/getpicklist?name=GA_Type";
            await _fetchAndSet(oModel, sViewName, "ProcessType", sUri);
        }, 
        async postInitiatonForm(sAction, payLoad) {
            const sUri = sAction === "D" ? "/node-api/initiate/draftInitiation" : "/node-api/initiate/submitInitiation"
            const data = await ApiHelper.postData(sUri,payLoad);
            if(sAction === "D") {
                 MessageToast.show("Application saved as draft successfully");
            }
            else {
                 MessageBox.success("You have successfully submitted initiation request.")
            }
        }
    };
});

sap.ui.define([
    "com/exyte/gmui/utils/ApiHelper",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
], function (ApiHelper,MessageToast,MessageBox) {
    "use strict";

    async function _fetchAndSet(_this, sViewName, sPath, sUri) {
        try {
            const data = await ApiHelper.getData(sUri);
            _this.setProperty(`/${sViewName}/${sPath}`, data);
        } catch (err) {
            console.error(`Error fetching ${sPath}:`, err);
        }
    }

    return {
        async setEmpData(_this, sViewName, name) {
            let sUri = "/node-api/getemplist";
            if (name) {
                sUri += `?name=${name}`;
            }
            await _fetchAndSet(_this, sViewName, "Employee", sUri);
        },

        async setManagerData(_this, sViewName, name) {
            let sUri = "/node-api/gethostmanager";
            if (name) {
                sUri += `?manager=${name}`;
            }
            await _fetchAndSet(_this, sViewName, "HostManager", sUri);
        },

        async getPosition(_this, sViewName, oStartDate, sLegatEntity) {
            if (!sLegatEntity) return;
            const sUri = `/node-api/initiate/getposition?entity=${sLegatEntity}&startDate=${oStartDate}`;
            await _fetchAndSet(_this, sViewName, "Position", sUri);
        },

        async getProjectData(_this, sViewName, oStartDate) {
            const sUri = `/node-api/initiate/getproject?startDate=${oStartDate}`;
            await _fetchAndSet(_this, sViewName, "ProjectData", sUri);
        },

        async setLoggedUserDetails(_this) {
            try {
                const data = await ApiHelper.getData("/node-api/currentUser");
                const initials = `${data.firstName?.[0]?.toUpperCase() || ""}${data.lastName?.[0]?.toUpperCase() || ""}`;
                const loggedUserName = `${data.firstName || ""} ${data.lastName || ""}`.trim();

                _this.setProperty("/initialName", initials);
                _this.setProperty("/loggedUserName", loggedUserName);
                _this.setProperty("/userId", data.name || "");
                _this.setProperty("/onBehalf", data.onBehalf || false);
            } catch (err) {
                console.error("Error fetching logged user details:", err);
            }
        },

        async setPickListUI(_this, sViewName) {
            const sUri = "/node-api/getpicklist?name=GA_Type";
            await _fetchAndSet(_this, sViewName, "ProcessType", sUri);
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
        },
        async readInitiation(_this,sViewName,processId) {
             const sUri = `/node-api/initiate/getInitiation?processId=${processId}`;
            await _fetchAndSet(_this, sViewName, "ProcessType", sUri);
        }
    };
});

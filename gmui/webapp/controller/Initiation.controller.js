sap.ui.define([
    "com/exyte/gmui/controller/BaseController",
    "com/exyte/gmui/utils/UiHelper",
    "com/exyte/gmui/utils/Formatter",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator"
], (BaseController, UiHelper, formatter, JSONModel, BusyIndicator) => {
    "use strict";

    return BaseController.extend("com.exyte.gmui.controller.Initiation", {
        formatter: formatter,
        onInit: async function () {            
            this._uiConfigModel = this.getOwnerComponent().getModel("UIModel");
            this.getRouter().getRoute("Initiation").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: async function () {
            this._uiConfigModel.setProperty("/formStatus", "ID");
            this._uiConfigModel.setProperty("/isForm", true);
            this._uiConfigModel.setProperty("/formTitle", "Inititation Form");
            const currentUserResponse = await fetch("/node-api/currentUser", { credentials: "include" });
            const currentUserData = await currentUserResponse.json();
            UiHelper._setLoggedUserDetails(this, currentUserData);
            UiHelper._setEmpData(this._uiConfigModel);
            await UiHelper._setManagerData(this._uiConfigModel);
            UiHelper._setPickListUI(this);
            this._createFormModel();

        },
        _createFormModel: function () {
            
            const object = {
                cust_StartMinDate: new Date(),
                cust_ProcessType: "",
                cust_HostManager: this.getGlobalProperty("UIModel", "userId",),
                cust_EmpId: "",
                cust_HomeUserId: "",
                cust_StartDate: "",
                cust_EndDate: "",
                cust_HostPosition: "",
                cust_Project: null,
                cust_Status: "",
                cust_HostLegalEntity:""
            };
            this.setGlobalProperty("UIModel", "initiateForm", object);
        },

        /**
         * Filter the Employee Data Based on User Input
         * Returns Filter Data in Combobox 
         */
        onSearchEmpCombobox: async function (oEvent) {
            try {
                const sValue = oEvent.getParameter("value");
                if (sValue.includes("-")) {
                    return;
                }
                UiHelper._setEmpData(this._uiConfigModel, sValue);
            } finally {
                const oComboBox = oEvent.getSource();
                // Get results length from model
                const aResults = this._uiConfigModel.getProperty("/User") || [];
                if (aResults.length > 0 && !oComboBox.isOpen()) {
                    oComboBox.open();
                }
            }
        },

        /**
         * Filter the Employee Data Based on User Input
         * Returns Filter Data in Combobox 
         */
        onSearchHostManagerCombobox: async function (oEvent) {
            try {
                const sValue = oEvent.getParameter("value");
                if (sValue.includes("-")) {
                    return;
                }
                UiHelper._setManagerData(this._uiConfigModel, sValue);
            } finally {
                const oComboBox = oEvent.getSource();
                // Get results length from model
                const aResults = this._uiConfigModel.getProperty("/User") || [];
                if (aResults.length > 0 && !oComboBox.isOpen()) {
                    oComboBox.open();
                }
            }
        },
        /**
         * Auto fill Person Id, Job Title, Department,Legal Entity, Country, Hire Date
         */
        onSelectEmployee: function (oEvent) {
            const oSelectedObject = oEvent.getParameter("selectedItem").getBindingContext("UIModel").getObject();
            this.setGlobalProperty("UIModel", "initiateForm/cust_HomeCountry", oSelectedObject.userNav.country);
            this.setGlobalProperty("UIModel", "initiateForm/cust_EmpId", oSelectedObject.employmentNav.personIdExternal);
            this.setGlobalProperty("UIModel", "initiateForm/cust_HireDate", oSelectedObject.employmentNav.startDate);
            this.setGlobalProperty("UIModel", "initiateForm/cust_Title", oSelectedObject.jobTitle);
            this.setGlobalProperty("UIModel", "initiateForm/cust_Department", oSelectedObject.departmentNav.name);
            this.setGlobalProperty("UIModel", "initiateForm/cust_LegalEntity", oSelectedObject.company);
             this.setGlobalProperty("UIModel", "initiateForm/cust_EmpName", oSelectedObject.userNav.displayName);
            if(oSelectedObject.custom04) {
                const sEnitiyId = oSelectedObject["custom04"].match(/\(([^)]+)\)/g).map(m => m.slice(1, -1));
                this.setGlobalProperty("UIModel", "initiateForm/cust_LegalEntityId", sEnitiyId[0]);
            }
        },

        /** 
        * Set Min Date of End Date
        * Set Postion Data on Combobox
        */
        onChangeStartDate: async function (oEvent) {
            let selectedDate = oEvent.getSource().getDateValue();
            if (selectedDate) {
                BusyIndicator.show(0);
                //Set Minimum Date of End Date
                let oMinEndDate = new Date(selectedDate);
                oMinEndDate.setDate(oMinEndDate.getDate() + 1); 
                this.setGlobalProperty("UIModel", "initiateForm/cust_EndMindate", oMinEndDate);
                //Clear the End Date and position
                this.setGlobalProperty("UIModel", "initiateForm/cust_EndDate", null);
                this.setGlobalProperty("UIModel", "initiateForm/cust_HostPosition", "");
                // Get the Posotion based on Start Date Selected
                await UiHelper._getPosition(selectedDate, this.getGlobalProperty("UIModel", "initiateForm/cust_HostLegalEntity"), this);
                // Process Type is Project get the Project data
                if(this._uiConfigModel.getProperty("/initiateForm/cust_ProcessType") === "P") {
                    await UiHelper._getProjectData(selectedDate, this);
                }
                BusyIndicator.hide();
            }
        },
        onSelectHostManager: function (oEvent) {
            if (oEvent.getParameter("selectedItem") === null) {
                UiHelper._setManagerData(this._uiConfigModel, "");
                return;
            }
            const oSelectedObject = oEvent.getParameter("selectedItem").getBindingContext("UIModel").getObject();
            this.setGlobalProperty("UIModel", "initiateForm/cust_HostPosition", "");
            if(oSelectedObject.company) {
                this.setGlobalProperty("UIModel", "initiateForm/cust_HostLegalEntity", oSelectedObject.company);
            }
            // this.setGlobalProperty("UIModel", "initiateForm/cust_HostLegalEntity", oSelectedObject.custom04);
        },
        onSelectPosition: function (oEvent) {
            const oSelectedObject = oEvent.getParameter("selectedItem").getBindingContext("Position").getObject();
            this.setGlobalProperty("UIModel", "initiateForm/cust_HostCountry", oSelectedObject.companyNav.country);
        }



    });
});
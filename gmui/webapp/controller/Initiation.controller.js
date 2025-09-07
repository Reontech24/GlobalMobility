sap.ui.define([
    "com/exyte/gmui/controller/BaseController",
    "com/exyte/gmui/utils/UiHelper",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator"
], (BaseController, UiHelper, JSONModel, BusyIndicator) => {
    "use strict";

    return BaseController.extend("com.exyte.gmui.controller.Initiation", {
        onInit: async function () {
            this._oDataModel = this.getOwnerComponent().getModel();
            this._uiConfigModel = this.getOwnerComponent().getModel("UIModel");
            this.getRouter().getRoute("Initiation").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: async function () {
            this.getModel("UIModel").setProperty("/isForm", true);
            const currentUserResponse = await fetch("/node-api/currentUser", { credentials: "include" });
            const currentUserData = await currentUserResponse.json();
            UiHelper._setLoggedUserDetails(this, currentUserData);
            UiHelper._setEmpData(this._uiConfigModel);
            UiHelper._setManagerData(this._uiConfigModel);
            this._createFormModel();

        },
        _createFormModel: function () {
            const object = {
                effectiveStartDate: "/Date(#)/".replace('#', new Date().getTime()),
                cust_Action: "I",
                cust_ProcessType: "",
                cust_Initiator: "",
                cust_HostManager: this.getGlobalProperty("UIModel", "userId",),
                cust_EmpId: "",
                cust_HomeUserId: "",
                cust_StartDate: "",
                cust_EndDate: "",
                cust_HostPosition: "",
                cust_Project: "",
                cust_Status: "",
                cust_StartMinDate: new Date()
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
            this.setGlobalProperty("UIModel", "initiateForm/cust_HomeCountry", oSelectedObject.country);
            this.setGlobalProperty("UIModel", "initiateForm/cust_EmpId", oSelectedObject.personKeyNav.personIdExternal);
            this.setGlobalProperty("UIModel", "initiateForm/cust_HireDate", oSelectedObject.hireDate);
            this.setGlobalProperty("UIModel", "initiateForm/cust_Title", oSelectedObject.title);
            this.setGlobalProperty("UIModel", "initiateForm/cust_Department", oSelectedObject.department);
            this.setGlobalProperty("UIModel", "initiateForm/cust_LegalEntity", oSelectedObject.custom04);
        },

        /** 
        * Set Min Date of End Date
        * Set Postion Data on Combobox
        */
        onChangeStartDate: async function (oEvent) {
            let selectedDate = oEvent.getSource().getDateValue();
            if (selectedDate) {
                BusyIndicator.show(0);
                let oMinEndDate = new Date(selectedDate);
                oMinEndDate.setDate(oMinEndDate.getDate() + 1);
                this.setGlobalProperty("UIModel", "initiateForm/cust_EndMindate", oMinEndDate);
                this.setGlobalProperty("UIModel", "initiateForm/cust_EndDate", null);
                const aPosition = await UiHelper._getPosition(selectedDate, this.getViewProperty("UIModel", "host_LegalEntity"), this._oDataModel,);
                this._uiConfigModel.setProperty("/Positions", aPosition)
                BusyIndicator.hide();
            }
        }



    });
});
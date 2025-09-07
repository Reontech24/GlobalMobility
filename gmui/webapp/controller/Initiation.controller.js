sap.ui.define([
    "com/exyte/gmui/controller/BaseController",
    "com/exyte/gmui/utils/UiHelper",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator"
], (BaseController, UiHelper, JSONModel, BusyIndicator) => {
    "use strict";

    return BaseController.extend("com.exyte.gmui.controller.Initiation", {
        onInit() {
            this._oDataModel = this.getOwnerComponent().getModel();
            this._uiConfigModel = this.getOwnerComponent().getModel("UIModel");

            this.getRouter().getRoute("RouteInitiation").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: async function () {
            UiHelper._setEmployeeFilterData(this._uiConfigModel);          
            this._createFormModel();

        },
        _createFormModel: function () {
            const object = {
                effectiveStartDate: "/Date(#)/".replace('#', new Date().getTime()),
                cust_Action: "I",
                cust_ProcessType: "",
                cust_Initiator: "",
                cust_HostManager: "",
                cust_EmpId: "",
                cust_HomeUserId: "",
                cust_StartDate: "",
                cust_EndDate: "",
                cust_HostPosition: "",
                cust_Project: "",
                cust_Status: "",
                cust_StartMinDate: new Date()
            };
            const oModel = new JSONModel(object);
            this.setModel(oModel, "FormData");
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
                 UiHelper._setEmployeeFilterData(this._uiConfigModel,sValue); 
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
            this.setViewProperty("FormData", "cust_HomeCountry", oSelectedObject.country);
            this.setViewProperty("FormData", "cust_EmpId", oSelectedObject.personKeyNav.personIdExternal);
            this.setViewProperty("FormData", "cust_HireDate", oSelectedObject.hireDate);
            this.setViewProperty("FormData", "cust_Title", oSelectedObject.title);
            this.setViewProperty("FormData", "cust_Department", oSelectedObject.department);
            this.setViewProperty("FormData", "cust_LegalEntity", oSelectedObject.custom04);
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
                this.setViewProperty("FormData", "cust_EndMindate", oMinEndDate);
                this.setViewProperty("FormData", "cust_EndDate", null);
                const aPosition = await UiHelper._getPosition(selectedDate, this.getViewProperty("FormData", "cust_LegalEntity"), this._oDataModel,);
                this._uiConfigModel.setProperty("/Positions", aPosition)
                BusyIndicator.hide();
            }
        }



    });
});
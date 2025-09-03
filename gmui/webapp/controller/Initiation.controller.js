sap.ui.define([
    "com/exyte/gmui/controller/BaseController",
    "com/exyte/gmui/utils/UiHelper",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel"
], (BaseController, UiHelper, FilterOperator, Filter, JSONModel) => {
    "use strict";

    return BaseController.extend("com.exyte.gmui.controller.Initiation", {
        onInit() {
            this._oDataModel = this.getOwnerComponent().getModel();
            this._uiConfigModel = this.getOwnerComponent().getModel("UIModel");
            this.getRouter().getRoute("RouteInitiation").attachPatternMatched(this._onRouteMatched, this);
            // fetch("/node-api/getemplist")
            //     .then(res => res.json())
            //     .then(data => {

            //     })
            //     .catch(err => console.error("Error fetching data:", err));
            this.byId("initiateEmpName").fireArrowPress();
            this._createFormModel();

        },
        _onRouteMatched: function () {

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
        empNameOpenComboBox: async function (oEvent) {
            try {
                await UiHelper._setEmployeeFilterData(
                    oEvent,
                    [],
                    this._oDataModel,
                    this._uiConfigModel
                );
            } finally {

            }
        },
        onSearchEmpCombobox: async function (oEvent) {
            try {
                const sValue = oEvent.getParameter("value");
                if (sValue.includes("-")) {
                    return;
                }
                const oFilter = new Filter({
                    filters: [
                        new Filter("displayName", FilterOperator.Contains, sValue),
                        new Filter("department", FilterOperator.Contains, sValue)
                    ],
                    and: false
                });

                // Fetch filtered data
                await UiHelper._setEmployeeFilterData(
                    oEvent,
                    [oFilter],
                    this._oDataModel,
                    this._uiConfigModel
                );

            } finally {
                const oComboBox = oEvent.getSource();
                // Get results length from model
                const aResults = this._uiConfigModel.getProperty("/User") || [];

                if (aResults.length > 0 && !oComboBox.isOpen()) {
                    oComboBox.open();
                }
            }
        },
        onSelectEmployee: function (oEvent) {
            const oSelectedObject = oEvent.getParameter("selectedItem").getBindingContext("UIModel").getObject();
            this.setViewProperty("FormData", "cust_HomeCountry", oSelectedObject.country);
            this.setViewProperty("FormData", "cust_EmpId", oSelectedObject.personKeyNav.personIdExternal);
            this.setViewProperty("FormData", "cust_HireDate", oSelectedObject.hireDate);
            this.setViewProperty("FormData", "cust_Title", oSelectedObject.title);
            this.setViewProperty("FormData", "cust_Department", oSelectedObject.department);
            this.setViewProperty("FormData", "cust_LegalEntity", oSelectedObject.custom04);

        },
        onChangeStartDate: async function (oEvent) {
            let selectedDate = oEvent.getSource().getDateValue();
            if (selectedDate) {
                let oMinEndDate = new Date(selectedDate);
                oMinEndDate.setDate(oMinEndDate.getDate() + 1);
                this.setViewProperty("FormData", "cust_EndMindate", oMinEndDate);
                this.setViewProperty("FormData", "cust_EndDate", null);
                const aPosition = await UiHelper._getPosition(selectedDate);
            }
        },
        onSelectEndDate: function () {
            const oStartDate = this.getId()
            // Construct filters
            var aFilters = [
                new Filter("vacant", sap.ui.model.FilterOperator.EQ, true),
                new Filter("effectiveStatus", sap.ui.model.FilterOperator.EQ, "A"),
                new Filter("cust_currentIncumbent", sap.ui.model.FilterOperator.EQ, null),
                new Filter("companyNav/name", sap.ui.model.FilterOperator.EQ, this.getView().getModel("FormData").getProperty("/cust_LegalEntity")),
                new Filter("effectiveStartDate", sap.ui.model.FilterOperator.LE, sToday),
                new Filter("effectiveEndDate", sap.ui.model.FilterOperator.GE, sToday)
            ];
        }


    });
});
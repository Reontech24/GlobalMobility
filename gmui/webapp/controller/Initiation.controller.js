sap.ui.define([
    "com/exyte/gmui/controller/BaseController",
    "com/exyte/gmui/utils/UiHelper",
    "com/exyte/gmui/utils/Formatter",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageBox"
], (BaseController, UiHelper, formatter, BusyIndicator,MessageBox) => {
    "use strict";

    return BaseController.extend("com.exyte.gmui.controller.Initiation", {
        formatter: formatter,
        onInit: async function () {
            this.getRouter().getRoute("Initiation").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: async function () {
            BusyIndicator.show(0);
            // Handle the header of the form
            this.setProperty("/formStatus", "ID");
            this.setProperty("/isForm", true);
            this.setProperty("/formTitle", "Inititation Form");
            await UiHelper.setLoggedUserDetails(this);
            await UiHelper.setEmpData(this, "Initiation");
            UiHelper.setManagerData(this, "Initiation");
            UiHelper.setPickListUI(this,"Initiation");
            this._createFormModel();
            BusyIndicator.hide();

        },
        _createFormModel: function () {
            const object = {
                cust_StartMinDate: new Date(),
                cust_ProcessType: "",
                cust_HostManager: this.getProperty("userId",),
                cust_EmpId: "",
                cust_HomeUserId: "",
                cust_StartDate: "",
                cust_EndDate: "",
                cust_HostPosition: "",
                cust_Project: null,
                cust_Status: "",
                cust_HostLegalEntity: ""
            };
            this.setProperty("/initiateForm", object);
        },

        /**
         * Filter the Employee Data Based on User Input
         * Returns Filter Data in Combobox 
         */
        onSearchEmpCombobox: async function (oEvent) {
            try {
                const sValue = oEvent.getParameter("value");
                UiHelper.setEmpData(this, "Initiation", sValue);
            } finally {

            }
        },

        /**
         * Filter the Employee Data Based on User Input
         * Returns Filter Data in Combobox 
         */
        onSearchHostManagerCombobox: async function (oEvent) {
            const sValue = oEvent.getParameter("value");
            UiHelper.setManagerData(this, "Initiation", sValue);
        },
        /**
         * Auto fill Person Id, Job Title, Department,Legal Entity, Country, Hire Date
         */
        onSelectEmployee: function (oEvent) {
            const oSelectedObject = oEvent.getParameter("selectedItem").getBindingContext().getObject();
            this.setProperty("/initiateForm/cust_HomeCountry", oSelectedObject.userNav.country);
            this.setProperty("/initiateForm/cust_HomeCountryCode", oSelectedObject.countryOfCompany);
            this.setProperty("/initiateForm/cust_EmpId", oSelectedObject.employmentNav.personIdExternal);
            this.setProperty("/initiateForm/cust_HireDate", oSelectedObject.employmentNav.startDate);
            this.setProperty("/initiateForm/cust_Title", oSelectedObject.jobTitle);
            this.setProperty("/initiateForm/cust_Department", oSelectedObject.departmentNav.name);
            this.setProperty("/initiateForm/cust_LegalEntity", oSelectedObject.company);
            this.setProperty("/initiateForm/cust_LegalEntityName", oSelectedObject.companyNav?.name);
            this.setProperty("/initiateForm/cust_EmpName", oSelectedObject.userNav.displayName);            
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
                this.setProperty("/initiateForm/cust_EndMindate", oMinEndDate);
                //Clear the End Date and position
                this.setProperty("/initiateForm/cust_EndDate", null);
                this.setProperty("/initiateForm/cust_HostPosition", "");
                // Get the Posotion based on Start Date Selected
                await UiHelper.getPosition(this,"Initiation" ,selectedDate, this.getProperty("/initiateForm/cust_HostLegalEntity"));
                // Process Type is Project get the Project data
                if (this.getProperty("/initiateForm/cust_ProcessType") === "P") {
                    await UiHelper.getProjectData(this,"Initiation",selectedDate);
                }
                BusyIndicator.hide();
            }
        },
        onSelectHostManager: function (oEvent) {
            // if (oEvent.getParameter("selectedItem") === null) {
            //     UiHelper._setManagerData(this._uiConfigModel, "");
            //     return;
            // }
            const oSelectedObject = oEvent.getParameter("selectedItem").getBindingContext().getObject();
            this.setProperty("/initiateForm/cust_HostPosition", "");
            if (oSelectedObject.company) {
                this.setProperty("/initiateForm/cust_HostLegalEntity", oSelectedObject.company);
                this.setProperty("/initiateForm/cust_HostLegalEntityName", oSelectedObject.companyNav?.name);
            }
            // this.setProperty("initiateForm/cust_HostLegalEntity", oSelectedObject.custom04);
        },
        onSelectPosition: function (oEvent) {
            const oSelectedObject = oEvent.getParameter("selectedItem").getBindingContext().getObject();
            this.setProperty("/initiateForm/cust_HostCountry", oSelectedObject.companyNav.country);
        },
        onPressDraft: function () {
            const oFormData = this.getProperty("/initiateForm");
           UiHelper.postInitiatonForm("D",oFormData);
        },
        onPressSubmit: function () {
            MessageBox.confirm(
                "Are you sure you want to submit? \n If yes, initiation will be sent to the home manager for approval",
                {
                    icon: MessageBox.Icon.CONFIRM,
                    title: "Confirmation",
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    initialFocus: MessageBox.Action.CANCEL,
                    onClose: async function (sAction) {
                        if (sAction === "YES") {
                            BusyIndicator.show(0);
                            const oFormData = this.getProperty("/initiateForm");
                            oFormData.appUrl = window.location.origin + window.location.pathname
                             await UiHelper.postInitiatonForm("S",oFormData);
                              BusyIndicator.hide(0);
                        }
                    }.bind(this),
                    dependentOn: this.getView()
                }
            );

        }



    });
});
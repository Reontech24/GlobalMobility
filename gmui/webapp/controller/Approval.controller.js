sap.ui.define([
    "com/exyte/gmui/controller/BaseController",
    "com/exyte/gmui/utils/UiHelper",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel"
], (BaseController, UiHelper, FilterOperator, Filter, JSONModel) => {
    "use strict";

    return BaseController.extend("com.exyte.gmui.controller.Approval", {
        onInit: function () {           
            this.getRouter().getRoute("Approval").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            this.setProperty("/formStatus", "PI");
            this.setProperty("/isForm", true);
            this.setProperty("/formTitle", "Approval Form");
            const argument = oEvent.getParameters().arguments;
            this._readInitiation(argument.processId);
        },
        _readInitiation: function(processId) {

        }

    });
});
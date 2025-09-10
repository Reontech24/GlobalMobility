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
            this._oDataModel = this.getOwnerComponent().getModel();
            this._uiConfigModel = this.getOwnerComponent().getModel("UIModel");
            this.getRouter().getRoute("Approval").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            this._uiConfigModel.setProperty("/formStatus", "PI");
            this._uiConfigModel.setProperty("/isForm", true);
            this._uiConfigModel.setProperty("/formTitle", "Approval Form");
            const argument = oEvent.getParameters().arguments;
            this._readInitiation(argument.processId);
        },
        _readInitiation: function(processId) {

        }

    });
});
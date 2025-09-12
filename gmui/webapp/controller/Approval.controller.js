sap.ui.define([
    "com/exyte/gmui/controller/BaseController",
    "com/exyte/gmui/utils/ApiHelper",
    "com/exyte/gmui/utils/Formatter",
    "sap/ui/core/BusyIndicator"
], (BaseController, ApiHelper, formatter, BusyIndicator) => {
    "use strict";

    return BaseController.extend("com.exyte.gmui.controller.Approval", {
        formatter: formatter,
        onInit: function () {
            this.getRouter().getRoute("Approval").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function (oEvent) {
            BusyIndicator.show(0);
            this.setProperty("/formStatus", "PI");
            this.setProperty("/isForm", true);
            this.setProperty("/formTitle", "Approval Form");
            const argument = oEvent.getParameters().arguments;
            this.readInitiation(argument.processId);
        },
        readInitiation: async function (processId) {
            const sUri = `/node-api/initiate/getInitiation?processId=${processId}`;
            const data = await ApiHelper.getData(sUri);
            this.setProperty("/Approval", data);
            BusyIndicator.hide();
        }

    });
});
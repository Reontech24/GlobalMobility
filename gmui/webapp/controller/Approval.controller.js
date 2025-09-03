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
            this.getRouter().getRoute("RouteApproval").attachPatternMatched(this._onRouteMatched, this);
        },
        _onRouteMatched: function () {

        },

    });
});
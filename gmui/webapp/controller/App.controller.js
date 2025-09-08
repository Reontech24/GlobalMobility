sap.ui.define([
  "com/exyte/gmui/controller/BaseController",
  "com/exyte/gmui/utils/UiHelper"
], (BaseController, UiHelper) => {
  "use strict";

  return BaseController.extend("com.exyte.gmui.controller.App", {
    onInit: async function () {

    },
    onAfterRendering: function () {
      var oProcessFlow = this.byId("idProcessFlow");
      setTimeout(function () {
        oProcessFlow.setZoomLevel(sap.suite.ui.commons.ProcessFlowZoomLevel.One);
      }, 0);
    },
    onLanePress: function (oEvent) {

    },
    onPressDraft: function () {
      const oFormData = this.getGlobalProperty("UIModel", "initiateForm");
      $.ajax({
        url: "/node-api/initiate/upsertInitiation",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(oFormData),
        success: function (data) {
          sap.m.MessageToast.show("Upsert Success!");
        },
        error: function (err) {
          sap.m.MessageToast.show("Error: " + err.responseText);
        }
      });
    }
  });
});
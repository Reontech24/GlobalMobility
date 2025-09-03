sap.ui.define([
  "com/exyte/gmui/controller/BaseController"
], (BaseController) => {
  "use strict";

  return BaseController.extend("com.exyte.gmui.controller.App", {
    onInit() {
    },
    onAfterRendering: function () {
      var oProcessFlow = this.byId("idProcessFlow");
      setTimeout(function () {
        oProcessFlow.setZoomLevel(sap.suite.ui.commons.ProcessFlowZoomLevel.One);
      }, 0);
    },
    onPress: function () {
      this.byId("idProcessFlow").zoomIn();
    },
    onLanePress: function (oEvent) {

    }
  });
});
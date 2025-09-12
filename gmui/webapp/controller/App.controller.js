sap.ui.define([
  "com/exyte/gmui/controller/BaseController",
  "com/exyte/gmui/utils/UiHelper",
  "sap/m/MessageBox",
   "sap/ui/core/BusyIndicator"
], (BaseController, UiHelper, MessageBox,BusyIndicator) => {
  "use strict";
var sResponsivePaddingClasses = "sapUiResponsivePadding--header sapUiResponsivePadding--content sapUiResponsivePadding--footer";
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
    
  });
});
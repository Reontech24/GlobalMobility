sap.ui.define([
  "com/exyte/gmui/controller/BaseController",
  "com/exyte/gmui/utils/UiHelper"
], (BaseController,UiHelper) => {
  "use strict";

  return BaseController.extend("com.exyte.gmui.controller.App", {
    onInit: async function() {
       const currentUserResponse = await fetch("/node-api/currentUser", { credentials: "include" });
       const currentUserData = await currentUserResponse.json();
      UiHelper._setLoggedUserDetails(this,currentUserData);
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
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
    onPressDraft: function () {
      const oFormData = this.getGlobalProperty("UIModel", "initiateForm");
      $.ajax({
        url: "/node-api/initiate/draftInitiation",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(oFormData),
        success: function (data) {
          sap.m.MessageToast.show("Application saved as draft successfully");
        },
        error: function (err) {
          sap.m.MessageToast.show("Error: " + err.responseText);
        }
      });
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
          styleClass: sResponsivePaddingClasses,
          onClose: function (sAction) {
            if (sAction === "YES") {
              BusyIndicator.show(0);
              const oFormData = this.getGlobalProperty("UIModel", "initiateForm");
              oFormData.appUrl = window.location.origin + window.location.pathname
              $.ajax({
                url: "/node-api/initiate/submitInitiation",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(oFormData),
                success: function (data) {
                  BusyIndicator.hide();
                  MessageBox.success("You have successfully submitted initiation request.")
                },
                error: function (err) {
                  BusyIndicator.hide();
                  sap.m.MessageToast.show("Error: " + err.responseText);
                }
              });
            }
          }.bind(this),
          dependentOn: this.getView()
        }
      );

    }
  });
});
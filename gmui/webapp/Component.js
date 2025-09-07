sap.ui.define([
    "sap/ui/core/UIComponent",
    "com/exyte/gmui/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("com.exyte.gmui.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // set the device model
            this.setModel(models.createDeviceModel(), "device");
            var oRouter = this.getRouter();
            var oTargets = this.getMetadata().getManifestEntry("sap.ui5").routing.targets;

            oRouter.attachBeforeRouteMatched(function (oEvent) {
                var sRouteName = oEvent.getParameter("name");
                var oTargetConfig = oTargets[sRouteName];

                if (oTargetConfig && oTargetConfig.options && oTargetConfig.options.requiredRoles) {
                    var aRequiredRoles = oTargetConfig.options.requiredRoles;
                    var aUserRoles = this.getModel("UIModel").getProperty("/roles") || [];

                    var bAuthorized = aRequiredRoles.some(role => aUserRoles.includes(role));

                    // if (!bAuthorized) {
                    //     this.getModel("UIModel").setProperty("/isForm",false);
                    //     // Stop navigation and redirect
                    //     setTimeout(() => {
                    //         oRouter.navTo("Unauthorized");
                    //     }, 0);
                    // }
                }
            }.bind(this));

            // enable routing
            this.getRouter().initialize();
        }
    });
});
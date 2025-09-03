sap.ui.define([
    "sap/m/ComboBox"
], function (ComboBox) {
    "use strict";

    return ComboBox.extend("com.exyte.gmui.controls.extComboBox", {
        metadata: {
            events: {
                "searchBackend": {},
                "arrowPress": {}
            }
        },

        renderer: {},

        oninput: function (oEvent) {
            ComboBox.prototype.oninput.apply(this, arguments);
            var sValue = oEvent.target.value;
            if (sValue && sValue.length > 0) {
                this.fireSearchBackend({ value: sValue });
            }
        },
        onAfterRendering: function () {
            ComboBox.prototype.onAfterRendering.apply(this, arguments);
            var that = this;
            var oArrow = this.$().find(".sapUiIcon"); 
            if (oArrow.length) {
                oArrow.off("click.customArrowPress").on("click.customArrowPress", function (oEvent) {
                    that.fireArrowPress({ originalEvent: oEvent });
                });
            }
        }
    });
});
sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.exyte.gmui.controller.Initiation", {
        onInit() {
            fetch("/node-api/getemplist")
                .then(res => res.json())
                .then(data => {

                })
                .catch(err => console.error("Error fetching data:", err));
        
        }
    });
});
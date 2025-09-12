sap.ui.define([
	"sap/ui/core/mvc/Controller",
], function (Controller) {
	"use strict";

	return Controller.extend("com.exyte.gmui.controller.BaseController", {
		onInit: function() {			 
		},
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		getModel: function () {
			return this.getOwnerComponent().getModel();
		},		
		getId: function (sName) {
			return this.getView().byId(sName);
		},			
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},		
		getProperty:function(sProperty) {
			return this.getOwnerComponent().getModel().getProperty(sProperty);
		},
		setProperty:function(sProperty,sValue) {
			return this.getOwnerComponent().getModel().setProperty(sProperty,sValue);
		}
    });
});
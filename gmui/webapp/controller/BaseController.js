sap.ui.define([
	"sap/ui/core/mvc/Controller",
], function (Controller) {
	"use strict";

	return Controller.extend("com.exyte.gmui.controller.BaseController", {
		onInit: function() {
			 this._oDataModel = this.getOwnerComponent().getModel();
            this._uiConfigModel = this.getOwnerComponent().getModel("UIModel");
		},
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},
		getId: function (sName) {
			return this.getView().byId(sName);
		},
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		getViewProperty:function(oModel,sProperty) {
			return this.getView().getModel(oModel).getProperty("/"+sProperty);
		},
		setViewProperty:function(oModel,sProperty,sValue) {
			return this.getView().getModel(oModel).setProperty("/"+sProperty,sValue);
		},
		getGlobalProperty:function(oModel,sProperty) {
			return this.getView().getModel(oModel).getProperty("/"+sProperty);
		},
		setGlobalProperty:function(oModel,sProperty,sValue) {
			return this.getView().getModel(oModel).setProperty("/"+sProperty,sValue);
		}
    });
});
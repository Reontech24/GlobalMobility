/*global QUnit*/

sap.ui.define([
	"com/exyte/gmui/controller/Initiation.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Initiation Controller");

	QUnit.test("I should test the Initiation controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});

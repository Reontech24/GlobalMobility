sap.ui.define([
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
], function (FilterOperator, Filter) {
    "use strict";

    return {
        _getEmployeeParameter: function (oUIModel, isFilterable) {
            const aFilters = [];
            if (isFilterable) {
                aFilters.push(new Filter({
                    filters: [
                        new Filter("displayName", FilterOperator.Contains, isFilterable),
                        new Filter("department", FilterOperator.Contains, isFilterable)
                    ],
                    and: false
                }))
            }
            return {
                urlParameters: {
                    "$select": oUIModel.getProperty("/selectEmpInititaionFilter").join(","),
                    "$expand": "personKeyNav",
                    "$orderby": "displayName"
                },
                filters: aFilters || []

            }
        },
        _getPositionParameter: function (oStartDate, sLegatEntity) {
            const sEnitiyId = sLegatEntity.match(/\(([^)]+)\)/g).map(m => m.slice(1, -1));
            const aFilters = [
                new Filter("vacant", FilterOperator.EQ, true),
                new Filter("effectiveStatus", FilterOperator.EQ, "A"),
                new Filter("cust_currentIncumbent", FilterOperator.EQ, null),
                new Filter("company", FilterOperator.EQ, sEnitiyId),
                new Filter("effectiveStartDate", FilterOperator.LE, oStartDate),
                new Filter("effectiveEndDate", FilterOperator.GE, oStartDate)
            ];
            return {
                urlParameters: {
                    "$select": "code,externalName_en_US"
                },
                filters: aFilters || []
            }
        }
    }

});
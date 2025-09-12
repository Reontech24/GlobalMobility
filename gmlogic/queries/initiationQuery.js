// Initiation View Queries
module.exports = {
    processApproveQuery: {
        $select: [
            "cust_EmpId",
            "cust_EndDate",
            "cust_HomeMgrId",
            "cust_HomeUserIdNav/displayName",
            "cust_HomeUserIdNav/country",
            "cust_HomeUserIdNav/firstName",
             "cust_HomeUserIdNav/lastName",
            "cust_HomeUserIdNav/empInfo/jobInfoNav/companyNav/name",
            "cust_HomeUserIdNav/empInfo/jobInfoNav/countryOfCompany",
            "cust_HomeUserIdNav/empInfo/jobInfoNav/departmentNav/name",
            "cust_HomeUserIdNav/empInfo/jobInfoNav/jobTitle",
            "cust_HomeUserIdNav/empInfo/startDate",
            "cust_HostManagerNav/displayName",
            "cust_HostPositionNav/externalName_en_US",
            "cust_ProcessTypeNav/label_en_US",
            "cust_ProcessTypeNav/externalCode",
            "cust_ProjectNav/externalName",
            "cust_RejectionComments",
            "cust_StartDate",
            "cust_status",
            "effectiveStartDate",
            "externalCode",
            "lastModifiedByNav/displayName",
            "lastModifiedDateTime"
        ].join(","),
        $expand: [
            "cust_HomeUserIdNav/empInfo/jobInfoNav/companyNav",
            "cust_HomeUserIdNav/empInfo/jobInfoNav/departmentNav",
            "cust_HostManagerNav",
            "cust_HostPositionNav",
            "cust_ProcessTypeNav",
            "cust_ProjectNav",
            "lastModifiedByNav"
        ].join(",")
    }
}
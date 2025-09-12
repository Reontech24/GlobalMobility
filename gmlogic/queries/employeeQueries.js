module.exports = { 
  employeeNameQuery: {
    $select: [
      "company",
      "companyNav/name",
      "userNav/country",
      "departmentNav/name",
      "employmentNav/personIdExternal",
      "employmentNav/startDate",
      "jobTitle",
      "countryOfCompany",
      "userId",
     "userNav/displayName"
    ].join(","),
    $expand: "departmentNav,employmentNav,userNav,companyNav",
    $orderby: "userNav/displayName",
    $top: 50
  },
  hostManagerQuery: {
    $select: [
     "company",
     "userId",
     "companyNav/name",
     "userNav/displayName"
    ].join(","),
    $orderby: "userNav/displayName",
    $expand:"userNav,companyNav",
    $top: 1000
  }
};

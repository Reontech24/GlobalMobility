module.exports = { 
  employeeNameQuery: {
    $select: [
      "company",
      "userNav/country",
      "departmentNav/name",
      "employmentNav/personIdExternal",
      "employmentNav/startDate",
      "jobTitle",
      "userId",
     "userNav/displayName"
    ].join(","),
    $expand: "departmentNav,employmentNav,userNav",
    $orderby: "userNav/displayName",
    $top: 50
  },
  hostManagerQuery: {
    $select: [
     "company",
     "userId",
     "userNav/displayName"
    ].join(","),
    $orderby: "userNav/displayName",
    $expand:"userNav",
    $top: 1000
  }
};

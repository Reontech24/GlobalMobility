module.exports = { 
  employeeNameQuery: {
    $select: [
      "userId",
      "country",
      "custom04",
      "custom06",
      "custom10",
      "department",
      "displayName",
      "hireDate",
      "title",
      "personKeyNav/personIdExternal"
    ].join(","),
    $expand: "personKeyNav",
    $orderby: "displayName",
    $top: 100
  },
  hostManagerQuery: {
    $select: [
      "userId",     
      "custom04",
      "custom06",
      "custom10",     
      "displayName",
    ].join(","),
    $orderby: "displayName",
    $top: 100
  }
};

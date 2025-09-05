module.exports = {
  employeeListQuery: {
    $select: ["userId", "firstName", "lastName"].join(","),
    $top: 100
  }
};

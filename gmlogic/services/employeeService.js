const { callDestination } = require("./httpClient");
const { employeeListQuery } = require("../queries/employeeQueries");

async function fetchEmployees(req) {
  return callDestination(req, "SF_API", {
    url: "/odata/v2/User",
    params: employeeListQuery
  });
}

module.exports = { fetchEmployees };

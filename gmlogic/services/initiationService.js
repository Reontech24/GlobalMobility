const { callDestination } = require("./httpClient");
const { employeeListQuery } = require("../queries/initiationQuery");

async function fetchEmployees(req, limit = 10) {
  return callDestination(req, "SF_API", {
    url: "/odata/v2/User",
    params: { ...employeeListQuery, $top: limit }
  });
}

module.exports = { fetchEmployees };
const { callDestination } = require("./httpClient");
const { employeeListQuery } = require("../queries/employeeQueries");

async function fetchEmployees(req) {
  return callDestination(req, "SF_API", {
    url: "/odata/v2/User",
    params: employeeListQuery
  });
}

async function fetchLoggedUserPermission(req) {
  return callDestination(req, "SF_API_ADMIN", {
    url: "/odata/v2/getDynamicGroupsByUser",
    params: {
      userId:req.user.id,
      groupSubType:"permission"
    }
  });
}

module.exports = { fetchEmployees, fetchLoggedUserPermission };

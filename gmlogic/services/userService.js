const { callDestination } = require("./httpClient");
const { employeeNameQuery } = require("../queries/employeeQueries");

async function fetchEmployees(req) {
  const name  = req.query.name;
  const manager = req.query.manager;
  let params = { ...employeeNameQuery};
  if (name) {
    const filter = `substringof('${name}',displayName)`;
    params.$filter = encodeURI(filter);
  }
  if(manager) {
    
  }
  return callDestination(req, "SF_API", {
    url: "/odata/v2/User",
    params: params
  });
}

async function fetchLoggedUserPermission(req) {
  return callDestination(req, "SF_API_ADMIN", {
    url: "/odata/v2/getDynamicGroupsByUser",
    params: {
      userId: req.user.id,
      groupSubType: "permission"
    }
  });
}

module.exports = { fetchEmployees, fetchLoggedUserPermission };

const { callDestination } = require("./httpClient");
const EmpQuery = require("../queries/employeeQueries");

async function fetchEmployees(req) {
  const name  = req.query.name;  
  let params = EmpQuery.employeeNameQuery;
  if (name) {
    const filter = `substringof('${name}',displayName)`;
    params.$filter = encodeURI(filter);
  }  
  return callDestination(req, "SF_API", {
    url: "/odata/v2/User",
    params: params
  });
}

async function fetchHostManagers(req) {
  const name  = req.query.manager;  
  let params = EmpQuery.hostManagerQuery;
  if(!name) {
     const filter = `userId eq '${req.user.id}'`;
     params.$filter = encodeURI(filter);
  }
  if (name) {
    const filter = `substringof('${name}',displayName)`;
    params.$filter = encodeURI(filter);
  }  
  return callDestination(req, "SF_API_ADMIN", {
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

module.exports = { fetchEmployees, fetchLoggedUserPermission, fetchHostManagers };

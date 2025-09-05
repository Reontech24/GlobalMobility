const { callDestination } = require("./httpClient");
const { EmployeeName } = require("../queries/initiationQuery");

async function fetchEmployees(req, limit = 100) {
  const { name } = req.query;
  let params = { ...EmployeeName, $top: limit };
   if (name) {
     const filter= `substringof('${name}',displayName)`;
     params.$filter = encodeURI(filter);
  }
  return callDestination(req, "SF_API", {
    url: "/odata/v2/User",
    params
  });
}

module.exports = { fetchEmployees };
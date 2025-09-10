const { callDestination } = require("./httpClient");
const EmpQuery = require("../queries/employeeQueries");
const DEST = require("../config/destination");


async function fetchEmployees(req) {
  const name  = req.query.name;  
  let params = EmpQuery.employeeNameQuery;
  const filters=[];
  filters.push(`emplStatusNav/picklistLabels/label eq 'Active'`);
  filters.push(`employeeClassNav/picklistLabels/label eq 'Employee'`)
  if (name) {
    filters.push(`substringof('${name}',userNav/displayName)`);   
  }  
   params.$filter = encodeURIComponent(filters.join(" and "));
  return callDestination(req, DEST.SF_API_ADMIN, {
    url: "/odata/v2/EmpJob",
    params: params
  });
}

async function fetchHostManagers(req) {
  const name  = req.query.manager;  
  let params = EmpQuery.hostManagerQuery;
  const filters = [];
  filters.push(`userNav/displayName ne null`);
    filters.push(`customString10Nav/picklistLabels/label eq 'Yes'`);
  // if(!name) {
  //    const filter = `userId eq '${req.user.id}'`;
  //    params.$filter = encodeURIComponent(filter);
  // }
  if (name) {
    filters.push(`substringof('${name}',userNav/displayName)`);    
  }  
  params.$filter = encodeURIComponent(filters.join(" and "));
  return callDestination(req, DEST.SF_API_ADMIN, {
    url: "/odata/v2/EmpJob",
    params: params
  });
}

async function fetchLoggedUserPermission(req,userName) {
  return callDestination(req, DEST.SF_API_ADMIN, {
    url: "/odata/v2/getDynamicGroupsByUser",
    params: {
      userId: `'${userName}'`,
      groupSubType: "permission"
    }
  });
}


module.exports = { fetchEmployees, fetchHostManagers, fetchLoggedUserPermission, };

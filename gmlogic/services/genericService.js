const { callDestination } = require("./httpClient");
const genericQuery = require("../queries/genericQuery");
const DEST = require("../config/destination");

async function fetchPickList(req) {
  const name  = req.query.name;  
  let params = genericQuery.picklistQuery;
  if(name) {
     const filter = `status eq 'A' and PickListV2_id eq '${name}'`;
     params.$filter = encodeURI(filter);
  }
  return callDestination(req, DEST.SF_API, {
    url: "/odata/v2/PickListValueV2",
    params: params
  });
}

// Format date to OData V2 compatible string
function formatDate(date) {
  if (!date) return "null";
  const d = new Date(date);
  return `datetime'${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}T00:00:00'`;
}
function toSAPDate(date) {
  return `/Date(${date.getTime()})/`;
}
function getPositionFilter(sEntityId, oStartDate) {
  const filters = [
    `vacant eq true`,
    `effectiveStatus eq 'A'`,
    `cust_currentIncumbent eq null`,
    `company eq '${sEntityId}'`,
    `effectiveStartDate le ${formatDate(oStartDate)}`,
    `effectiveEndDate ge ${formatDate(oStartDate)}`
  ];

  return filters.join(" and ");
}
async function getMailId(req, userId) {
  let params = {
    $select: "email"
  }
  const filter = `userId eq '${userId}'`;
  params.$filter = encodeURI(filter);
  return callDestination(req, DEST.SF_API, {
    url: "/odata/v2/User",
    params: params
  });
}
async function getMailBody(req, notificationType) {
  let params = {
    $select: "cust_NotificationSubject_en_US,cust_NotificationBody_en_US"
  }
  const filter = `cust_NotificationType eq '${notificationType}'`;
  params.$filter = encodeURI(filter);
  return callDestination(req, DEST.SF_API, {
    url: "/odata/v2/cust_GA_Notifications?",
    params: params
  });
}

module.exports = { fetchPickList, formatDate, toSAPDate, getPositionFilter, getMailId, getMailBody };
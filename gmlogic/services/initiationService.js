const { callDestination } = require("./httpClient");
const { EmployeeName } = require("../queries/initiationQuery");
const DEST = require("../config/destination");
const genericService = require("./genericService");
const { sendMail } = require("../config/mail");

async function draftInitiation(req) {
  const payload = req.body;

  return callDestination(req, DEST.SF_API, {
    url: "/odata/v2/upsert",
    method: "POST",
    data: {
      __metadata: { uri: "cust_GA_Processes" },
      effectiveStartDate: genericService.toSAPDate(new Date()),
      cust_Action: "I",
      cust_ProcessType: payload.cust_ProcessType,
      cust_Initiator: req.user.id,
      cust_HostManager: payload.cust_HostManager,
      cust_EmpId: payload.cust_EmpId,
      cust_HomeCountry: payload.cust_HomeCountryCode,
      cust_HostCountry: payload.cust_HostCountry,
      cust_HomeUserId: payload.cust_HomeUserId,
      cust_StartDate: genericService.toSAPDate(new Date(payload.cust_StartDate)),
      cust_EndDate: genericService.toSAPDate(new Date(payload.cust_EndDate)),
      cust_HostPosition: payload.cust_HostPosition,
      cust_Project: payload.cust_Project,
      cust_status: "ID"
    }
  });
}
async function submitInitiation(req) {
  const payload = req.body;
  const homeManager = await getHomeManager(req, payload.cust_HomeUserId);
  const homeHRBP = await getHomeHRBP(req, payload.cust_HomeUserId);
  req.body.cust_HomeMgrId = homeManager?.[0]?.managerId;
  const gaGroups = await getGAGroups(req, payload.cust_LegalEntity, payload.cust_HostLegalEntity)

  return callDestination(req, DEST.SF_API, {
    url: "/odata/v2/upsert",
    method: "POST",
    data: {
      __metadata: { uri: "cust_GA_Processes" },
      effectiveStartDate: genericService.toSAPDate(new Date()),
      cust_Action: "I",
      cust_ProcessType: payload.cust_ProcessType,
      cust_Initiator: req.user.id,
      cust_HostManager: payload.cust_HostManager,
      cust_EmpId: payload.cust_EmpId,
      cust_HomeCountry: payload.cust_HomeCountryCode,
      cust_HostCountry: payload.cust_HostCountry,
      cust_HomeUserId: payload.cust_HomeUserId,
      cust_StartDate: genericService.toSAPDate(new Date(payload.cust_StartDate)),
      cust_EndDate: genericService.toSAPDate(new Date(payload.cust_EndDate)),
      cust_HostPosition: payload.cust_HostPosition,
      cust_Project: payload.cust_Project,
      cust_status: "PI",
      cust_HomeMgrId: homeManager?.[0]?.managerId,
      cust_HomeHRId: homeHRBP?.[0]?.relUserId
    }
  });
}
async function fetchPosition(req) {
  const entity = req.query.entity;
  const startDate = req.query.startDate;
  const filterQuery = genericService.getPositionFilter(entity, startDate);
  let params = {
    $select: [
      "code",
      "externalName_en_US",
      "companyNav/country",
    ].join(","),
    $orderby: "externalName_en_US",
    $expand: "companyNav"
  }
  params.$filter = encodeURIComponent(filterQuery);
  return callDestination(req, DEST.SF_API_ADMIN, {
    url: "/odata/v2/Position",
    params: params
  });
}
async function fetchProject(req) {
  const startDate = req.query.startDate;
  let params = {
    $select: [
      "externalCode",
      "externalName"
    ].join(","),
    $orderby: "externalName"
  }
  params.$filter = encodeURIComponent(`cust_startDate le ${genericService.formatDate(startDate)}`);
  return callDestination(req, DEST.SF_API_ADMIN, {
    url: "/odata/v2/cust_GA_Projects",
    params: params
  });
}

async function getHomeManager(req, homeUserId) {
  let params = {
    $select: "company,managerId"
  }
  const filter = `userId eq '${homeUserId}'`;
  params.$filter = encodeURIComponent(filter);
  return callDestination(req, DEST.SF_API_ADMIN, {
    url: "/odata/v2/EmpJob",
    params: params
  });

}
async function getHomeHRBP(req, homeUserId) {
  let params = {
    $select: "relUserId"
  }
  const filter = `userId eq '${homeUserId}' and relationshipTypeNav/externalCode eq 'hr manager'`;
  params.$filter = encodeURI(filter);
  return callDestination(req, DEST.SF_API_ADMIN, {
    url: "/odata/v2/EmpJobRelationships",
    params: params
  });
}
async function getGAGroups(req, cust_LegalEntity, cust_HostLegalEntity) {
  let params = {
    $select: "cust_GroupID,cust_GroupName"
  }
  const legalFilter = `(cust_LegalEntity eq '${cust_LegalEntity}' or cust_LegalEntity eq '${cust_HostLegalEntity}')`;
  const typeFilter = `(cust_GroupType eq 'GM' or cust_GroupType eq 'HR_OPS')`
  const filter = `${legalFilter} and ${typeFilter}`;
  params.$filter = encodeURIComponent(filter);
  return callDestination(req, DEST.SF_API_ADMIN, {
    url: "/odata/v2/cust_GA_Groups",
    params: params
  });
}
async function sendNotification(req, externalCode) {
  const mgrMail = await genericService.getMailId(req, req.body.cust_HomeMgrId);
  // mgrMail[0].email
  const mailBody = await genericService.getMailBody(req, "GENERAL");
  const name = req.body.cust_EmpName;
  const status = "Initiated";
  const link = req.body.appUrl + "?#approval/" + externalCode;
  const notificationSubject = mailBody[0].cust_NotificationSubject_en_US
    .replace("<name>", name)
    .replace("<status>", status);
  const notificationBody = mailBody[0].cust_NotificationBody_en_US
    .replace("<name>", name)
    .replace("<status>", status)
    .replace("<link>", `<a href='${link}'>Click here</a>`);
  try {
    return sendMail({
      to: "om.pathak@aktglobal.com",
      subject: notificationSubject,
      text: notificationBody,
      html: notificationBody
    });

  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
}

module.exports = { draftInitiation, submitInitiation, fetchPosition, fetchProject, sendNotification };
const { callDestination } = require("./httpClient");
const { EmployeeName } = require("../queries/initiationQuery");

async function upsertInitiation(req) {
  const payload = req.body; 

  return callDestination(req, "SF_API", {
    url: "/odata/v2/upsert",
    method: "POST",
    data: {
      __metadata: { uri: "User" }, // target entity
      userId: payload.userId,
      firstName: payload.firstName,
      lastName: payload.lastName,
      status: payload.status || "active"
    }
  });
}

module.exports = { upsertInitiation };
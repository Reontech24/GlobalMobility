const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");
const { retrieveJwt } = require("@sap-cloud-sdk/connectivity");
const { LOCAL } = require("../config/auth");   // ✅ fixed path

async function callDestination(req, destinationName, options) {
  const config = { destinationName };

  if (!LOCAL) {
    config.jwt = retrieveJwt(req); // CF → user token
  }

  const response = await executeHttpRequest(config, {
    method: options.method || "GET",
    url: options.url,
    params: options.params || {},
    data: options.data || {},
    headers: options.headers || {}
  });

  return response.data?.d?.results || response.data?.value || response.data;
}

module.exports = { callDestination };

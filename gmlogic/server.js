const express = require("express");
const app = express();
const port = process.env.PORT || 8080;

const { JWTStrategy } = require("@sap/xssec");
const xsenv = require("@sap/xsenv");
const passport = require("passport");
const { retrieveJwt } = require("@sap-cloud-sdk/connectivity");
const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");

// ✅ Load services from default-env.json
xsenv.loadEnv();
const services = xsenv.getServices({
  xsuaa: { tag: "xsuaa" }
});

// ✅ Use the correct xsuaa service
passport.use(new JWTStrategy(services.xsuaa));
const LOCAL = process.env.LOCAL_DEV || true; // set to false in CF

if (!LOCAL) {
  app.use(passport.initialize());
  app.use(passport.authenticate("JWT", { session: false }));
}

// Health endpoint
app.get("/", (req, res) => {
  res.send("Welcome to Global Mobility (local BAS run)");
});

// Example SF API call
app.get("/getemplist", async (req, res) => {
  try {
    // Retrieve JWT from request (to forward user token)
    const userJwt = retrieveJwt(req);

    const response = await executeHttpRequest(
      { destinationName: "SF_API", jwt: userJwt },
      {
        method: "GET",
        url: "/odata/v2/User?$top=5&$select=userId,firstName,lastName",
      }
    );

    res.json(response.data.d.results);
 } catch (error) {
    console.error("Error fetching from SF:", error.message);
    res.status(500).send("Error fetching employees from SuccessFactors");
  }
});
app.listen(port, () => console.log(`Listening on port ${port}`));
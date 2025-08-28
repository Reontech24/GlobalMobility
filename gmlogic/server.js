const express = require("express");
const app = express();
const port = process.env.port || 8080;

const { JWTStrategy } = require("@sap/xssec");
const xsenv = require("@sap/xsenv");
const passport = require("passport");
const axios = require("axios");
const { retrieveJwt } = require("@sap-cloud-sdk/connectivity");

// load XSUAA
passport.use(new JWTStrategy(xsenv.getServices({ uaa: { tag: "xsuaa" } }).uaa));

app.use(passport.initialize());
app.use(passport.authenticate("JWT", { session: false }));

// ----------- Routes -----------

app.get("/", (req, res) => {
  res.send("Welcome to employee dashboard");
});

// ✅ Fetch employee list from SuccessFactors via destination
app.get("/getemplist", async (req, res) => {
  try {
    // Retrieve JWT from request (to forward user token)
    const userJwt = retrieveJwt(req);

    // Destination fetch (using SAP Cloud SDK)
    const { executeHttpRequest } = require("@sap-cloud-sdk/http-client");

    const response = await executeHttpRequest(
      { destinationName: "SF_API", jwt: userJwt },   // Destination created in BTP
      {
        method: "GET",
        url: "/odata/v2/User?$top=5&$select=userId,firstName,lastName", // Example API call
      }
    );

    res.json(response.data.d.results);
  } catch (error) {
    console.error("Error fetching from SF:", error.message);
    res.status(500).send("Error fetching employees from SuccessFactors");
  }
});



// Start server
app.listen(port, () => console.log(`Listening on port ${port}`));
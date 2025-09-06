const passport = require("passport");
const xsenv = require("@sap/xsenv");
const { JWTStrategy } = require("@sap/xssec");

xsenv.loadEnv();

// Detect local BAS vs CF
const LOCAL = process.env.LOCAL_DEV === "true"; 
console.log("process.env.LOCAL_DEV =", process.env.LOCAL_DEV);
console.log("LOCAL =", LOCAL);

function initAuth(app) {
  if (!LOCAL) {
    // Enable JWT auth
    const services = xsenv.getServices({ xsuaa: { tag: "xsuaa" } });
    passport.use(new JWTStrategy(services.xsuaa));
    app.use(passport.initialize());
    app.use(passport.authenticate("JWT", { session: false }));
    console.log("Running on CF with JWT authentication");
  } else {
    // In local dev → skip JWT (mock user or no auth)
    console.log("Running in LOCAL mode without JWT authentication");
    app.use((req, res, next) => {
      req.user = { 
        id: "sup_pom", 
        userName: "sup_pom", 
        givenName: "Om", 
        familyName: "Pathak", 
        email: "om.pathak@aktglobal.com" 
      };
      next();
    });
  }
}

module.exports = { initAuth, LOCAL };

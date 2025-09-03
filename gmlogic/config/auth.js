const passport = require("passport");
const xsenv = require("@sap/xsenv");
const { JWTStrategy } = require("@sap/xssec");

xsenv.loadEnv();

const services = xsenv.getServices({
  xsuaa: { tag: "xsuaa" }
});

// Detect local BAS vs CF
const LOCAL = process.env.LOCAL_DEV || true; 

function initAuth(app) {
  if (!LOCAL) {
    // In CF → enable JWT auth
    passport.use(new JWTStrategy(services.xsuaa));
    app.use(passport.initialize());
    app.use(passport.authenticate("JWT", { session: false }));
    console.log("✅ Auth enabled (CF with JWT)");
  } else {
    console.log("⚠️ Running locally - JWT disabled, using technical user from destinations");
  }
}

module.exports = { initAuth, LOCAL };

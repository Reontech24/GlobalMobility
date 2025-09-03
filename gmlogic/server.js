const express = require("express");
const { initAuth } = require("./config/auth");

const app = express();
const port = process.env.PORT || 8081;

// ✅ Setup auth (JWT + XSUAA)
initAuth(app);

// ✅ Routes
const employeeRoutes = require("./routes/employeeRoutes");
app.use("/", employeeRoutes);

// ✅ Start server
app.listen(port, () => console.log(`🚀 Listening on port ${port}`));

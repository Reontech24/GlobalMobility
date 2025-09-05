const express = require("express");
const { initAuth } = require("./config/auth");

const app = express();
const port = process.env.PORT || 8081;

//Setup auth (JWT + XSUAA)
initAuth(app);

//Routes
const employeeRoutes = require("./routes/employeeRoutes");
app.use("/", employeeRoutes);
const mailRoutes = require("./routes/mailRoutes");
app.use("/mail", mailRoutes);


//Start server
app.listen(port, () => console.log(`🚀 Listening on port ${port}`));

const express = require("express");
const { initAuth } = require("./config/auth");

const app = express();
const port = process.env.PORT || 9000;

//Setup auth (JWT + XSUAA)
initAuth(app);

//Routes
const userRoutes = require("./routes/userRoutes");
app.use("/", userRoutes);
const mailRoutes = require("./routes/mailRoutes");
app.use("/mail", mailRoutes);


//Start server
app.listen(port, () => console.log(`🚀 Listening on port ${port}`));

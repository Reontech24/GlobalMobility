const express = require("express");
const { initAuth } = require("./config/auth");

const app = express();
const port = process.env.PORT || 9020;
// Parse JSON bodies
app.use(express.json());
//Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
//Setup auth (JWT + XSUAA)
initAuth(app);

//Routes
const directRoutes = require("./routes/directRoutes");
app.use("/", directRoutes);
const mailRoutes = require("./routes/mailRoutes");
app.use("/mail", mailRoutes);
const initiateRoutes = require("./routes/initiationRoutes");
app.use("/initiate", initiateRoutes);


//Start server
app.listen(port, () => console.log(`🚀 Listening on port ${port}`));

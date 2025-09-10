const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const genericService = require("../services/genericService");


// Employee list
router.get("/getemplist", async (req, res) => {
  try {
    const employees = await userService.fetchEmployees(req);   
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    res.status(500).send(error.message);
  }
});
// Host Manager list
router.get("/gethostmanager", async (req, res) => {
  try {
    const employees = await userService.fetchHostManagers(req);
    // Filter for permanent Employee
    // const hostManager = employees.filter(items => items.custom06 === "Employee" && items.custom10 === 'Active'); 
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    res.status(500).send(error.message);
  }
});

// Picklist Value
router.get("/getpicklist", async (req, res) => {
  try {
    const picklistVal = await genericService.fetchPickList(req);
    res.json(picklistVal);
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    res.status(500).send(error.message);
  }
});

// Get Method to get the logged in user details
router.get("/currentUser", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const userName = req.user.id;
    const loggedUserDetails = await userService.fetchLoggedUserPermission(req,userName);
    const onBehalf = loggedUserDetails.d.some(items => items.groupName.includes("800 - GA initiate by"));
    const user = {
      name: req.user.id || req.user.userName,
      email: req.user.emails?.[0]?.value || req.user.email,
      firstName: req.user.name?.givenName || req.user.givenName,
      lastName: req.user.name?.familyName || req.user.familyName,
      onBehalf: onBehalf
    };

    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error.message);
    res.status(500).send(error.message);
  }
});


module.exports = router;

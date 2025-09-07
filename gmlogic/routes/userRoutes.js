const express = require("express");
const router = express.Router();
const userService = require("../services/userService");


// Employee list
router.get("/getemplist", async (req, res) => {
  try {
    const employees = await userService.fetchEmployees(req);
    // Filter for permanent Employee
    const permanentEmp = employees.filter(items => items.custom06 === "Employee"); 
    res.json(permanentEmp);
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
    const loggedUserDetails = await userService.fetchLoggedUserPermission(req);
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

const express = require("express");
const router = express.Router();
const { fetchEmployees } = require("../services/initiationService");


// Employee list
router.get("/getemplist", async (req, res) => {
  try {
    const employees = await fetchEmployees(req);
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    res.status(500).send("Error fetching employees from SuccessFactors");
  }
});

// Get Method to get the logged in user details
router.get("/currentUser", async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const user = {
      name: req.user.id || req.user.userName,
      email: req.user.emails?.[0]?.value || req.user.email,
      firstName: req.user.name?.givenName || req.user.givenName,
      lastName: req.user.name?.familyName || req.user.familyName
    };

    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error.message);
    res.status(500).send("Error fetching current user");
  }
});

module.exports = router;

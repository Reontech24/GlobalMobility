const express = require("express");
const router = express.Router();
const { fetchEmployees } = require("../services/employeeService");

// Health endpoint
router.get("/", (req, res) => {
  res.send("✅ Welcome to Global Mobility (local BAS run)");
});

// Employee list
router.get("/getemplist", async (req, res) => {
  try {
    const employees = await fetchEmployees(req);
    res.json(employees);
  } catch (error) {
    console.error("❌ Error fetching employees:", error.message);
    res.status(500).send("Error fetching employees from SuccessFactors");
  }
});

module.exports = router;

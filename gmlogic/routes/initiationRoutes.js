const express = require("express");
const router = express.Router();
const initiateService = require("../services/initiationRoutes");

router.post("/upsertInitiation", async (req, res) => {
  try {
    const result = await initiateService.upsertInitiation(req);
    res.status(200).json(result.data);
  } catch (error) {
    console.error("Error during employee upsert:", error.response?.data || error.message);
    res.status(500).send(error.response?.data || { error: error.message });
  }
});



module.exports = router;

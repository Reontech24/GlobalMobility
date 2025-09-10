const express = require("express");
const router = express.Router();
const initiateService = require("../services/initiationService");

router.post("/draftInitiation", async (req, res) => {
  try {
    const result = await initiateService.draftInitiation(req);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error during employee upsert:", error.response?.data || error.message);
    res.status(500).send(error.response?.data || { error: error.message });
  }
});
router.post("/submitInitiation", async (req, res) => {
  try {
    const result = await initiateService.submitInitiation(req);
    const notification = await initiateService.sendNotification(req,result)
    res.status(200).json(result);
  } catch (error) {
    console.error("Error during employee upsert:", error.response?.data || error.message);
    res.status(500).send(error.response?.data || { error: error.message });
  }
});
// Position Value
router.get("/getposition", async (req, res) => {
  try {
    const picklistVal = await initiateService.fetchPosition(req);
    res.json(picklistVal);
  } catch (error) {
    console.error("Error fetching employees:", error.message);
    res.status(500).send(error.message);
  }
});

router.get("/getproject", async (req, res) => {
  try {
    const projectVal = await initiateService.fetchProject(req);
    res.json(projectVal);
  } catch (error) {
    console.error("Error fetching project:", error.message);
    res.status(500).send(error.message);
  }
});




module.exports = router;

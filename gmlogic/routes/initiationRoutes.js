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
    const externalCode = result.d[0].key.match(/externalCode=(\d+)/);
    if(externalCode[0] !== null){
    await initiateService.sendNotification(req,externalCode[1]);
    }
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
router.get("/getInitiation", async (req, res) => {
  try {
    const initiationData = await initiateService.fetchProcessData(req);
    const isApprover = initiationData[0].cust_HomeMgrId === req.user.id;
      const cust_initials = `${initiationData[0].cust_HomeUserIdNav?.firstName?.[0]?.toUpperCase() || ""}${initiationData[0].cust_HomeUserIdNav?.lastName?.[0]?.toUpperCase() || ""}`;
    const formData = {
      cust_initials:cust_initials,
      cust_UserName: initiationData[0].cust_HomeUserIdNav.displayName,
      cust_UserPostion: initiationData[0].cust_HomeUserIdNav.empInfo?.jobInfoNav?.results[0]?.jobTitle,
      cust_Department:initiationData[0].cust_HomeUserIdNav.empInfo?.jobInfoNav?.results[0]?.departmentNav.name,
      cust_LegalEntity:initiationData[0].cust_HomeUserIdNav.empInfo?.jobInfoNav?.results[0]?.companyNav.name,
      cust_Country:initiationData[0].cust_HomeUserIdNav.country,
      cust_HireDate:initiationData[0].cust_HomeUserIdNav.empInfo?.startDate,
      cust_ProcessTypeName:initiationData[0].cust_ProcessTypeNav.label_en_US,
      cust_ProcessType:initiationData[0].cust_ProcessTypeNav.externalCode,
      cust_HostManager:initiationData[0].cust_HostManagerNav?.displayName,
      cust_StartDate:initiationData[0].cust_StartDate,
      cust_EndDate:initiationData[0].cust_EndDate,
      cust_HostPosition:initiationData[0].cust_HostPositionNav?.externalName_en_US,
      cust_ProjectId:initiationData[0].cust_ProjectNav?.externalCode,
      cust_ProjectName:initiationData[0].cust_ProjectNav?.externalName,
      cust_IsApprover:isApprover
    }
    res.json(formData);
  } catch (error) {
    console.error("Error fetching project:", error.message);
    res.status(500).send(error.message);
  }
});




module.exports = router;

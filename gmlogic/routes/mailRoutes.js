const express = require("express");
const router = express.Router();
const { sendMail } = require("../config/mail");

router.get("/test-mail", async (req, res) => {
  try {
    const result = await sendMail({
      to: "om.pathak@exyte.net",
      subject: "Mail from BTP",
      text: "Hello, this is a test!",
      html: "<b>Hello, this is a test!</b>"
    });
    res.json({ ok: true, id: result.messageId });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
module.exports = router;


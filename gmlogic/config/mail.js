const { getDestination } = require("@sap-cloud-sdk/connectivity");
const nodemailer = require("nodemailer");
const xsenv = require("@sap/xsenv");

xsenv.loadEnv(); 

// Function to Fetch Access Token From SF Interface Destination
async function getAccessToken(dest) {
  const params = new URLSearchParams();
  params.set("grant_type", "password");
  params.set("client_id", dest.destinationConfiguration.clientId);
  params.set("client_secret", dest.destinationConfiguration.clientSecret);
  params.set("username", dest.destinationConfiguration.User);
  params.set("password", dest.destinationConfiguration.Password);
  params.set("scope", dest.destinationConfiguration.scope);

  const res = await fetch(dest.destinationConfiguration.tokenServiceURL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params
  });
  if (!res.ok) {
    throw new Error(`OAuth2 token request failed: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  return json.access_token;
}

// Function which will accept to,subject,body from mail router and send the mail
async function sendMail({ to, subject, text, html }, jwt) {
  const dest = await getDestination({ destinationName: "SF_interface_mail", jwt });
  if (!dest) throw new Error("Destination SF_interface_mail not found");

  const props = dest.originalProperties || {};
  const token = await getAccessToken(props);

  const transporter = nodemailer.createTransport({
    host: props.destinationConfiguration["mail.smtp.host"],
    port: parseInt(props.destinationConfiguration["mail.smtp.port"], 10) || 587,
    secure: false, 
    requireTLS: true,
    auth: {
      type: "OAuth2",
      user: props.destinationConfiguration.User,       
      accessToken: token
    },
    authMethod: props.destinationConfiguration["mail.smtp.auth.mechanisms"],
    tls: { rejectUnauthorized: false }
  });

  const info = await transporter.sendMail({
    from: props.destinationConfiguration["mail.smtp.from"],
    to,
    subject,
    text,
    html
  });

  return info;
}

module.exports = { sendMail };

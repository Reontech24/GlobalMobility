const { getDestination } = require("@sap-cloud-sdk/connectivity");
const nodemailer = require("nodemailer");
const xsenv = require("@sap/xsenv");

xsenv.loadEnv(); // loads default-env.json locally or VCAP on CF

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

async function sendMail({ to, subject, text, html }, jwt) {
  const dest = await getDestination({ destinationName: "SF_interface_mail", jwt });
  if (!dest) throw new Error("Destination SF_interface_mail not found");

  const props = dest.originalProperties || {};
  const token = await getAccessToken(props);

  const transporter = nodemailer.createTransport({
    host: props.destinationConfiguration["mail.smtp.host"],
    port: parseInt(props.destinationConfiguration["mail.smtp.port"], 10) || 587,
    secure: false, // STARTTLS
    requireTLS: true,
    auth: {
      type: "OAuth2",
      user: props.destinationConfiguration.User,        // mailbox user
      accessToken: token
    },
    authMethod: "XOAUTH2",
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

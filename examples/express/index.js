import { randomUUID } from "node:crypto";

import express from "express";
import { Site, FEATURES } from "@zeroad.network/token";

/**
 * Module initialization (done once on startup)
 *
 * You can provide your site's "Welcome Header" value, for example, by passing in a process.env variable:
 *   const site = Site(process.env.ZERO_AD_NETWORK_WELCOME_HEADER_VALUE);
 *
 * Or by passing in an options object to announce your site feature list, like this:
 *   const site = Site({
 *     siteId: 'd867b6ff-cb12-4363-be54-db4cec523235',
 *     features: [FEATURES.ADS_OFF, FEATURES.COOKIE_CONSENT_OFF, FEATURES.MARKETING_DIALOG_OFF]
 *   });
 */

const site = Site({
  // for demo purposes lets generate a siteId UUID value for now
  siteId: randomUUID(),
  // and specify a list of site supported features
  features: [FEATURES.ADS_OFF, FEATURES.COOKIE_CONSENT_OFF, FEATURES.MARKETING_DIALOG_OFF],
});

// -----------------------------------------------------------------------------
// Middleware
// -----------------------------------------------------------------------------
function tokenMiddleware(req, res, next) {
  // Inject server header into every response.
  res.setHeader(site.SERVER_HEADER_NAME, site.SERVER_HEADER_VALUE);

  // Process request token from incoming client token header value.
  // And attach processed token info to request for downstream usage.
  req.tokenContext = site.parseToken(req.headers[site.CLIENT_HEADER_NAME]);

  next();
}

// -----------------------------------------------------------------------------
// Express app
// -----------------------------------------------------------------------------
const app = express();
app.use(tokenMiddleware);

app.get("/", (req, res) => {
  // Example: use tokenContext to render template
  const tokenContext = req.tokenContext;

  const state = (value) => (value && '<b style="background: #b0b0b067">YES</b>') || "NO";
  const template = `
    <html>
      <body>
        <h1>Hello</h1>
        <h3>Contents of "tokenContext" variable for this request:</h3>
        <pre style="display: inline-block; border: 1px solid #5b5b5ba4; padding: 0.5rem; background: #b0b0b067">tokenContext = ${JSON.stringify(tokenContext, null, 2)}</pre>

        <h3>Site Feature toggles to be used while rendering this page:</h3>
        <ul>
          <li>Skip rendering Advertisements: ${state(tokenContext.ADS_OFF)}</li>
          <li>Skip rendering Cookie Consent Dialog: ${state(tokenContext.COOKIE_CONSENT_OFF)}</li>
          <li>Skip rendering Marketing Dialog: ${state(tokenContext.MARKETING_DIALOG_OFF)}</li>
          <li>Remove Content Paywall: ${state(tokenContext.CONTENT_PAYWALL_OFF)}</li>
          <li>Provide SaaS Access to Basic Subscription Plan: ${state(tokenContext.SUBSCRIPTION_ACCESS_ON)}</li>
        </ul>
      </body>
    </html>
  `;

  res.send(template);
});

app.get("/json", (req, res) => {
  // req.tokenContext is available here too
  res.json({
    message: "OK",
    tokenContext: req.tokenContext,
  });
});

// -----------------------------------------------------------------------------
app.listen(3000, () => {
  console.log(`Express server listening at port 3000
    · HTML template example:        http://localhost:3000
    · Plain JSON endpoint example:  http://localhost:3000/json`);
});

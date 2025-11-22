import { Hono } from "hono";
import { serve } from "@hono/node-server";

import {
  init,
  getServerHeaderName,
  getServerHeaderValue,
  getClientHeaderName,
  processRequest,
} from "@zeroad.network/token";

// -----------------------------------------------------------------------------
// Module initialization (done once on startup)
// -----------------------------------------------------------------------------
init({ value: process.env.ZERO_AD_NETWORK_WELCOME_HEADER_VALUE || "" });

const SERVER_HEADER_NAME = getServerHeaderName();
const SERVER_HEADER_VALUE = getServerHeaderValue();
const CLIENT_HEADER_NAME = getClientHeaderName();

// -----------------------------------------------------------------------------
// Hono app
// -----------------------------------------------------------------------------
const app = new Hono();

// -----------------------------------------------------------------------------
// Middleware
// -----------------------------------------------------------------------------
app.use("*", async (c, next) => {
  // Inject server header into every response
  c.header(SERVER_HEADER_NAME, SERVER_HEADER_VALUE);

  // Read incoming client token header value
  const clientHeaderValue = c.req.header(CLIENT_HEADER_NAME);

  // Process request token
  const tokenContext = processRequest(clientHeaderValue);

  // Attach processed token info to context for downstream usage
  c.set("tokenContext", tokenContext);

  await next();
});

// -----------------------------------------------------------------------------
// Routes
// -----------------------------------------------------------------------------
app.get("/", (c) => {
  const tokenContext = c.get("tokenContext");
  return c.json({
    message: "OK",
    tokenContext,
  });
});

app.get("/template", (c) => {
  const tokenContext = c.get("tokenContext");

  const template = `
    <html>
      <body>
        <h1>Hello</h1>
        <pre>tokenContext = ${JSON.stringify(tokenContext, null, 2)}</pre>
        ${tokenContext.shouldRemoveAds ? "<p>Will not show ads</p>" : "<p>Will show ads</p>"}
      </body>
    </html>
  `;

  return c.html(template);
});

// -----------------------------------------------------------------------------
// Start server (for Node.js)

serve(app);
console.log("Hono server listening on port 3000");

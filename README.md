# @zeroad.network/token

This node module allows a ZeroAd Network programme partnering websites and Web APIs to verify whether the `X-Better-Web-Hello` HTTP request header value is a valid, untampered ZeroAd Network token, if it's not expired, type of the subscription a current user has.

# Installation

Install this package using your favourite nodejs:

Using `npm`:

```shell
npm add @zeroad.network/token
```

Or `yarn`:

```shell
yarn add @zeroad.network/token
```

Or using `pnpm`:

```shell
pnpm add @zeroad.network/token
```

Or using `bun`:

```shell
bun add @zeroad.network/token
```

This package works well within `mjs` (ESM) and `cjs` (CJS - older node versions) environments.

# Setup

## Register your website or web API

Sign up with us by navigating in your browser to [sign up](https://zeroad.network/login), once you've logged in successfully, go to and [add a project](https://zeroad.network/publisher/sites/add) page, register your project.

On the second step of the Project registration you'll be presented with your own unique `X-Better-Web-Welcome` header value. Your website responding with this header will let ZeroAd Network users know that you are participating in the programme.

Their browser extension will send the `X-Better-Web-Hello` which you will then be able to verify and disable ads, paywalls or enable access to otherwise paid content.

ZeroAd user browser extension will measure how many times and how long they spent on each resource of your website that sends the `X-Better-Web-Welcome` token. This information will go back to us and at the end of each month based on how large the active user base is and how much competition you got, you'll get proportionally awarded for participating in our programme.

# Set up your website, web app

The most basic use with `express` could look similar to this:

```js
import express from "express";
import {
  init,
  constants,
  getServerHeaderName,
  getServerHeaderValue,
  processRequest,
  getClientHeaderName,
} from "@zeroad.network/token";

const app = express();
const port = 3000;

app
    .use((req, res, next) => {
        // X-Better-Web-Welcome header injection can could have it's own simple middleware like this:
        res.header(getServerHeaderName(), getServerHeaderValue())
    })
    .use((req, res, next) => {
        const result = await processRequest(c.req.header(getClientHeaderName()));

        res.locals._disableAds = result.shouldRemoveAds();
        res.locals._removePaywalls = result.shouldEnablePremiumContentAccess();
        res.locals._vipExperience = result.shouldEnableVipExperience();

        next();
    })
    .get('/', (req, res) => {
        // The "locals._disableAds" variable can now be used to suppress rendering
        // of ad blocks and trackers.

        // The "locals._removePaywalls" variable can allow users to bypass pay-walled content.
        res.render('index.ejs');
    });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
```

# What's next

That's pretty much it. If you no user of ours interacts with your website or web app, you lose nothing. You can keep showing ads to the normal users, keep your paywalls etc.

We hope the opposite will happen and you'll realize how many people value pure, clean content created for them that brings real and meaningful value to them.

Each website that joins us becomes a part of re-making the website as it was originally intended to be - to be a joyful and wonderful experience once again.

Thank you!

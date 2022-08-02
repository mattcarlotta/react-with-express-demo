const chalk = require("chalk");
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const process = require("process");
const { resolve } = require("path");

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const app = express();
const router = express.Router();
const currentDirectory = process.cwd();
const { API_PORT, CLIENT, NODE_ENV, PORT, REACT_APP_API } = process.env;
const inProduction = NODE_ENV === "production";

// allow incoming requests to come from client only
app.use(
  cors({
    origin: CLIENT,
  })
);

// request logging framework
app.use(morgan("tiny"));

// *optional* parses incoming JSON args to the "req.body"
// https://expressjs.com/en/api.html#express.json
app.use(express.json());

// tell express to use router instance
app.use(router);

// set up a route to listen for "GET" requests to "/api/orders"
// https://expressjs.com/en/api.html#router.METHOD
router.get("/api/orders", async (_req, res) => {
  try {
    // const res = await WooCommerce.get("orders");
    const orders = [
      {
        id: 1,
        orderId: 123,
        customer: "John Doe",
        email: "johndoe@example.com",
        items: [{ id: 69420, name: "Banana", quantity: 3 }],
      },
    ];

    // assuming res.data is an array of orders
    // if(!res.data || !res.data.length) throw Error("No orders were found!");

    // sets status: https://expressjs.com/en/api.html#res.status
    // sends JSON: https://expressjs.com/en/api.html#res.json
    return res.status(200).json({ orders });
  } catch (error) {
    // in this case, sends a plain text response
    // https://expressjs.com/en/api.html#res.send
    return res.status(404).send(error.toString());
  }
});

// express serve up production assets from build
if (inProduction) {
  app.use(express.static("build"));

  // express will serve up the front-end index.html file if it doesn't recognize the route
  app.get("*", (_req, res) =>
    res.sendFile(resolve(`${currentDirectory}/build/index.html`))
  );
}

// create server on specified PORT
app.listen(API_PORT || PORT, (err) => {
  if (!err) {
    if (inProduction)
      console.log(
        chalk.blue(
          `\nListening for app requests to ${chalk.bold.yellow(CLIENT)}`
        )
      );

    console.log(
      chalk.blue(
        `Listening for API requests to ${chalk.bold.yellow(REACT_APP_API)}\n`
      )
    );
  } else {
    console.err(chalk.red(`\nUnable to start server: ${err}`));
  }
});

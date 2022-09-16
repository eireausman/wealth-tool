require("dotenv").config();
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const bcrypt = require("bcryptjs");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { findOneUser } from "./modules/database_actions";

import { userDataInterface, passportUser } from "./types/typeInterfaces";

const { connectoDB, sequelize } = require("./modules/database_connect");
connectoDB();

dotenv.config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var apiRouter = require("./routes/api");

import updateFXRates from "./modules/getFXRates";
import { updateStockMarketCodes } from "./modules/getMarketsList";
import { updateStockCompaniesListsByMarket } from "./modules/getCompaniesByMarket";
import { getCompanyPriceData } from "./modules/getCompanyPriceData";

const app: Express = express();

const port = process.env.PORT;

if (process.env.API_SCHEDULEDCALLS_SWITCH === "ON") {
  var cron = require("node-cron");
  cron.schedule("01 * * * * *", () => {
    // run the update FX Rates job every minute.
    // It checks if the API should be called to protect overuse / charging of API.  Cost is a DB call each minute.
    // follow the function to see the limiting condition.
    updateFXRates();
    // similarly, the below inserts new listed companies for the in-scope exchanges (those in the stock_markets table)
    updateStockCompaniesListsByMarket();
  });

  cron.schedule("01 * * * * *", () => {
    // run a check for any price update requirements and get prices from API if required.
    getCompanyPriceData();
  });

  // if desired, all available global markets (API dependent) can be uploaded to the stock_markets table.  This will have an API cost impact
  // because the companies for those markets will then be retrieved, potentially along with a price request per company.
  // uncomment the below if this all markets are required.
  // The stock market name is not available in the API, so for new additions, names will need adding into the table directly.
  // cron.schedule("* * * * * 1", () => {
  //   // run the update market codes once every week on a Monday (1)
  //   updateStockMarketCodes();
  // });
}

const SequelizeStore = require("connect-session-sequelize")(session.Store);
var sqlSessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(
  session({
    secret: process.env.SQL_SESSION_SECRET,
    store: sqlSessionStore,
    resave: false,
    saveUninitialized: true,
  })
);
sqlSessionStore.sync();

passport.use(
  new LocalStrategy((username: string, password: string, done: Function) => {
    findOneUser("users_username", username).then((userDataFromDB) => {
      const userData: userDataInterface = JSON.parse(
        JSON.stringify(userDataFromDB.users)
      );

      console.log("LOGIN: user query completed");
      if (userData === false) {
        console.log("LOGIN: usename rejected");
        return done(null, false, { message: "Incorrect username" });
      }
      console.log(userData);

      bcrypt.compare(
        password,
        userData.users_password,
        (err: Error, res: Request) => {
          if (res) {
            // passwords match! log user in
            console.log("LOGIN: passwords matched");
            const user = {
              id: userData.users_id,
            };
            return done(null, user);
          } else {
            // passwords do not match!
            console.log("LOGIN: password DO NOT match");
            return done(null, false, { message: "Incorrect password" });
          }
        }
      );
    });
    console.log("LOGIN: passport check complete - LOCAL STRATEGY");
  })
);

passport.serializeUser(function (user: passportUser, done: Function) {
  done(null, user.id);
});

passport.deserializeUser(function (id: string, done: Function) {
  findOneUser("users_id", id).then((userDataFromDB) => {
    const userData: userDataInterface = JSON.parse(
      JSON.stringify(userDataFromDB.users)
    );

    const user = {
      id: userData.users_id,
      username: userData.users_username,
    };

    const err = false;
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// view engine setup
app.set("views", path.join(__dirname, "/views"));
// app.set("view engine", "jade");
app.set("view engine", "pug");

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.use("/api", apiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);

  // res.render("error");
});

// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + TypeScript Server");
// });

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});

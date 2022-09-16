import { Request, Response, NextFunction } from "express";
import { createUser } from "../modules/database_actions";

// const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.createUserAccount = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(req.body);

  bcrypt.hash(req.body.password, 10, (err: any, hashedPassword: string) => {
    if (err) {
      return next(err);
    }

    createUser(req.body.username, hashedPassword).then((data) => {
      res.send(data);
    });
  });
};

exports.isUserLoggedIn = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (res.locals.currentUser === undefined) {
      res.json(false);
    } else {
      res.json(res.locals.currentUser.username);
    }
  } catch (err) {
    console.log(err);
  }
};

// check if credentials are valid
exports.logUserIn = function (req: Request, res: Response, next: NextFunction) {
  passport.authenticate("local", {
    failureRedirect: "/api/login/userauthenticationfailed",
    failureMessage: true,
    successRedirect: "/api/login/success",
  })(req, res, next);
};

exports.logUserOut = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.send("you are now logged out");
  });
};

exports.loginSuccess = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.send({
    requestOutcome: true,
    message: "You have been logged in",
  });
};

exports.loginFailure = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.send({
    requestOutcome: false,
    message: "Error logging in",
  });
};

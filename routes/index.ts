import { Request, Response, NextFunction } from "express";

var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  // (router as any).res.render("index", { title: "Express" });
  res.send("index page served");
});

module.exports = router;

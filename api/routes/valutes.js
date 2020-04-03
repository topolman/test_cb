var express = require("express");
var router = express.Router();
const db = require("./../database");
const auth = require("./../auth");
const { isInteger } = require("lodash");

router.get("/", auth.authenticateJWT, function(req, res, next) {
  const { from, to } = req.body;
  const sqlShort = "SELECT * FROM currency LIMIT 50";
  const sqlLimit = "SELECT * FROM currency WHERE date BETWEEN ? AND ?";

  let params = [];
  if (isInteger(parseInt(from)) && from.length === 10) params.push(from);
  if (isInteger(parseInt(to)) && to.length === 10) params.push(to);

  db.all(
    params.length === 2 ? sqlLimit : sqlShort,
    params.length === 2 ? params : [],
    (err, rows) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows
      });
    }
  );
});

module.exports = router;

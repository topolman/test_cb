var express = require("express");
var router = express.Router();
const db = require("./../database");
const auth = require("./../auth");
const { get } = require("lodash");

router.get("/", auth.authenticateJWT, function(req, res, next) {
  const from = get(req, "query.from");
  const to = get(req, "query.to");
  const sqlShort = "SELECT * FROM currency"; //LIMIT 50";
  const sqlLimit = `SELECT * FROM currency WHERE datetime(date, 'unixepoch') BETWEEN '${from}' AND '${to}'`;

  let params = [];
  if (typeof from !== "undefined" && from !== "undefined") params.push(from);
  if (typeof to !== "undefined" && to !== "undefined") params.push(to);

  db.all(params.length === 2 ? sqlLimit : sqlShort, [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows
    });
  });
});

module.exports = router;

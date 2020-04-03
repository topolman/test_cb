var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");

const auth = require("../auth");

router.post("/login", function(req, res, next) {
  const { username, password } = req.body;
  console.log(username, password);
  const user = auth.users.find(u => {
    return u.username == username && u.password == password;
  });

  if (user) {
    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      auth.accessTokenSecret
    );

    res.json({
      message: "success",
      data: {
        accessToken
      }
    });
  } else {
    res.json({
      message: "failure",
      data: {
        error: "Не правильное имя пользователя или пароль"
      }
    });
  }
});

router.post("/logout", (req, res) => {
  const { token } = req.body;
  refreshTokens = auth.refreshTokens.filter(t => t !== token);

  res.json({
    message: "success",
    data: {
      message: "Logout successful"
    }
  });
});

router.post("/token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.sendStatus(401);
  }

  if (!auth.refreshTokens.includes(token)) {
    return res.sendStatus(403);
  }

  jwt.verify(token, auth.refreshTokenSecret, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { username: user.username, role: user.role },
      auth.accessTokenSecret,
      { expiresIn: "20m" }
    );

    res.json({
      accessToken
    });
  });
});

module.exports = router;

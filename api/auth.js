const jwt = require("jsonwebtoken");

const accessTokenSecret = `ASDFAjaEihjfaefia@#$oiufh28370o8aw7ehfoq23yroiauwhfoa387y#@$!qwdfafqfwr4323qrcqwer!@#$cqwercewrv314!@#$132345v`;
const refreshTokenSecret = `cn98yro92138rchn2oinrhjfalwkhroq23#@$asdfqw3vrq2#$!#$!@#RC!@#R123412f3fcrqwc12@#$!@#c2CRE!@#$aWVRQWETB@#!$123W`;

const creds = {
  accessTokenSecret,
  refreshTokenSecret,
  users: [
    {
      username: "user",
      password: "secret"
    }
  ],
  refreshTokens: [],
  authenticateJWT: (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
          return res.sendStatus(403);
        }
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  }
};

module.exports = creds;

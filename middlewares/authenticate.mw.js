

const jwt = require('jsonwebtoken');
const Blacklist = require('../models/blacklist.model');

const auth = async (req, res, next) => {
  try {
    // verify accessToken
  // check if it is not blacklisted
  // then call next
  const { pscAccessToken } = req.cookies;
  const isTokenBlacklisted = await Blacklist.findOne({ token: pscAccessToken });
  if (isTokenBlacklisted)
    return res.status(400).send({ msg: "Please login....." });

    const isTokenValid = jwt.verify(
        pscAccessToken,
        "jwtsecretkeyfromenvfile"
      );
      if (!isTokenValid)
        return res.status(400).send({ msg: "Please login again." });

       console.log(isTokenValid)
        if(isTokenValid){
            req.body.userID= isTokenValid.userID
            req.body.role= isTokenValid.role
        }
    next();
  } catch (err) {

    if (err.name === 'TokenExpiredError') {
      return res.status(401).send('Access token expired');
    }
    // return res.status(401).json({ msg: 'Unauthorized ' });
    res.status(500).send({ msg: err.message , "authmw": "fromauthmw"});
  }
};

module.exports = auth
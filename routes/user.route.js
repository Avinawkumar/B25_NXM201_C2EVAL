const express = require('express');


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel } = require('../models/user.model');
const Blacklist = require('../models/blacklist.model');
const user_Router = express.Router();

// registring user
user_Router.post("/signup", async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const isUserPresent = await UserModel.findOne({ email });
      if (isUserPresent) {
        return res.status(400).send({ msg: "Already a user, please login" });
      }
      const hashedPassword = bcrypt.hashSync(password, 8);
      const newUser = new UserModel({ ...req.body, password: hashedPassword });
      await newUser.save();
      res.send({ msg: "Signup successful", user: newUser });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  });


// login user
user_Router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const isUserPresent = await UserModel.findOne({ email });
      if (!isUserPresent) {
        // user not present
        return res.status(400).send({ msg: "Not a user, please signup" });
      }
  
      const isPasswordCorrect = bcrypt.compareSync(
        password,
        isUserPresent.password
      );
      if (!isPasswordCorrect)
        return res.status(400).send({ msg: "Wrong credentials" });
      // generate tokens
  
      // accessTOken and refreshTOken
      const accessToken = jwt.sign(
        { email, role: isUserPresent.role, "userID": isUserPresent._id },
        "jwtsecretkeyfromenvfile",
        { expiresIn: "1m" }
      );
      const refreshToken = jwt.sign(
        { email, role: isUserPresent.role , "userID": isUserPresent._id },
        "jwtsecretkeyfromenvfileforrefresh",
        { expiresIn: "3m" }
      );
      // store these tokens
      // cookies set a cookie
      res.cookie("pscAccessToken", accessToken, { maxAge: 2000 * 60 });
      res.cookie("pscRefreshToken", refreshToken, { maxAge: 1000 * 60 * 8 });
      res.send({ msg: "Login success" });
    } catch (error) {
      res.status(500).send({ msg: error.message });
    }
  });



  // logout user
  user_Router.get("/logout", async (req, res) => {
    try {
      // store that users tokens in the blacklisted database
      // tokens  cookies
      const { pscAccessToken, pscRefreshToken } = req.cookies;
    //   console.log(pscAccessToken,pscRefreshToken)
      console.log(req.cookies)
      const blacklistAccessToken = new Blacklist({token:pscAccessToken});
      const blacklistRefreshToken = new Blacklist({token:pscRefreshToken});
      await blacklistAccessToken.save();
      await blacklistRefreshToken.save();
      res.send({ msg: "Logout successful" });
    } catch (error) {
      res.status(500).send({ msg: error.message, "m": "heloo from logout" });
    }
  });




  module.exports = user_Router;
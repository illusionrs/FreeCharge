const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var csv = require("fast-csv");

//const auth = require('../middleware/auth')

require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    let { name, password, passwordCheck, username } = req.body;
    console.log(req.body);
    if (!username || !password || !passwordCheck) {
      return res.status(400).json({ msg: "Not all fields entered" });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "Password length should be atleast 5 character." });
    }

    if (password != passwordCheck) {
      return res.status(400).json({ msg: "Password should be same." });
    }

    const existUser = await User.findOne({ username: username });
    console.log(".................exist.......", existUser);

    if (existUser) {
      return res.status(400).json({ msg: "User Exists.." });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const accountNumber = Math.floor(Math.random() * 100000000);

    const newUser = new User({
      name,
      username,
      password: passwordHash,
      accountNumber: accountNumber,
    });

    const saveUser = await newUser.save();

    res.json({ name: name, username: username, accountNumber: accountNumber });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;

    console.log(username, password);

    if (!username || !password) {
      return res.status(400).json({ msg: "Not all fields entered" });
    }

    const user = await User.findOne({ username: username });

    console.log(
      "this is user",
      User.find({ username: username }).accountNumber
    );

    if (!user) {
      return res.status(400).json({ msg: "Upload csv" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        accountNumber: user.accountNumber,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/upload", (req, res) => {
    console.log(req.body)
  if (!req.files) return res.status(400).send("No files were uploaded.");

  var acFile = req.file;
  

  var acount = [];

  csv
    .fromString(acFile.data.toString(), {
      headers: true,
      ignoreEmpty: true,
    })
    .on("data", function (data) {
      data["_id"] = new mongoose.Types.ObjectId();

      ac.push(data);
    })
    .on("end", function () {
      User.create(ac, function (err, documents) {
        if (err) throw err;
      });

      res.send(ac.length + "csv have been successfully uploaded.");
    });
});

module.exports = router;

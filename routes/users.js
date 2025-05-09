var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const userModel = require('../models/users')
const mongoose = require("mongoose");



// ? Register User
router.post('/api/v1/register', async (req, res) => {
  let { email, name, password, phoneNumber, address } = req.body
  // * check กรอก field ครบไหม
  if (!email || !name || !password || !phoneNumber || !address) {
    return res.status(400).json({
      status: 400,
      message: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
    });
  }
  // *check ว่ามีข้อมูลในระบบไหม
  let emailCheck = await userModel.find({ email: email })
  if (emailCheck.length !== 0) {
    return res.status(400).json({
      status: 400,
      message: "คุณมีข้อมูลใน ระบบ แล้ว กรุณาเข้าสู่ระบบ",
    })
  }
  // *create newUser
  try {
    let passwordHash = await bcrypt.hash(password, 10);
    let newUser = new userModel({
      email: email,
      password: passwordHash,
      name: name,
      address: address,
      phoneNumber: phoneNumber,
      approve: false
    });
    await newUser.save();
    return res.status(201).send({
      status: 201,
      message: "สมัครสมาชิกสำเร็จ  ",
      data: [newUser],
    });
  } catch (error) {
    console.log(error)
    res.status(400).json({
      status: 400,
      message: "เกิดข้อผิดพลาด กรุณาสมัครสมาชิก ใหม่อีกครั้ง",
    })
  }
})

// ? Login User
router.post('/api/v1/login', async (req, res) => {
  try {
    const { email, password, orders = [] } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: 400,
        message: "กรุณาสมัครสมาชิกก่อน เข้าสู่ระบบ",

      });
    }
    // *check password Correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: 400,
        message: "รหัสผ่าน หรืออีเมลไม่ถูกต้อง กรุณาลองอีกครั้ง",

      });
    }
    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name, approve: user.approve },
      process.env.JWT_KEY, { expiresIn: '15m' }
    );
    return res.status(201).json({
      status: 201,
      message: "เข้าสู่ระบบสำเร็จ",
      data: [{
        _id: user._id,
        email: user.email,
        name: user.name,
        phoneNumber: user.phoneNumber,
        token
      }]
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      status: 500,
      message: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์",
      error: error.message
    });
  }
});

// * Approve User
router.put('/api/v1/users/:id/approve', async (req, res) => {
  try {
    let idUser = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(idUser)) {
      return res.status(400).send({
        message: "ไม่เจอ ID ของผู้ใช้คนนี้ ",
        status: 400,
        error: ["id is not a ObjectId"],
      }
      )
    }
    let user = await userModel.findById(idUser)
    let approve = user.approve = true
    const token = jwt.sign(
      { id: user._id, approve: approve },
      process.env.JWT_KEY,
      { expiresIn: '15m' }
    );

    await user.save()
    return res.status(200).send({
      data: user,
      token: token,
      message: "approve user id นี้ สำเร็จ",
      status: 200,
    })
  } catch (error) {
    console.log("error : ", error)
    return res.status(500).send({
      message: "server error",
      status: 500
    })
  }
})




module.exports = router;

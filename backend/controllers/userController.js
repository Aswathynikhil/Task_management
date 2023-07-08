const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      role:user.role
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for user email
  const user = await User.findOne({ email })

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      role:user.role
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}




// -------------Generate Email Verification Token-----------------

const generateVerificationToken = expressAsyncHandler(async (req, res) => {
  console.log("generateVerificationToken");
  const { to, from, subject, message, resetURL } = req.body;

  // Step 1
  // transporter is what going to connect you to whichever host domain that using or either services that you'd like to
  // connect
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const loginUserId = req.user.id;
  const user = await User.findById(loginUserId);
  console.log(user);
  try {
    // Generate token
    const verificationToken = await user?.createAccountVerificationToken();
    // save user
    await user.save();
    //build your message
    const resetURL = `If you were requested to verify your account, verify now within 10 minutes, otherwise ignore this message <a href="http://localhost:3000/verify-account/${verificationToken}">Click to verify your account</a>`;
    let mailOptions = {
      from: "devblog.info2022@gmail.com",
      to: user?.email,
      // to: "devblog.info2022@gmail.com",
      subject: "devblog Verification",
      message: "verify your account now",
      html: resetURL,
    };
    // step 3
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error Occurs", err);
      } else {
        console.log("Email sent");
      }
    });
    res.json(resetURL);
  } catch (error) {
    res.json(error);
  }
});

//Account verification
const accountVerification = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  //find this user by token

  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationExpires: { $gt: new Date() },
  });
  if (!userFound) throw new Error("Token expired, try again later");
  //update the proprt to true
  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationExpires = undefined;
  await userFound.save();
  res.json(userFound);
});




const getUsers=asyncHandler(async(req,res)=>{
  
  const user=await User.find({}).skip(1)
  console.log(user+'++++++++++++++');
  res.status(200).json(user)
})

const findUsers=asyncHandler(async(req,res)=>{
  const {id}=req.params
  const user=await User.findById(id)
  res.status(200).json(user)
})

const deleteUser=asyncHandler(async(req,res)=>{
  const {id}=req.params
  const user=await User.findByIdAndDelete(id)
  res.json(user)
})

const editUser=asyncHandler(async(req,res)=>{
  const {id}=req.params
  const user=await User.findByIdAndUpdate(id,req.body)
  res.json(user)
})

module.exports = {
  registerUser,
  loginUser,
  getMe,
  getUsers,
  deleteUser,
  editUser,
  findUsers,
  generateVerificationToken,
  accountVerification,
};
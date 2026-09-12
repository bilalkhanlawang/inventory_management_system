
// const { pool } = require("../config/db.js");  // or const pool = require("../config/db.js");
// const catchAsync = require("../errorHandeling/catchAsync.js");
// const appError = require("../errorHandeling/appError.js");

// const signup = catchAsync(async (req,res,next) => {
//     const {name, email,password,passwordConfirm, role,created_at} = req.body;
//     const [result] = await pool.query(`INSERT INTO users(name, email,password,passwordConfirm, role,created_at)
//         VALUES(?,?,?,?,?,?)`,[name, email,password,passwordConfirm, role,created_at]
//         );
//         res.status(201).json({
//             status: "successful",
//             message: "user created",
//             data:{
//                 id:result.insertId,
//                 name:name,
//                  email:email,
//                  password:password,
//                  passwordConfirm:passwordConfirm, 
//                  role:role,
//                  created_at:created_at
//             }

//         });
// });





const {pool} = require("../config/db.js");
const bcrypt = require("bcryptjs");
const catchAsync = require("../errorHandeling/catchAsync.js");
const appError = require("../errorHandeling/appError.js");



//sign up
const signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;

  // 1) Check required fields
  if (!name || !email || !password || !passwordConfirm) {
    return next(new appError("Please provide all required fields", 400));
  }

  // 2) Check passwords match
  if (password !== passwordConfirm) {
    return next(new appError("Passwords do not match", 400));
  }

  // 3) Check email not already used
  const [existing] = await pool.query(
    "SELECT id FROM users WHERE email = ?",
    [email]
  );
  if (existing.length > 0) {
    return next(new appError("Email already in use", 400));
  }

  // 4) Hash password
  const hashedPassword = await bcrypt.hash(password, 12);


  // 5) Insert user (NO passwordConfirm, NO created_at)
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?,?, ?, ?)",
    [name, email, hashedPassword, "user"]
  );

  // 6) Send response WITHOUT password
  res.status(201).json({
    status: "success",
    message: "User created",
    data: {
      id: result.insertId,
      name,
      email,
      role: "user"
    }
  });
});


module.exports = {
    signup,
}
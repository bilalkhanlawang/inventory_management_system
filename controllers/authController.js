
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
const jwt = require("jsonwebtoken");


const signToken = id => {
  return jwt.sign(
    {id},
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN}
  );
};

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

  // use the token 
  const token = signToken(result.insertId);

  // 6) Send response WITHOUT password
  res.status(201).json({
    status: "success",
    message: "User created",
    token,
    data: {
      id: result.insertId,
      name,
      email,
      role: "user"
    }
  });
});

// // login
// const login = catchAsync ( async (req,res,next) => {
//   const {email , password} = req.body;
//   // check email is exist
// if (!email) {
//   return next(new appError("pleace provide email"));
// }
//   // check password is exist
//   if (!password) {
//     return next(new appError("pleace provide password"));
//   }
//   // check if user exist and password is correct

//   // if every thing is ok , sent token to client 
//   res.status(200).json({
//     status: "success",
//     token
//   })
  
// });


// login
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check email is provided
  if (!email) {
    return next(new appError("Please provide email", 400));
  }

  // 2) Check password is provided
  if (!password) {
    return next(new appError("Please provide password", 400));
  }

  // 3) Check if user exists
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    return next(new appError("Incorrect email or password", 401));
  }

  const user = rows[0];

  // 4) Check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return next(new appError("Incorrect email or password", 401));
  }

  // 5) Everything is OK — create token
  const token = signToken(user.id);

  // 6) Send token to client
  res.status(200).json({
    status: "success",
    token,
    data: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

// protect 

const protect = catchAsync(async (req, res, next) => {
  // 1) Get token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new appError("You are not logged in. Please log in to get access.", 401));
  }

  // 2) Verify token (with friendly errors) nad verification token 
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new appError("Your token has expired. Please log in again.", 401));
    }
    return next(new appError("Invalid token. Please log in again.", 401));
  }

  // 3) Check user exists
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [decoded.id]);
  if (rows.length === 0) {
    return next(new appError("The user belonging to this token no longer exists.", 401));
  }

  // 4) Attach user and continue
  req.user = rows[0];
  next();
});

// restrictTo 
const restrictTo = (...role) => {
  return (req,res,next) => {
    if (!role.includes(req.user.role)) {
      return next(new appError("you do not have permission to perform this action", 403));
    }
    next();
  }
}


module.exports = {
    signup,
    login,
    protect,
    restrictTo,
}
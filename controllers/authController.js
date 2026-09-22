
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
const sendEmail = require("../utils/email.js");
const crypto = require("crypto");


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
// this  related  for delete me ========================================================
  if (!user.active) {
  return next(
    new appError("Your account has been deactivated. Please contact support.", 403)
  );
}
// =======================================================================================

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

  // this is code related delete me ==============================================
  if (!rows[0].active) {
  return next(new appError("This account has been deactivated.", 403));
}
// =========================================================================

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

// forgot password
const forgotPassword = catchAsync(async (req,res,next) => {
  // get user based on posted email
  const {email} = req.body;
  if (!email) {
    return next (new appError("there is no user with email address", 400));
  }
  const [rows] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email])
  // if (!user) {
  //   return next(new appError("there is no user with email address", 404));
  // }
  if (rows.length === 0) {
    return next (new appError("there is no user with email address", 404));
  }

  const user = rows[0];
  // generate random reset token
  const resetToken = crypto.randomBytes(32).toString("hex");

    // 4) Hash the token and save it in the DB with an expiry
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min from now

  await pool.query(
    "UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?",
    [hashedToken, expiresAt, user.id]
  );

  // 5) Build the reset link and send the email
  const resetURL = `${req.protocol}://${req.get("host")}/api/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password? Click this link to reset it: ${resetURL}\nIf you did not request this, please ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    // If email fails, clear the token from the DB
    await pool.query(
      "UPDATE users SET password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?",
      [user.id]
    );
    return next(new appError("Error sending email. Try again later.", 500));
  }
});

// PASSWORD RESET 
// ---- resetPassword ----
const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Hash the URL token and find the matching user
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const [rows] = await pool.query(
    "SELECT * FROM users WHERE password_reset_token = ? AND password_reset_expires > NOW()",
    [hashedToken]
  );

  if (rows.length === 0) {
    return next(new appError("Token is invalid or has expired", 400));
  }

  const user = rows[0];

  // 2) Validate the new password
  const { password, passwordConfirm } = req.body;
  if (!password || !passwordConfirm) {
    return next(new appError("Please provide password and passwordConfirm", 400));
  }
  if (password !== passwordConfirm) {
    return next(new appError("Passwords do not match", 400));
  }

  // 3) Hash new password and save; clear the reset fields
  const hashedPassword = await bcrypt.hash(password, 12);

  await pool.query(
    "UPDATE users SET password = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?",
    [hashedPassword, user.id]
  );

  // 4) Log the user in — send a fresh JWT
  const token = signToken(user.id);

  res.status(200).json({
    status: "success",
    token,
  });
});

const updateMyPassword  = catchAsync(async(req,res,next) => {
    // 1) Get the current user from the DB
  const [rows] = await pool.query(`SELECT * FROM users WHERE id = ?`, [req.user.id]);

  if (rows.length === 0) {
    return next(new appError("User not found",404));
  }

  const user = rows[0];
  // 2) Check the current password is correct
  const {currentPassword, newPassword,newPasswordConfirm} = req.body;

  if (!currentPassword || !newPassword ||!newPasswordConfirm) {
    return next (new appError("Please provide currentPassword, newPassword, and newPasswordConfirm" , 400));
  }

  
  // 3) Verify the current password is correct
  const iscurrent = await bcrypt.compare(currentPassword , user.password);
  if (!iscurrent) {
    return next (new appError("Your current password is wrong", 401));
  }

  
  // 4) Make sure the two new passwords match

  if (newPassword != newPasswordConfirm) {
    return next(new appError("New passwords do not match" , 400));
  }
    // 5) Hash the new password and save it

    const hashedPassword = await bcrypt.hash(newPassword, 12);

     await pool.query(
    "UPDATE users SET password = ? WHERE id = ?",
    [hashedPassword, user.id]
  );

  // 6) Send a fresh JWT so the user stays logged in
  const token = signToken(user.id);

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
    token,
  });

});

// update me part is start --------------------------------------------------
// Helper: only allow these fields to be updated via updateMe
const filterObj = (obj , ...allowedfields) => {
  const newObg = {};
  Object.keys(obj).forEach((keys) => {
    if (allowedfields.includes(keys)) newObg[keys] = obj[keys];
  });
  return newObg;
}

// update me 
const updateMe = catchAsync(async (req,res,next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next (new appError( "This route is not for password updates. Please use /updateMyPassword.",400));
  }

  const filteredBody = filterObj(req.body, "name","email");
  if (Object.keys(filteredBody).length === 0) {
    return next (new appError("Please provide name or email to update", 400));
  }
  await pool.query (`UPDATE users SET ? WHERE id = ?`, [filteredBody, req.user.id]);

  const [rows] = await pool.query(`SELECT id ,name, email, role FROM users WHERE id = ?`,[req.user.id]);

  res.status (200).json({
    status: "successful",
    data : {
      user : rows[0]
    }
  });
});

// delete me 
const deleteMe = catchAsync(async(req,res,next) => {
  await pool.query(`UPDATE users SET active = 0 WHERE id = ?`,[req.user.id]);
  res.status(204).json({
    status: "successful",
    data: null
  });
});





module.exports = {
    signup,
    login,
    protect,
    restrictTo,
    forgotPassword,
    resetPassword ,
    updateMyPassword,
    updateMe,
    deleteMe,
}
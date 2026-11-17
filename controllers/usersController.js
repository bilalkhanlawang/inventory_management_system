const { pool } = require("../config/db.js");  // or const pool = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");
const appError = require("../errorHandeling/appError.js");
const bcrypt = require("bcryptjs");


// get all data from users table 
const getAllData = catchAsync(async (req,res,next) => {
    const [rows] = await pool.query(` SELECT id, name, email, role, active, created_at FROM users`);
    if (rows.length === 0) {
        return next (new appError("users not found",404));
    }
    res.status(200).json(rows)
});

// get data by id from table users

const getDataById = catchAsync(async (req, res, next) => {
    const {id} = req.params;
  const [rows] = await pool.query(
    "SELECT id, name, email, role, active, created_at FROM users WHERE id = ?",[id] );

  if (rows.length === 0) {
    return next(new appError("user not found", 404));
  }

  res.status(200).json(rows);
});


// create datain to users table 

const createData = catchAsync(async (req, res, next) => {
  const { name, email, password,passwordConfirm,  role } = req.body;

  if (!name || !email || !password || !passwordConfirm) {
    return next(new appError("Please provide name, email and password and passwordConfirm", 400));
  }

// check data type

if (typeof name != 'string') {
    return next(new appError("name must be a string" , 400));
}

if (typeof email != 'string') {
    return next(new appError("email must be a string" , 400));
}

if (typeof password != 'string') {
    return next(new appError("password must be a string" , 400));
}

if (typeof passwordConfirm != 'string') {
    return next(new appError("password confirmation must be a string" , 400));
}

if (role != undefined && typeof role != 'string') {
    return next(new appError("role must be a string" , 400));
}

if (password != passwordConfirm) {
    return next(new appError("password are not the same" , 400));
}

// email validition 
// if (|/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) 
  
  
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    return next(new appError("please provide a valid email",400));
}
// check email
const [existingUser] = await pool.query(`SELECT id FROM users WHERE email = ?`,[email]);

if (existingUser.length > 0) {
    return next(new appError("this email is already registered" , 400));
}
// check roles
const selectedRole = role || "user";
if (!['admin', 'user'].includes(selectedRole)) {
  return next (new appError('invalid role' , 400));
}

// hash password
const hashedPassword = await bcrypt.hash(password , 12);


  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword,selectedRole  || "user"]
  );

  res.status(201).json({
    id: result.insertId,
    name,
    email,
    // role: role || "user"
    role: selectedRole,
    active: true
  });
});


// update data 


const updateData = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, password, passwordConfirm, role } = req.body;

  // 1. Check data types
  if (name !== undefined && typeof name !== 'string') {
    return next(new appError('name must be string', 400));
  }

  if (email !== undefined && typeof email !== 'string') {
    return next(new appError('email must be string', 400));
  }

  if (role !== undefined && typeof role !== 'string') {
    return next(new appError('role must be string', 400));
  }

  // 2. Password check (Prevent password updates on this route)
  if (password || passwordConfirm) {
    return next(new appError('This route is not for updating passwords. Please use the password reset route.', 400));
  }

  // 3. Check required fields (Prevent empty strings)
  if (!name && name !== undefined) {
    return next(new appError("Please provide your name", 400));
  }

  if (!email && email !== undefined) {
    return next(new appError("Please provide your email", 400));
  }

  // 4. Check role validity
  if (role && !['admin', 'user'].includes(role)) {
    return next(new appError('Invalid role', 400));
  }

  // 5. Check email validity and uniqueness
  if (email) {
    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return next(new appError("Please provide a valid email", 400));
    }

    // Check if email is already taken by ANOTHER user (id != ?)
    // FIXED: FROM instead of FORM, and != instead of =
    const [existingUser] = await pool.query(
      `SELECT id FROM users WHERE email = ? AND id != ?`, 
      [email, id]
    );

    // FIXED: This check is now INSIDE the if(email) block
    if (existingUser.length > 0) {
      return next(new appError('This email is already registered', 400));
    }
  }

  // 6. Update the user in the database
  const [result] = await pool.query(
    `UPDATE users
     SET name = COALESCE(?, name),
     email = COALESCE(?, email),
     role = COALESCE(?, role)
     WHERE id = ?`, 
    [name ?? null, email ?? null, role ?? null, id]
  );

  // 7. Check if user existed and was updated
  if (result.affectedRows === 0) {
    return next(new appError("No user found with that ID", 404));
  }

  // 8. Get the updated user data to send back
  // FIXED: Added comma between role and active
  const [rows] = await pool.query(
    `SELECT id, name, email, role, active FROM users WHERE id = ?`, 
    [id]
  );

  // 9. Send response
  res.status(200).json({
    status: "successful",
    data: rows[0],
  });
});

// delete data from table users

const deleteUser = catchAsync(async(req,res,next) => {
  const {id} = req.params;
  // const [result] = await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
  const [result] = await pool.query(`UPDATE users SET active = false WHERE id = ?`,[id]);

// check if user existing 

if (result.affectedRows === 0) {
  return next(new appError("no user found with that id ",404));
}

res.status(200).json({
  status: "successful",
  message: "user has been deactivated successfully"
});

});



module.exports = {
    getAllData,
    getDataById,
    createData,
    updateData,
    deleteUser
}
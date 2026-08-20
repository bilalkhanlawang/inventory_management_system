
// const {pool} = require ("../config/db.js");
// const catchAsync = require("../errorHandeling/catchAsync.js");
// const appError = require("../errorHandeling/appError.js")

// // for fatch all data 
// const getCategories = async (req , res) =>  {
//     try{
//         const [rows] = await pool.query(`SELECT *  FROM categories`);
//         res.status(200).json(rows);
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server 1 error"});
//     }
// }

// // for fatch  one data by id  

// const getCategoryById = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const [rows] = await  pool.query(
//             `
//             SELECT * FROM categories WHERE category_id = ?` ,
//         [id]
//     );
//     res.status(200).json(rows);
//     } catch(error) {
//         console.log(error);
//         res.status(500).json({message: "Server error"});
//     }
// }

// // create data 

// const createData = async(req,res) => {
//     try{
//             const {name} = req.body;
//             const [result] = await pool.query(
//                 `INSERT INTO categories(category_name) VALUES(?)`,
//                 [name]
//             );
//             res.status(201).json({
//                 status: "successful",
//                 message: "category is created",
//                 data: {
//                     id: result.insertId,
//                     category_name:name
//                 }
//             });
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }

// // for update data 
// const updateCategory = async (req,res) => {
//     try{
//         const {id} = req.params;
//         const {name} =  req.body;
//     const [result] = await pool.query
//     (
//         `UPDATE categories SET category_name = ? WHERE category_id = ?`,
//         [name, id]
//     );
//     if (result.affectedRows === 0) {
//         return res.status(404).json({
//             message: "category not found"
//         });
//     }
//     res.status(200).json({
//         status: "successful",
//         message:"category is updated"
//     });
//     }  catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
//     }

//     // for delete data 
//     const deleteCategory = async (req,res) => {
//         try {
//             const {id} = req.params;
//             const [result] = await pool.query
//             (`DELETE FROM categories WHERE  category_id = ?`,
//                 [id]
//             );
//             if (result.affectedRows === 0) {
//                 return res.status(404).json({messange: "category is not found"});
//             }
//             res.status(200).json({
//                 status: "successful",
//                 message: "category is deleted"
//             });
//         }catch(error) {
//             console.log(error);
//             res.status(500).json({message: "server errro"});
//         }
//     }





// this code has a problem 

// // for get all data 
// const getCategories = catchAsync (async (req,res,next) => {
//      const [rows] = await pool.query(`SELECT *  FROM categories`);

//     //  error handeling 
//     if (rows.length === 0) {
//         return next(new appError('categories not found ', 404));
//     }
//     res.statau(200).json(rows);
// });
// // for get one id
// const getCategoryById = catchAsync(async(req,res,next) => {
//     const {id} = req.params;
//     const [rows] = await pool.query(` SELECT * FROM categories WHERE category_id = ?`,[id]);

//      if (rows.length === 0) {
//         return next(new appError("categories not found with this id", 404));
//      }
//      res.status(200).json(rows);
// });

// // for post method

// const createData = catchAsync(async(req,res,next) => {
    
//     const {name} = req.body;
//              const [result] = await pool.query(`INSERT INTO categories(category_name) VALUES(?)`,[name]);
//              res.status(201).json({message: "category created", status: "successful" , id:result.insertId});
// }),
// // for update data

//  const updateCategory = catchAsync(async(req,res,next) => {
//     const {id} = req.params;
//     const {name} = req.body;
//     const [result] = await pool.query(`UPDATE categories SET category_name = ? WHERE category_id = ?`,
//         [name, id]);
//         if (!result.affectedRows) {
//             return next(new appError("category not found ", 404));
//         }
//         res.status(200).json({message : "category updated" , status: "successful"});
// });







// // for delete 
//  const deleteCategory = catchAsync (async (req,res,next) => {
//     const {id} = req.params;
//     const [result] = await pool.query(`DELETE FROM categories WHERE  category_id = ?`,[id]);
//     if (!result.affectedRows) {
//         return next(new appError("category not found" , 404));
//     }
//     res.status(200).json({message: "category deleted" , status: "successful"});
// });







const { pool } = require("../config/db.js");  // or const pool = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");
const appError = require("../errorHandeling/appError.js");

const getCategories = catchAsync(async(req, res, next) => {
    const [rows] = await pool.query(`SELECT * FROM categories`);
    
    if (rows.length === 0) {
        return next(new appError('Categories not found', 404));
    }
    res.status(200).json(rows);  // ✅ Fixed typo
});

const getCategoryById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query(`SELECT * FROM categories WHERE category_id = ?`, [id]);
    
    if (rows.length === 0) {
        return next(new appError("Category not found with this id", 404));
    }
    res.status(200).json(rows);
});

const createData = catchAsync(async(req, res, next) => {
    const { name } = req.body;
    const [result] = await pool.query(`INSERT INTO categories(category_name) VALUES(?)`, [name]);
    res.status(201).json({ message: "Category created", status: "successful", id: result.insertId });
});  // ✅ Fixed semicolon

const updateCategory = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const [result] = await pool.query(`UPDATE categories SET category_name = ? WHERE category_id = ?`, [name, id]);
    
    if (!result.affectedRows) {
        return next(new appError("Category not found", 404));
    }
    res.status(200).json({ message: "Category updated", status: "successful" });
});

const deleteCategory = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM categories WHERE category_id = ?`, [id]);
    
    if (!result.affectedRows) {
        return next(new appError("Category not found", 404));
    }
    res.status(200).json({ message: "Category deleted", status: "successful" });
});

module.exports = {
    getCategories,
    getCategoryById,
    createData,
    updateCategory,
    deleteCategory
};


// const {pool} = require("../config/db.js");

// // for get all data
// const getAllData = async (req,res) => {
//     try {
//         const [rows] = await pool.query(`SELECT * FROM vendors`);
//         res.status(200).json(rows);
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }

// // for fatch one data
// const getVendorById = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const [rows] = await pool.query(`SELECT * FROM vendors WHERE vendor_id = ?` , [id]);
//         res.status(200).json(rows);
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }
// // for create data
// const createData = async  (req,res) => {
//     try {
//         const {name} = req.body;
//         const [result] = await pool.query(`INSERT INTO vendors(vendor_name)VALUES(?)` , [name]);
//         res.status(201).json({status: "successful" , message : "vendor is created" , data:{id: result.insertId,vendor_name:name}});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message:"server error"});
//     }
// }
// // for update data
// const updateData = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const {name} = req.body;
//         const[result] = await pool.query(`UPDATE vendors SET vendor_name = ? WHERE vendor_id = ?`,[name,id]);
//         if (result.affectedRows === 0){
//             return res.status(404).json({message:"vendor is not found"});
//         }
//         res.status(200).json({status: "successful" , message: "vendor is updated"});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message : "server error"});
//     }
// }
// // for delete data
// const deleteData = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const [result] = await pool.query(`DELETE FROM vendors WHERE vendor_id = ?` , [id]);
//         if (result.affectedRows === 0) {
//             return res.status(404).json({message:"vendor is not found"});
//         }
//         res.status(200).json({status: "successful" , message: "vendor is deleted"});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message:"server error"});
//     }
// }

// module.exports = {
//     getAllData,
//     getVendorById,
//     createData,
//     updateData,
//     deleteData
// }








const { pool } = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");
const appError = require("../errorHandeling/appError.js");

// for get all data
const getAllData = catchAsync(async(req, res, next) => {
    const [rows] = await pool.query(`SELECT * FROM vendors`);
    
    if (rows.length === 0) {
        return next(new appError('vendors not found', 404));
    }
    res.status(200).json(rows);
});

// for fatch one data
const getVendorById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query(`SELECT * FROM vendors WHERE vendor_id = ?`, [id]);
    
    if (rows.length === 0) {
        return next(new appError("vendor not found with this id", 404));
    }
    res.status(200).json(rows);
});

// for create data
const createData = catchAsync(async(req, res, next) => {
    const { name } = req.body;
    const [result] = await pool.query(`INSERT INTO vendors(vendor_name)VALUES(?)`, [name]);
    res.status(201).json({
        status: "successful",
        message: "vendor is created",
        data: { id: result.insertId, vendor_name: name }
    });
});

// for update data
const updateData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const [result] = await pool.query(`UPDATE vendors SET vendor_name = ? WHERE vendor_id = ?`, [name, id]);
    
    if (!result.affectedRows) {
        return next(new appError("vendor is not found", 404));
    }
    res.status(200).json({ status: "successful", message: "vendor is updated" });
});

// for delete data
const deleteData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM vendors WHERE vendor_id = ?`, [id]);
    
    if (!result.affectedRows) {
        return next(new appError("vendor is not found", 404));
    }
    res.status(200).json({ status: "successful", message: "vendor is deleted" });
});

module.exports = {
    getAllData,
    getVendorById,
    createData,
    updateData,
    deleteData
}
// const {pool} = require ("../config/db.js");

// // for fatch all data
// const getUnit = async (req,res) => {
//     try{
//     const [rows] = await pool.query
//     ( `SELECT * FROM units`);
//     res.status(200).json(rows);
//     }
//     catch(error) {
//     console.log(error);
// }
// }

// // fatch one data 

// const getUnitById = async (req,res) => {
//     try{
//     const {id} = req.params;
//     const [rows] = await pool.query(`SELECT * FROM units WHERE unit_id = ?`, [id]);
//     res.status(200).json(rows);
// }catch(error) {
//     console.log(error);
//     res.status(500).json({message: "server error"});
// }
// }

// // for create data 

// const createData = async (req,res) => {
//     try {
//         const {name} = req.body;
//         const [result] = await pool.query(`INSERT INTO units(unit_name)VALUES(?)`, [name]);
//         res.status(201).json({status: "successful", message: "units is created",
//              data:{id:result.insertId, unit_name:name}});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }


// // for update data 
// const updateData = async (req,res) => {
//     try {
//     const {id} = req.params;
//     const {name} = req.body;
//     const [result] = await pool.query(`UPDATE units SET unit_name = ? WHERE unit_id = ?`,[name , id]);
//     if (result.affectedRows === 0) {
//         return res.status(404).json({status: "units not found"});
//     }
//     res.status(200).json({status: "successful", message: "units is updated"});
// }catch(error) {
//     console.log(error);
//     res.status(500).json({message:"server error"});
// }     
// }

// // for delete data 

// const deleteData = async (req,res) => {
//     try{
//         const {id} = req.params;
//         const [result] = await pool.query(`DELETE FROM units WHERE unit_id = ?`, [id]);
//         if (result.affectedRows === 0) {
//             return res.status(404).json({message: "units not found"});
//         }
//         res.status(200).json({status: "successful", message: "unit is deleted"});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }





// module.exports = {
//     getUnit,
//     getUnitById,
//     createData,
//     updateData,
//     deleteData
// }






const { pool } = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");
const appError = require("../errorHandeling/appError.js");

// for fatch all data
const getUnit = catchAsync(async(req, res, next) => {
    const [rows] = await pool.query(`SELECT * FROM units`);
    
    if (rows.length === 0) {
        return next(new appError('units not found', 404));
    }
    res.status(200).json(rows);
});

// fatch one data 
const getUnitById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query(`SELECT * FROM units WHERE unit_id = ?`, [id]);
    
    if (rows.length === 0) {
        return next(new appError("unit not found with this id", 404));
    }
    res.status(200).json(rows);
});

// for create data 
const createData = catchAsync(async(req, res, next) => {
    const { name } = req.body;
    const [result] = await pool.query(`INSERT INTO units(unit_name)VALUES(?)`, [name]);
    res.status(201).json({
        status: "successful",
        message: "units is created",
        data: { id: result.insertId, unit_name: name }
    });
});

// for update data 
const updateData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const [result] = await pool.query(`UPDATE units SET unit_name = ? WHERE unit_id = ?`, [name, id]);
    
    if (!result.affectedRows) {
        return next(new appError("units not found", 404));
    }
    res.status(200).json({ status: "successful", message: "units is updated" });
});

// for delete data 
const deleteData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM units WHERE unit_id = ?`, [id]);
    
    if (!result.affectedRows) {
        return next(new appError("units not found", 404));
    }
    res.status(200).json({ status: "successful", message: "unit is deleted" });
});

module.exports = {
    getUnit,
    getUnitById,
    createData,
    updateData,
    deleteData
}
// const {pool} = require ("../config/db.js");

// // for get all data 
// const getAllData = async (req,res) => {
//     try{
//     const [rows] = await pool.query( `SELECT * FROM currencies`,);
//     res.status(200).json(rows);
//    }catch(error) {
//     console.log(error);
//     res.status(500).json({message: "server error"});
//    } 
// }

// // for fatch one data by single id 

// const getCategoriesById = async (req,res) => {
//     try{
//         const {id} = req.params;
//         const [rows] = await pool.query(`SELECT * FROM currencies WHERE currency_id = ?` ,[id]);
//         res.status(200).json(rows);
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});

//     }
// }

// // for create data
// const createDataCurrency = async (req,res) => {
//     try{
//     const {name} = req.body;
//     const [result] = await pool.query(`INSERT INTO currencies(currency_name)VALUES(?)` , [name]);
//     res.status(201).json({status: "successful" , message: "created data" , data: {id: result.insertId, currency_name: name}});
//     }catch(error){
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }

// // for update data 

// const updateData = async (req,res) => {
//     try{
//         const {id} = req.params;
//         const {name} = req.body;
//         const [result] = await pool.query(`UPDATE currencies SET currency_name = ? WHERE currency_id = ?` , [name, id]);
//         if (result.affectedRows === 0) {
//             return res.status(404).json({message: "currencies is not found"});
//         }
//         res.status(200).json({status: "successful" , message: "currency id updated"});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }

// // for delete data
// const deleteData = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const [result] = await pool.query(`DELETE FROM currencies WHERE currency_id = ?` , [id]);
//         if (result.affectedRows === 0) {
//             return res.status(404).json({message: "currencies is not found"});
//         }
//         res.status(200).json({  status: "successful",message: "currency is deleted"});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }


// module.exports = {
//     getAllData,
//     getCategoriesById,
//     createDataCurrency,
//     updateData,
//     deleteData
// }



const { pool } = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");
const appError = require("../errorHandeling/appError.js");

// for get all data 
const getAllData = catchAsync(async(req, res, next) => {
    const [rows] = await pool.query(`SELECT * FROM currencies`);
    
    if (rows.length === 0) {
        return next(new appError('currencies not found', 404));
    }
    res.status(200).json(rows);
});

// for fatch one data by single id 
const getCategoriesById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query(`SELECT * FROM currencies WHERE currency_id = ?`, [id]);
    
    if (rows.length === 0) {
        return next(new appError("currencies not found with this id", 404));
    }
    res.status(200).json(rows);
});

// for create data
const createDataCurrency = catchAsync(async(req, res, next) => {
    const { name } = req.body;
    const [result] = await pool.query(`INSERT INTO currencies(currency_name) VALUES(?)`, [name]);
    res.status(201).json({ status: "successful", message: "created data", data: { id: result.insertId, currency_name: name } });
});

// for update data 
const updateData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const [result] = await pool.query(`UPDATE currencies SET currency_name = ? WHERE currency_id = ?`, [name, id]);
    
    if (!result.affectedRows) {
        return next(new appError("currencies is not found", 404));
    }
    res.status(200).json({ status: "successful", message: "currency id updated" });
});

// for delete data
const deleteData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM currencies WHERE currency_id = ?`, [id]);
    
    if (!result.affectedRows) {
        return next(new appError("currencies is not found", 404));
    }
    res.status(200).json({ status: "successful", message: "currency is deleted" });
});

module.exports = {
    getAllData,
    getCategoriesById,
    createDataCurrency,
    updateData,
    deleteData
};

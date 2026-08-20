// const {pool} = require("../config/db.js");

// // for get all data
// const getAllData = async (req,res) =>{
//     try {
//         const [rows] = await pool.query(`SELECT * FROM customers`);
//         res.status(200).json(rows);
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message:"server error"});
//     }
// }

// // for get one id 
// const getDataById = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const [rows] = await pool.query(`SELECT * From customers WHERE customer_id = ?`, [id]);
//         res.status(200).json(rows);
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }

// // for create data 
// const createData = async (req,res)  => {
//     try{
//         const {name} = req.body;
//         const [result] = await pool.query(`INSERT INTO customers(customer_name)VALUES(?)`, [name]);
//         res.status(201).json({status: "successful" , message: "customer created" , 
//             data: {id: result.insertId, customer_nmae : name}});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }

// // for update customer
// const updateData = async (req,res) => {
//     try {
//          const {id} = req.params;
//          const {name} = req.body;
//          const [result] = await pool.query(`UPDATE customers SET customer_name = ? WHERE customer_id = ?`, [name,id]);
//          if (result.affectedRows === 0) {
//             return res.status(404).json({message: "customer is not found"});
//          }
//          res.status(200).json({status: "successful", message: "customer is updated"});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
   
// }

// // for delete data
// const deleteData = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const [result] = await pool.query(`DELETE FROM customers WHERE customer_id = ?`, [id]);
//         if (result.affectedRows === 0) {
//             return res.status(404).json({message: "customer is not found"});
//         }
//         res.status(200).json({status: "successful" , message : "customer deleted"});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }


// module.exports = {
//     getAllData,
//     getDataById,
//     createData,
//     updateData,
//     deleteData
// }





const { pool } = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");
const appError = require("../errorHandeling/appError.js");

// for get all data
const getAllData = catchAsync(async(req, res, next) => {
    const [rows] = await pool.query(`SELECT * FROM customers`);
    
    if (rows.length === 0) {
        return next(new appError('customers not found', 404));
    }
    res.status(200).json(rows);
});

// for get one id 
const getDataById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query(`SELECT * From customers WHERE customer_id = ?`, [id]);
    
    if (rows.length === 0) {
        return next(new appError("customer not found with this id", 404));
    }
    res.status(200).json(rows);
});

// for create data 
const createData = catchAsync(async(req, res, next) => {
    const { name } = req.body;
    const [result] = await pool.query(`INSERT INTO customers(customer_name)VALUES(?)`, [name]);
    res.status(201).json({ 
        status: "successful", 
        message: "customer created", 
        data: { id: result.insertId, customer_nmae: name }
    });
});

// for update customer
const updateData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;
    const [result] = await pool.query(`UPDATE customers SET customer_name = ? WHERE customer_id = ?`, [name, id]);
    
    if (!result.affectedRows) {
        return next(new appError("customer is not found", 404));
    }
    res.status(200).json({ status: "successful", message: "customer is updated" });
});

// for delete data
const deleteData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM customers WHERE customer_id = ?`, [id]);
    
    if (!result.affectedRows) {
        return next(new appError("customer is not found", 404));
    }
    res.status(200).json({ status: "successful", message: "customer deleted" });
});

module.exports = {
    getAllData,
    getDataById,
    createData,
    updateData,
    deleteData
}
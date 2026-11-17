// const {pool} = require ("../config/db.js");
// // for get all data 
// const getAllData = async (req,res) => {
//     try {
//     const [rows] = await pool.query
//     (`SELECT spa.allocation_id,sd.sale_detail_id,pd.purchase_detail_id,spa.allocated_quantity FROM sales_purchase_allocation spa
//         LEFT JOIN sales_details sd ON aps.sale_detail_id = sd.sale_detail_id
//         LEFT JOIN purchase_details sd ON spa.purchase_detail_id = pd.purchase_detail_id
    
//         `);
//         res.status(200).json(rows);
//     }catch (error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }    
// }
// // for get one id of sales_details table
// const getDataById = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const [rows] = await pool.query (`SELECT spa.allocation_id,sd.sale_detail_id,pd.purchase_detail_id,spa.allocated_quantity FROM sales_purchase_allocation spa
//         LEFT JOIN sales_details sd ON aps.sale_detail_id = sd.sale_detail_id
//         LEFT JOIN purchase_details sd ON spa.purchase_detail_id = pd.purchase_detail_id
//      WHERE sale_detail_id = ?
//         ` , [id]);
//          if (rows.affectedRows === 0) {
//                 return res.status(404).json({message:"sales_details_allocation not found"});
//             }
//         res.status(200).json(rows);
//     }catch (error) {
//         console.log(error);
//         res.status(500).josn
//     }
// }
// // for create data to sales details table
// const createData = async (req,res) => {
//     try {
//         const {sale_detail_id,purchase_detail_id,allocated_quantity} = req.body;
//         const [result] = await pool.query
//         (`INSERT INTO sales_purchase_allocation(sale_detail_id,purchase_detail_id,allocated_quantity)VALUES(?,?,?)`,
//             [sale_detail_id,purchase_detail_id,allocated_quantity]);
//             res.status(201).json({status: "successful" , message: "sales_purchase allocation created" , data: {
//                 id:result.insertId,
//             sale_detail_id: sale_detail_id,
//             purchase_detail_id:purchase_detail_id,
//             allocated_quantity:allocated_quantity
//             }});
//     }catch (error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }

// // for update data
// const updateData = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const{sale_detail_id,purchase_detail_id,allocated_quantity} = req.body;
//         const [result] = await pool.query 
//         (`UPDATE sales_details SET sale_detail_id = ?, purchase_detail_id = ?, allocated_quantity = ? WHERE sales_purchase_allocation = ?`,
//             [sale_detail_id,purchase_detail_id,allocated_quantity,id]);
//             if (result.affectedRows === 0) {
//                 return res.status(404).json({message: "sales_purchase_allocation not found"});
//             }
//             res.status(200).json({status: "successful" , message: "sales_purchase_allocation updated"});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }
// // for delete purchase details from table 
// const deleteData = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const [result] = await pool.query
//         (`DELETE FROM sales_purchase_allocation WHERE allocation_id = ?`, [id]);
//         if (result.affectedRows === 0) {
//             return res.status(404).json({message: "server error"});
//         }
//         res.status(200).json({status: "successful" , message: "sales_purchase_allocation deleted"});
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
    const [rows] = await pool.query(
        `SELECT spa.allocation_id,sd.sale_detail_id ,pd.purchase_detail_id,spa.allocated_quantity FROM sales_purchase_allocation spa
        LEFT JOIN sales_details sd ON spa.sale_detail_id = sd.sale_detail_id
        LEFT JOIN purchase_details pd ON spa.purchase_detail_id = pd.purchase_detail_id
        `
    );
    
    if (rows.length === 0) {
        return next(new appError('sales_purchase_allocation not found', 404));
    }
    res.status(200).json(rows);
});

// for get one id of sales_details table
const getDataById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query(
        `SELECT spa.allocation_id,sd.sale_detail_id ,pd.purchase_detail_id,spa.allocated_quantity FROM sales_purchase_allocation spa
        LEFT JOIN sales_details sd ON spa.sale_detail_id = sd.sale_detail_id
        LEFT JOIN purchase_details sd ON spa.purchase_detail_id = pd.purchase_detail_id
        WHERE sale_detail_id = ?
        `, [id]);
    
    if (rows.length === 0) {
        return next(new appError("sales_details_allocation not found with this id", 404));
    }
    res.status(200).json(rows);
});

// for create data to sales details table
const createData = catchAsync(async(req, res, next) => {
    const { sale_detail_id, purchase_detail_id, allocated_quantity } = req.body;
    const [result] = await pool.query(
        `INSERT INTO sales_purchase_allocation(sale_detail_id,purchase_detail_id,allocated_quantity)VALUES(?,?,?)`,
        [sale_detail_id, purchase_detail_id, allocated_quantity]
    );
    res.status(201).json({
        status: "successful",
        message: "sales_purchase allocation created",
        data: {
            id: result.insertId,
            sale_detail_id: sale_detail_id,
            purchase_detail_id: purchase_detail_id,
            allocated_quantity: allocated_quantity
        }
    });
});

// for update data
const updateData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { sale_detail_id, purchase_detail_id, allocated_quantity } = req.body;
    const [result] = await pool.query(
        `UPDATE sales_purchase_allocation SET sale_detail_id = ?, purchase_detail_id = ?, allocated_quantity = ? WHERE allocation_id = ?`,
        [sale_detail_id, purchase_detail_id, allocated_quantity, id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("sales_purchase_allocation not found", 404));
    }
    res.status(200).json({ status: "successful", message: "sales_purchase_allocation updated" });
});

// for delete purchase details from table 
const deleteData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query(
        `DELETE FROM sales_purchase_allocation WHERE allocation_id = ?`, [id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("sales_purchase_allocation not found", 404));
    }
    res.status(200).json({ status: "successful", message: "sales_purchase_allocation deleted" });
});

module.exports = {
    getAllData,
    getDataById,
    createData,
    updateData,
    deleteData
}
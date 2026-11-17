// const {pool} = require("../config/db.js");
// // FONR get all data of purchases table 
// const getAllData = async (req,res) => {
//     try {
//     const [rows] = await pool.query
//     (`
//         SELECT p.purchase_id,v.vendor_id,c.currency_id,p.purchase_date,p.invoice_no FROM purchases p
//         LEFT JOIN vendors v ON p.vendor_id = v.vendor_id
//         LEFT JOIN currencies c ON p.currency_id = c.currency_id`);
//         res.status(200).json(rows);
//     }catch (error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }
// // for get one data of purchases table
// const getPurchaseById = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const [rows] = await pool.query
        
//     (`
//         SELECT p.purchase_id,v.vendor_id,c.currency_id,p.purchase_date,p.invoice_no FROM purchases p
//         LEFT JOIN vendors v ON p.vendor_id = v.vendor_id
//         LEFT JOIN currencies c ON p.currency_id = c.currency_id WHERE purchase_id = ?`,[id]);
//         if (rows.affectedRows === 0) {
//             return res.status(404).json({message: "purchases not found"});
//         }
//         res.status(200).json(rows);
//     }catch (error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }
// // create data of purchases table 
// const createData = async (req,res) => {
//     try {
//         const {vendor_id, currency_id , purchase_date,invoice_no} = req.body;
//         const [result] = await pool.query
//         (`INSERT INTO purchases(vendor_id,currency_id,purchase_date,invoice_no)VALUES(?,?,?,?)`,
//             [vendor_id,currency_id,purchase_date,invoice_no]);
//             res.status(201).json({
//                 status: "successful",
//                 message: "purchases created",
//                 data : {
//                     id:result.insertId,
//                     vendor_id:vendor_id,
//                     currency_id:currency_id,
//                     purchase_date:purchase_date,
//                     invoice_no:invoice_no
//                 }
//             });
//     }catch (error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }
// // for update data of purchases table 
// const updateData = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const {vendor_id,currency_id,purchase_date,invoice_no} = req.body;
//         const [result] = await pool.query
//         (`UPDATE purchases SET vendor_id = ? ,currency_id = ?,purchase_date = ?,invoice_no = ? WHERE purchase_id = ?`,
//             [vendor_id,currency_id,purchase_date,invoice_no , id]);
//             if (result.affectedRows === 0) {
//                 return res.status(404).json({message: "purchases not found"});
//             }
//             res.status(200).json({message : "purchases updated"});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }
// // for delete data of purchases 
// const deleteData = async (req,res) => {
//     try {
        
//     const {id} = req.params;
//     const [result] = await pool.query(`DELETE FROM purchases WHERE purchase_id = ?`, [id]);
//     if (result.affectedRows === 0) {
//         return res.status(404).json({message: "purchases not found"});
//     }
//     res.status(200).json({status : "successful" , message : "purchases deleted"});
    
//     }catch (error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }

// module.exports = {
//     getAllData,
//     getPurchaseById,
//     createData,
//     updateData,
//     deleteData
// }







const { pool } = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");
const appError = require("../errorHandeling/appError.js");

// FONR get all data of purchases table 
const getAllData = catchAsync(async(req, res, next) => {
    const [rows] = await pool.query(
        `
        SELECT p.purchase_id,v.vendor_name,c.currency_name,p.purchase_date,p.invoice_no FROM purchases p
        LEFT JOIN vendors v ON p.vendor_id = v.vendor_id
        LEFT JOIN currencies c ON p.currency_id = c.currency_id`
    );
    
    if (rows.length === 0) {
        return next(new appError('purchases not found', 404));
    }
    res.status(200).json(rows);
});

// for get one data of purchases table
const getPurchaseById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query(
        `
        SELECT p.purchase_id,v.vendor_id,c.currency_id,p.purchase_date,p.invoice_no FROM purchases p
        LEFT JOIN vendors v ON p.vendor_id = v.vendor_id
        LEFT JOIN currencies c ON p.currency_id = c.currency_id WHERE purchase_id = ?`,
        [id]
    );
    
    if (rows.length === 0) {
        return next(new appError("purchases not found with this id", 404));
    }
    res.status(200).json(rows);
});

// create data of purchases table 
const createData = catchAsync(async(req, res, next) => {
    const { vendor_id, currency_id, purchase_date, invoice_no } = req.body;
    const [result] = await pool.query(
        `INSERT INTO purchases(vendor_id,currency_id,purchase_date,invoice_no)VALUES(?,?,?,?)`,
        [vendor_id, currency_id, purchase_date, invoice_no]
    );
    res.status(201).json({
        status: "successful",
        message: "purchases created",
        data: {
            id: result.insertId,
            vendor_id: vendor_id,
            currency_id: currency_id,
            purchase_date: purchase_date,
            invoice_no: invoice_no
        }
    });
});

// for update data of purchases table 
const updateData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { vendor_id, currency_id, purchase_date, invoice_no } = req.body;
    const [result] = await pool.query(
        `UPDATE purchases SET vendor_id = ?, currency_id = ?, purchase_date = ?, invoice_no = ? WHERE purchase_id = ?`,
        [vendor_id, currency_id, purchase_date, invoice_no, id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("purchases not found", 404));
    }
    res.status(200).json({ message: "purchases updated" });
});

// for delete data of purchases 
const deleteData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query(`DELETE FROM purchases WHERE purchase_id = ?`, [id]);
    
    if (!result.affectedRows) {
        return next(new appError("purchases not found", 404));
    }
    res.status(200).json({ status: "successful", message: "purchases deleted" });
});

module.exports = {
    getAllData,
    getPurchaseById,
    createData,
    updateData,
    deleteData
}
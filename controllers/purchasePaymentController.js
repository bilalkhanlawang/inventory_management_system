// const {pool} = require ("../config/db.js");
// // for get all data 
// const getAllData = async (req,res) => {
//     try {
//     const [rows] = await pool.query
//     (`SELECT pp.payment_id,p.purchase_id,c.currency_id,pp.amount,pp.payment_date,v.vendor_id FROM purchase_payment pp
//         LEFT JOIN purchases p ON pp.purchase_id = p.purchase_id
//         LEFT JOIN currencies c ON pp.currency_id = c.currency_id
//         LEFT JOIN vendors v ON pp.vendor_id = v.vendor_id

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
//         const [rows] = await pool.query 
           
//     (`SELECT pp.payment_id,p.purchase_id,c.currency_id,pp.amount,pp.payment_date,v.vendor_id FROM purchase_payment pp
//         LEFT JOIN purchases p ON pp.purchase_id = p.purchase_id
//         LEFT JOIN currencies c ON pp.currency_id = c.currency_id
//         LEFT JOIN vendors v ON pp.vendor_id = v.vendor_id
//         WHERE payment_id = ?
//         ` , [id]);
//          if (rows.affectedRows === 0) {
//                 return res.status(404).json({message:"purchase_payment not found"});
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
//         const {payment_id,purchase_id,currency_id,amount,payment_date,vendor_id } = req.body;
//         const [result] = await pool.query
//         (`INSERT INTO purchase_payment(payment_id,purchase_id,currency_id,amount,payment_date,vendor_id)VALUES(?,?,?,?,?,?)`,
//             [payment_id,purchase_id,currency_id,amount,payment_date,vendor_id]);
//             res.status(201).json({status: "successful" , message: "purchase payment created" , data: {
//                 id:result.insertId,
//                 payment_id:payment_id,
//                 purchase_id:purchase_id,
//                 currency_id:currency_id,
//                 amount:amount,
//                 payment_date:payment_date,
//                 vendor_id:vendor_id
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
//         const{payment_id,purchase_id,currency_id,amount,payment_date,vendor_id} = req.body;
//         const [result] = await pool.query 
//         (`UPDATE purchase_payment SET  purchase_id = ?, currency_id = ?, amount = ?,
//             payment_date = ?,vendor_id = ? WHERE payment_id = ?`,
//             [purchase_id,currency_id,amount,payment_date,vendor_id,id]);
//             if (result.affectedRows === 0) {
//                 return res.status(404).json({message: "purchase_payment not found"});
//             }
//             res.status(200).json({status: "successful" , message: "purchase payment updated"});
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
//         (`DELETE FROM purchase_payment WHERE payment_id = ?`, [id]);
//         if (result.affectedRows === 0) {
//             return res.status(404).json({message: "server error"});
//         }
//         res.status(200).json({status: "successful" , message: "purchase payment deleted"});
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
        `SELECT pp.payment_id,p.purchase_id,c.currency_id,pp.amount,pp.payment_date,v.vendor_id FROM purchase_payment pp
        LEFT JOIN purchases p ON pp.purchase_id = p.purchase_id
        LEFT JOIN currencies c ON pp.currency_id = c.currency_id
        LEFT JOIN vendors v ON pp.vendor_id = v.vendor_id
        `);
    
    if (rows.length === 0) {
        return next(new appError('purchase_payment not found', 404));
    }
    res.status(200).json(rows);
});

// for get one id of sales_details table
const getDataById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query(
        `SELECT pp.payment_id,p.purchase_id,c.currency_id,pp.amount,pp.payment_date,v.vendor_id FROM purchase_payment pp
        LEFT JOIN purchases p ON pp.purchase_id = p.purchase_id
        LEFT JOIN currencies c ON pp.currency_id = c.currency_id
        LEFT JOIN vendors v ON pp.vendor_id = v.vendor_id
        WHERE payment_id = ?
        `, [id]);
    
    if (rows.length === 0) {
        return next(new appError("purchase_payment not found with this id", 404));
    }
    res.status(200).json(rows);
});

// for create data to sales details table
const createData = catchAsync(async(req, res, next) => {
    const { payment_id, purchase_id, currency_id, amount, payment_date, vendor_id } = req.body;
    const [result] = await pool.query(
        `INSERT INTO purchase_payment(payment_id,purchase_id,currency_id,amount,payment_date,vendor_id)VALUES(?,?,?,?,?,?)`,
        [payment_id, purchase_id, currency_id, amount, payment_date, vendor_id]
    );
    res.status(201).json({
        status: "successful",
        message: "purchase payment created",
        data: {
            id: result.insertId,
            payment_id: payment_id,
            purchase_id: purchase_id,
            currency_id: currency_id,
            amount: amount,
            payment_date: payment_date,
            vendor_id: vendor_id
        }
    });
});

// for update data
const updateData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { payment_id, purchase_id, currency_id, amount, payment_date, vendor_id } = req.body;
    const [result] = await pool.query(
        `UPDATE purchase_payment SET purchase_id = ?, currency_id = ?, amount = ?,
        payment_date = ?, vendor_id = ? WHERE payment_id = ?`,
        [purchase_id, currency_id, amount, payment_date, vendor_id, id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("purchase_payment not found", 404));
    }
    res.status(200).json({ status: "successful", message: "purchase payment updated" });
});

// for delete purchase details from table 
const deleteData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query(
        `DELETE FROM purchase_payment WHERE payment_id = ?`, [id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("purchase_payment not found", 404));
    }
    res.status(200).json({ status: "successful", message: "purchase payment deleted" });
});

module.exports = {
    getAllData,
    getDataById,
    createData,
    updateData,
    deleteData
}
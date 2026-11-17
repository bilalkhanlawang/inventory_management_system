// const {pool} = require ("../config/db.js");
// // for get all data from purchase details
// const getALLData = async (req,res) => {
//     try {
//         const [rows] = await pool.query
//          (`SELECT pd.purchase_detail_id,p.purchase_id, i.item_id,pd.quantity,pd.unit_price
//             FROM purchase_details pd
//             LEFT JOIN purchases p ON pd.purchase_id = p.purchase_id
//             LEFT JOIN items i ON pd.item_id = i.item_id
//             `);
//         res.status(200).json(rows);
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }

// // for get single data from purchase details
// const getDataById = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const [rows] = await pool.query 
//         (`SELECT pd.purchase_detail_id,p.purchase_id, i.item_id,pd.quantity,pd.unit_price
//             FROM purchase_details pd
//             LEFT JOIN purchases p ON pd.purchase_id = p.purchase_id
//             LEFT JOIN items i ON pd.item_id = i.item_id WHERE purchase_detail_id = ?
//             `,[id]);
//             if (rows.affectedRows === 0) {
//                 return res.status(404).json({message:"purchase_details not found"});
//             }
//             res.status(200).json({rows});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message:"server error"});
//     }
// }
// // for create purchase details to table
// const createPurchaseDetails = async (req,res) => {
//     try {
//         const {purchase_id,item_id,quantity,unit_price} = req.body;
//         const [result] = await pool.query
//         (`INSERT INTO purchase_details(purchase_id,item_id,quantity,unit_price)VALUES(?,?,?,?)`,
//             [purchase_id,item_id,quantity,unit_price]);
//             res.status(201).json({status: "successful" , message: "purchase_deltails created", data: {
//                 id:result.insertId,
//                 purchase_id:purchase_id,
//                 item_id:item_id,
//                 quantity:quantity,
//                 unit_price:unit_price

//             }});
//     }catch (error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }
// // for update purchase details 
// const updateData = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const{purchase_id,item_id,quantity,unit_price} = req.body;
//         const [result] = await pool.query 
//         (`UPDATE purchase_details SET purchase_id = ?, item_id = ?, quantity = ?, unit_price = ? WHERE purchase_detail_id = ?`,
//             [purchase_id,item_id,quantity,unit_price,id]);
//             if (result.affectedRows === 0) {
//                 return res.status(404).json({message: "purchase_details not found"});
//             }
//             res.status(200).json({status: "successful" , message: "purchase_details updated"});
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
//         (`DELETE FROM purchase_details WHERE purchase_detail_id = ?`, [id]);
//         if (result.affectedRows === 0) {
//             return res.status(404).json({message: "server error"});
//         }
//         res.status(200).json({status: "successful" , message: "purchase_details deleted"});
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }


// module.exports = {
//     getALLData,
//     getDataById,
//     createPurchaseDetails,
//     updateData,
//     deleteData
// }








const { pool } = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");
const appError = require("../errorHandeling/appError.js");

// for get all data from purchase details
// const getALLData = catchAsync(async(req, res, next) => {
//     const [rows] = await pool.query(
//         `SELECT pd.purchase_detail_id,p.purchase_id, i.item_id,pd.quantity,pd.unit_price
//         FROM purchase_details pd
//         LEFT JOIN purchases p ON pd.purchase_id = p.purchase_id
//         LEFT JOIN items i ON pd.item_id = i.item_id
//         `);
    
//     if (rows.length === 0) {
//         return next(new appError('purchase_details not found', 404));
//     }
//     res.status(200).json(rows);
// });


const getALLData = catchAsync(async(req, res, next) => {
    const [rows] = await pool.query(
        `SELECT 
            pd.purchase_detail_id,
            p.purchase_id,
            p.invoice_no,
            i.item_id,
            i.item_name,
            pd.quantity,
            pd.unit_price
        FROM purchase_details pd
        LEFT JOIN purchases p ON pd.purchase_id = p.purchase_id
        LEFT JOIN items i ON pd.item_id = i.item_id`
    );
    
    if (rows.length === 0) {
        return next(new appError('purchase_details not found', 404));
    }
    res.status(200).json(rows);
});

// for get single data from purchase details
// const getDataById = catchAsync(async(req, res, next) => {
//     const { id } = req.params;
//     const [rows] = await pool.query(
//         `SELECT pd.purchase_detail_id,p.purchase_id, i.item_id,pd.quantity,pd.unit_price
//         FROM purchase_details pd
//         LEFT JOIN purchases p ON pd.purchase_id = p.purchase_id
//         LEFT JOIN items i ON pd.item_id = i.item_id WHERE purchase_detail_id = ?
//         `, [id]);
    
//     if (rows.length === 0) {
//         return next(new appError("purchase_details not found with this id", 404));
//     }
//     res.status(200).json(rows);
// });


const getDataById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query(
        `SELECT 
            pd.purchase_detail_id,
            p.purchase_id,
            p.invoice_no,
            i.item_id,
            i.item_name,
            pd.quantity,
            pd.unit_price
        FROM purchase_details pd
        LEFT JOIN purchases p ON pd.purchase_id = p.purchase_id
        LEFT JOIN items i ON pd.item_id = i.item_id 
        WHERE purchase_detail_id = ?`,
        [id]
    );
    
    if (rows.length === 0) {
        return next(new appError("purchase_details not found with this id", 404));
    }
    res.status(200).json(rows);
});

// for create purchase details to table
const createPurchaseDetails = catchAsync(async(req, res, next) => {
    const { purchase_id, item_id, quantity, unit_price } = req.body;
    const [result] = await pool.query(
        `INSERT INTO purchase_details(purchase_id,item_id,quantity,unit_price)VALUES(?,?,?,?)`,
        [purchase_id, item_id, quantity, unit_price]
    );
    res.status(201).json({
        status: "successful",
        message: "purchase_deltails created",
        data: {
            id: result.insertId,
            purchase_id: purchase_id,
            item_id: item_id,
            quantity: quantity,
            unit_price: unit_price
        }
    });
});

// for update purchase details 
const updateData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { purchase_id, item_id, quantity, unit_price } = req.body;
    const [result] = await pool.query(
        `UPDATE purchase_details SET purchase_id = ?, item_id = ?, quantity = ?, unit_price = ? WHERE purchase_detail_id = ?`,
        [purchase_id, item_id, quantity, unit_price, id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("purchase_details not found", 404));
    }
    res.status(200).json({ status: "successful", message: "purchase_details updated" });
});

// for delete purchase details from table 
const deleteData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query(
        `DELETE FROM purchase_details WHERE purchase_detail_id = ?`, [id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("purchase_details not found", 404));
    }
    res.status(200).json({ status: "successful", message: "purchase_details deleted" });
});

module.exports = {
    getALLData,
    getDataById,
    createPurchaseDetails,
    updateData,
    deleteData
}
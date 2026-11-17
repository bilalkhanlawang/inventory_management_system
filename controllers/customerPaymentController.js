// const {pool} = require("../config/db.js");
// // for get all data 
// const getALLData = async (req, res) => {
//     try {
//         const [rows] = await pool.query(
//             `SELECT cp.customer_payment_id, c.customer_id, cu.currency_id, cp.amount, cp.payment_date, s.sale_id
//              FROM customer_payment cp
//              LEFT JOIN customers c ON cp.customer_id = c.customer_id
//              LEFT JOIN currencies cu ON cp.currency_id = cu.currency_id
//              LEFT JOIN sales s ON cp.sale_id = s.sale_id`);
//         res.status(200).json(rows);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "server error" });
//     }
// };

// // for get one data
// const getDataById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const [rows] = await pool.query(
//             `SELECT cp.customer_payment_id, c.customer_id, cu.currency_id, cp.amount, cp.payment_date, s.sale_id
//              FROM customer_payment cp
//              LEFT JOIN customers c ON cp.customer_id = c.customer_id
//              LEFT JOIN currencies cu ON cp.currency_id = cu.currency_id
//              LEFT JOIN sales s ON cp.sale_id = s.sale_id
//              WHERE cp.customer_payment_id = ?`,
//             [id]
//         );
//         if (rows.affectedRows === 0) {
//             return res.status(404).json({ message: "Payment not found" });
//         }
//         res.status(200).json(rows);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "server error" });
//     }
// };

// // for create data 
// const createData = async (req, res) => {
//     try {
//         const { customer_id, currency_id, amount, payment_date, sale_id } = req.body;
//         const [result] = await pool.query(
//             `INSERT INTO customer_payment (customer_id, currency_id, amount, payment_date, sale_id)
//              VALUES (?, ?, ?, ?, ?)`,
//             [customer_id, currency_id, amount, payment_date, sale_id]
//         );
//         res.status(201).json({ 
//             message: "Payment created successfully",
//             customer_payment_id: result.insertId
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "server error" });
//     }
// };

// const updateData = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { customer_id, currency_id, amount, payment_date, sale_id } = req.body;
        
//         const [result] = await pool.query(
//             `UPDATE customer_payment 
//              SET customer_id = ?, currency_id = ?, amount = ?, payment_date = ?, sale_id = ?
//              WHERE customer_payment_id = ?`,
//             [customer_id, currency_id, amount, payment_date, sale_id, id]
//         );
//         res.status(200).json({ message: "Payment updated successfully" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "server error" });
//     }
// };
// // for delete

// const deleteData = async (req, res) => {
//     try {
//         const { id } = req.params;
        
//         const [check] = await pool.query(
//             `DELETE FROM customer_payment WHERE customer_payment_id = ?`,
//             [id]
//         );
//         res.status(200).json({ message: "Payment deleted successfully" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "server error" });
//     }
// };




// module.exports = { 
//     getALLData,
//     getDataById,
//     createData,
//     updateData,
//     deleteData
// }






const { pool } = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");
const appError = require("../errorHandeling/appError.js");

// for get all data 

// const getALLData = catchAsync(async(req, res, next) => {
//     const [rows] = await pool.query(
//         `SELECT cp.customer_payment_id, c.customer_id, cu.currency_id, cp.amount, cp.payment_date, s.sale_id
//          FROM customer_payment cp
//          LEFT JOIN customers c ON cp.customer_id = c.customer_id
//          LEFT JOIN currencies cu ON cp.currency_id = cu.currency_id
//          LEFT JOIN sales s ON cp.sale_id = s.sale_id`
//     );
    
//     if (rows.length === 0) {
//         return next(new appError('customer_payment not found', 404));
//     }
//     res.status(200).json(rows);
// });


const getALLData = catchAsync(async(req, res, next) => {
    const [rows] = await pool.query(
        `SELECT 
            cp.customer_payment_id, 
            s.sale_id,
            s.invoice_no,
            c.customer_id, 
            c.customer_name,
            cu.currency_id, 
            cu.currency_name,
            cp.amount, 
            cp.payment_date
         FROM customer_payment cp
         LEFT JOIN customers c ON cp.customer_id = c.customer_id
         LEFT JOIN currencies cu ON cp.currency_id = cu.currency_id
         LEFT JOIN sales s ON cp.sale_id = s.sale_id`
    );
    
    if (rows.length === 0) {
        return next(new appError('customer_payment not found', 404));
    }
    res.status(200).json(rows);
});

// for get one data

// const getDataById = catchAsync(async(req, res, next) => {
//     const { id } = req.params;
//     const [rows] = await pool.query(
//         `SELECT cp.customer_payment_id, c.customer_id, cu.currency_id, cp.amount, cp.payment_date, s.sale_id
//          FROM customer_payment cp
//          LEFT JOIN customers c ON cp.customer_id = c.customer_id
//          LEFT JOIN currencies cu ON cp.currency_id = cu.currency_id
//          LEFT JOIN sales s ON cp.sale_id = s.sale_id
//          WHERE cp.customer_payment_id = ?`,
//         [id]
//     );
    
//     if (rows.length === 0) {
//         return next(new appError("Payment not found with this id", 404));
//     }
//     res.status(200).json(rows);
// });



const getDataById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query(
        `SELECT 
            cp.customer_payment_id, 
            s.sale_id,
            s.invoice_no,
            c.customer_id, 
            c.customer_name,
            cu.currency_id, 
            cu.currency_name,
            cp.amount, 
            cp.payment_date
         FROM customer_payment cp
         LEFT JOIN customers c ON cp.customer_id = c.customer_id
         LEFT JOIN currencies cu ON cp.currency_id = cu.currency_id
         LEFT JOIN sales s ON cp.sale_id = s.sale_id
         WHERE cp.customer_payment_id = ?`,
        [id]
    );
    
    if (rows.length === 0) {
        return next(new appError("Payment not found with this id", 404));
    }
    res.status(200).json(rows);
});



// for create data 
const createData = catchAsync(async(req, res, next) => {
    const { customer_id, currency_id, amount, payment_date, sale_id } = req.body;
    const [result] = await pool.query(
        `INSERT INTO customer_payment (customer_id, currency_id, amount, payment_date, sale_id)
         VALUES (?, ?, ?, ?, ?)`,
        [customer_id, currency_id, amount, payment_date, sale_id]
    );
    res.status(201).json({ 
        message: "Payment created successfully",
        customer_payment_id: result.insertId
    });
});

const updateData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { customer_id, currency_id, amount, payment_date, sale_id } = req.body;
    
    const [result] = await pool.query(
        `UPDATE customer_payment 
         SET customer_id = ?, currency_id = ?, amount = ?, payment_date = ?, sale_id = ?
         WHERE customer_payment_id = ?`,
        [customer_id, currency_id, amount, payment_date, sale_id, id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("Payment not found", 404));
    }
    res.status(200).json({ message: "Payment updated successfully" });
});

// for delete
const deleteData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query(
        `DELETE FROM customer_payment WHERE customer_payment_id = ?`,
        [id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("Payment not found", 404));
    }
    res.status(200).json({ message: "Payment deleted successfully" });
});

module.exports = { 
    getALLData,
    getDataById,
    createData,
    updateData,
    deleteData
}
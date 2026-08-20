// const {pool} = require("../config/db.js");

// // controllers/exchangeRateController.js

// const getALLData = async (req, res) => {
//     try {
//         const [rows] = await pool.query(
//             // SELECT er.rate_id, c.from_currency_id, c.to_currency_id, er.exchange_rate, er.effective_date
//             //  FROM exchange_rate er
//             //  LEFT JOIN currencies c ON  er.currency_id = c.currency_id
//             ` 
//             SELECT * FROM exchange_rate;
//             `
//         );
//         res.status(200).json(rows);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "server error" });
//     }
// };

// const getDataById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const [rows] = await pool.query(
//         //     SELECT er.rate_id, c.from_currency_id, c.to_currency_id, er.exchange_rate, er.effective_date
//         //      FROM exchange_rate er
//         //      LEFT JOIN currencies c ON  er.currency_id = c.currency_id
//             `
//             SELECT * FROM exchange_rate
//             WHERE rate_id = ?`,
//             [id]
//         );
        
//         res.status(200).json(rows);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "server error" });
//     }
// };

// const createData = async (req, res) => {
//     try {
//         const { from_currency_id, to_currency_id, exchange_rate, effective_date } = req.body;
//         const [result] = await pool.query(
//             `INSERT INTO exchange_rate (from_currency_id, to_currency_id, exchange_rate, effective_date)
//              VALUES (?, ?, ?, ?)`,
//             [from_currency_id, to_currency_id, exchange_rate, effective_date]
//         );
//         res.status(201).json({ 
//             message: "Exchange rate created successfully",
//             rate_id: result.insertId
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "server error" });
//     }
// };

// const updateData = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { from_currency_id, to_currency_id, exchange_rate, effective_date } = req.body;
        

//       const[result] =  await pool.query(
//             `UPDATE exchange_rate 
//              SET from_currency_id = ?, to_currency_id = ?, exchange_rate = ?, effective_date = ?
//              WHERE rate_id = ?`,
//             [from_currency_id, to_currency_id, exchange_rate, effective_date, id]
//         );
        
//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: "Exchange rate not found" });
//         }
//         res.status(200).json({ message: "Exchange rate updated successfully" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "server error" });
//     }
// };

// const deleteData = async (req, res) => {
//     try {
//         const { id } = req.params;
        
//       const [result] = await pool.query(
//             `DELETE FROM exchange_rate WHERE rate_id = ?`,
//             [id]
//         );
          
//         if (check.length === 0) {
//             return res.status(404).json({ message: "Exchange rate not found" });
//         }
//         res.status(200).json({ message: "Exchange rate deleted successfully" });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "server error" });
//     }
// };

// module.exports = { getALLData, getDataById, createData, updateData, deleteData };







const { pool } = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");
const appError = require("../errorHandeling/appError.js");

// controllers/exchangeRateController.js

const getALLData = catchAsync(async(req, res, next) => {
    const [rows] = await pool.query(
        // SELECT er.rate_id, c.from_currency_id, c.to_currency_id, er.exchange_rate, er.effective_date
        //  FROM exchange_rate er
        //  LEFT JOIN currencies c ON  er.currency_id = c.currency_id
        ` 
        SELECT * FROM exchange_rate;
        `
    );
    
    if (rows.length === 0) {
        return next(new appError('exchange_rate not found', 404));
    }
    res.status(200).json(rows);
});

const getDataById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query(
    //     SELECT er.rate_id, c.from_currency_id, c.to_currency_id, er.exchange_rate, er.effective_date
    //      FROM exchange_rate er
    //      LEFT JOIN currencies c ON  er.currency_id = c.currency_id
        `
        SELECT * FROM exchange_rate
        WHERE rate_id = ?`,
        [id]
    );
    
    if (rows.length === 0) {
        return next(new appError("Exchange rate not found with this id", 404));
    }
    res.status(200).json(rows);
});

const createData = catchAsync(async(req, res, next) => {
    const { from_currency_id, to_currency_id, exchange_rate, effective_date } = req.body;
    const [result] = await pool.query(
        `INSERT INTO exchange_rate (from_currency_id, to_currency_id, exchange_rate, effective_date)
         VALUES (?, ?, ?, ?)`,
        [from_currency_id, to_currency_id, exchange_rate, effective_date]
    );
    res.status(201).json({ 
        message: "Exchange rate created successfully",
        rate_id: result.insertId
    });
});

const updateData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { from_currency_id, to_currency_id, exchange_rate, effective_date } = req.body;
    
    const [result] = await pool.query(
        `UPDATE exchange_rate 
         SET from_currency_id = ?, to_currency_id = ?, exchange_rate = ?, effective_date = ?
         WHERE rate_id = ?`,
        [from_currency_id, to_currency_id, exchange_rate, effective_date, id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("Exchange rate not found", 404));
    }
    res.status(200).json({ message: "Exchange rate updated successfully" });
});

const deleteData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query(
        `DELETE FROM exchange_rate WHERE rate_id = ?`,
        [id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("Exchange rate not found", 404));
    }
    res.status(200).json({ message: "Exchange rate deleted successfully" });
});

module.exports = { getALLData, getDataById, createData, updateData, deleteData };
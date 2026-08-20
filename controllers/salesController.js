// const {pool} = require("../config/db.js");
// // for get all data from sales table 

// const getAllSales = async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//             SELECT 
//                 s.sale_id,
//                 c.customer_id,
//                 cu.currency_id,
//                 s.sale_date,
//                 s.invoice_no
//             FROM sales s
//             LEFT JOIN customers c ON s.customer_id = c.customer_id
//             LEFT JOIN currencies cu ON s.currency_id = cu.currency_id
//         `);
        
//         res.status(200).json(rows);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message:"server error"});
//     }
// };
// // for get one data 
// const getSaleById = async (req, res) => {
//     try {
//         const { id } = req.params;
        
//         const [rows] = await pool.query(`
//             SELECT 
//                 s.sale_id,
//                 c.customer_id,
//                 cu.currency_id,
//                 s.sale_date,
//                 s.invoice_no
//             FROM sales s
//             LEFT JOIN customers c ON s.customer_id = c.customer_id
//             LEFT JOIN currencies cu ON s.currency_id = cu.currency_id
//             WHERE s.sale_id = ?
//         `, [id]);
        
//         if (rows.affectedRows === 0) {
//             return res.status(404).json({message: "sales not found"});
//         }
        
//         res.status(200).json(rows);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "server error"});
//     }
// };
// // for create data 
// const createSale = async (req, res) => {
//     try {
//         const {customer_id, currency_id, sale_date, invoice_no } = req.body;
        
        
        
//         // درج داده جدید
//         const [result] = await pool.query(`
//             INSERT INTO sales (customer_id, currency_id, sale_date, invoice_no)
//             VALUES (?, ?, ?, ?)
//         `, [customer_id, currency_id, sale_date, invoice_no]);
        
        
//         res.status(201).json({status: "successful",message: "sales created", data: {
//             id:result.insertId,
//             customer_id :customer_id,
//              currency_id:currency_id,
//               sale_date:sale_date,
//                invoice_no:invoice_no

//         }});
        
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// };

// // for update 

// const updateSale = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { customer_id, currency_id, sale_date, invoice_no } = req.body;
        
//         // 6. اجرای کوئری به‌روزرسانی
        
        
        
//         const [result] = await pool.query
//         (`UPDATE sales SET customer_id = ?, currency_id = ?, sale_date = ?, invoice_no = ? WHERE sale_id = ?`
//              ,[customer_id, currency_id, sale_date, invoice_no,id])
//               if (result.affectedRows === 0) {
//                 return res.status(404).json({message: "sales not found"});
//             }
        
//         res.status(200).json({message:"sales updated" });
        
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({message: "server error"});
//     }
// };

// // for delete


// // ============ DELETE SALE ============
// const deleteSale = async (req, res) => {
//     try {
//         const { id } = req.params;

//     const [result] = await pool.query('DELETE FROM sales WHERE sale_id = ?', [id]);
//         if (result.affectedRows === 0) {
//         return res.status(404).json({message: "sales not found"});
//     }
//         res.status(200).json({message: "sales deleted" });
        
   

        
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({message:"server error"});
//     }
// };

// module.exports = {
//     getAllSales,
//     getSaleById,
//     createSale,
//     updateSale,
//     deleteSale
// }








const { pool } = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");
const appError = require("../errorHandeling/appError.js");

// for get all data from sales table 
const getAllSales = catchAsync(async(req, res, next) => {
    const [rows] = await pool.query(`
        SELECT 
            s.sale_id,
            c.customer_id,
            cu.currency_id,
            s.sale_date,
            s.invoice_no
        FROM sales s
        LEFT JOIN customers c ON s.customer_id = c.customer_id
        LEFT JOIN currencies cu ON s.currency_id = cu.currency_id
    `);
    
    if (rows.length === 0) {
        return next(new appError('sales not found', 404));
    }
    res.status(200).json(rows);
});

// for get one data 
const getSaleById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    
    const [rows] = await pool.query(`
        SELECT 
            s.sale_id,
            c.customer_id,
            cu.currency_id,
            s.sale_date,
            s.invoice_no
        FROM sales s
        LEFT JOIN customers c ON s.customer_id = c.customer_id
        LEFT JOIN currencies cu ON s.currency_id = cu.currency_id
        WHERE s.sale_id = ?
    `, [id]);
    
    if (rows.length === 0) {
        return next(new appError("sales not found with this id", 404));
    }
    res.status(200).json(rows);
});

// for create data 
const createSale = catchAsync(async(req, res, next) => {
    const { customer_id, currency_id, sale_date, invoice_no } = req.body;
    
    const [result] = await pool.query(`
        INSERT INTO sales (customer_id, currency_id, sale_date, invoice_no)
        VALUES (?, ?, ?, ?)
    `, [customer_id, currency_id, sale_date, invoice_no]);
    
    res.status(201).json({
        status: "successful",
        message: "sales created",
        data: {
            id: result.insertId,
            customer_id: customer_id,
            currency_id: currency_id,
            sale_date: sale_date,
            invoice_no: invoice_no
        }
    });
});

// for update 
const updateSale = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { customer_id, currency_id, sale_date, invoice_no } = req.body;
    
    const [result] = await pool.query(
        `UPDATE sales SET customer_id = ?, currency_id = ?, sale_date = ?, invoice_no = ? WHERE sale_id = ?`,
        [customer_id, currency_id, sale_date, invoice_no, id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("sales not found", 404));
    }
    res.status(200).json({ message: "sales updated" });
});

// for delete
const deleteSale = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM sales WHERE sale_id = ?', [id]);
    
    if (!result.affectedRows) {
        return next(new appError("sales not found", 404));
    }
    res.status(200).json({ message: "sales deleted" });
});

module.exports = {
    getAllSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale
}
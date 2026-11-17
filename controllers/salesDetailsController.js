// const {pool} = require ("../config/db.js");
// // for get all data 
// const getAllData = async (req,res) => {
//     try {
//     const [rows] = await pool.query
//     (`SELECT sd.sale_detail_id,s.sale_id,i.item_id,sd.quantity,sd.unit_price FROM sales_details sd
//         LEFT JOIN sales s ON sd.sale_id = s.sale_id
//         LEFT JOIN items i ON sd.item_id = i.item_id
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
//            (`SELECT sd.sale_detail_id,s.sale_id,i.item_id,sd.quantity,sd.unit_price FROM sales_details sd
//         LEFT JOIN sales s ON sd.sale_id = s.sale_id
//         LEFT JOIN items i ON sd.item_id = i.item_id WHERE sale_detail_id = ?
//         ` , [id]);
//          if (rows.affectedRows === 0) {
//                 return res.status(404).json({message:"purchase_details not found"});
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
//         const {sale_detail_id,sale_id,item_id,quantity,unit_price} = req.body;
//         const [result] = await pool.query
//         (`INSERT INTO sales_details(sale_id,item_id,quantity,unit_price)VALUES(?,?,?,?)`,
//             [sale_id,item_id,quantity,unit_price]);
//             res.status(201).json({status: "successful" , message: "sales created" , data: {
//                 id:result.insertId,
            
//                 sale_id:sale_id,
//                 item_id:item_id,
//                 quantity:quantity,
//                 unit_price:unit_price
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
//         const{sale_detail_id,sale_id,item_id,quantity,unit_price} = req.body;
//         const [result] = await pool.query 
//         (`UPDATE sales_details SET sale_id = ?, item_id = ?, quantity = ?, unit_price = ? WHERE sale_detail_id = ?`,
//             [sale_id,item_id,quantity,unit_price,id]);
//             if (result.affectedRows === 0) {
//                 return res.status(404).json({message: "sales_details not found"});
//             }
//             res.status(200).json({status: "successful" , message: "sales_details updated"});
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
//         (`DELETE FROM sales_details WHERE sale_detail_id = ?`, [id]);
//         if (result.affectedRows === 0) {
//             return res.status(404).json({message: "server error"});
//         }
//         res.status(200).json({status: "successful" , message: "sales_details deleted"});
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
// const getAllData = catchAsync(async(req, res, next) => {
//     const [rows] = await pool.query(
//         `SELECT sd.sale_detail_id,s.sale_id,i.item_id,sd.quantity,sd.unit_price FROM sales_details sd
//         LEFT JOIN sales s ON sd.sale_id = s.sale_id
//         LEFT JOIN items i ON sd.item_id = i.item_id
//         `
//     );
    
//     if (rows.length === 0) {
//         return next(new appError('sales_details not found', 404));
//     }
//     res.status(200).json(rows);
// });


const getAllData = catchAsync(async (req, res, next) => {
  const [rows] = await pool.query(
    `SELECT 
        sd.sale_detail_id,
        sd.sale_id,
        s.invoice_no,
        s.customer_id,
        c.customer_name,
        sd.item_id,
        i.item_name,
        sd.quantity,
        sd.unit_price
     FROM sales_details sd
     LEFT JOIN sales s ON sd.sale_id = s.sale_id
     LEFT JOIN items i ON sd.item_id = i.item_id
     LEFT JOIN customers c ON s.customer_id = c.customer_id
     ORDER BY sd.sale_detail_id DESC`
  );

  if (rows.length === 0) {
    return next(new appError('sales_details not found', 404));
  }
  res.status(200).json(rows);
});

// for get one id of sales_details table
const getDataById = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query(
        `SELECT sd.sale_detail_id,s.sale_id,i.item_id,sd.quantity,sd.unit_price FROM sales_details sd
        LEFT JOIN sales s ON sd.sale_id = s.sale_id
        LEFT JOIN items i ON sd.item_id = i.item_id WHERE sale_detail_id = ?
        `, [id]);
    
    if (rows.length === 0) {
        return next(new appError("sales_details not found with this id", 404));
    }
    res.status(200).json(rows);
});

// for create data to sales details table
const createData = catchAsync(async(req, res, next) => {
    const { sale_detail_id, sale_id, item_id, quantity, unit_price } = req.body;
    const [result] = await pool.query(
        `INSERT INTO sales_details(sale_id,item_id,quantity,unit_price)VALUES(?,?,?,?)`,
        [sale_id, item_id, quantity, unit_price]
    );
    res.status(201).json({
        status: "successful",
        message: "sales created",
        data: {
            id: result.insertId,
            sale_id: sale_id,
            item_id: item_id,
            quantity: quantity,
            unit_price: unit_price
        }
    });
});

// for update data
const updateData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { sale_detail_id, sale_id, item_id, quantity, unit_price } = req.body;
    const [result] = await pool.query(
        `UPDATE sales_details SET sale_id = ?, item_id = ?, quantity = ?, unit_price = ? WHERE sale_detail_id = ?`,
        [sale_id, item_id, quantity, unit_price, id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("sales_details not found", 404));
    }
    res.status(200).json({ status: "successful", message: "sales_details updated" });
});

// for delete purchase details from table 
const deleteData = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query(
        `DELETE FROM sales_details WHERE sale_detail_id = ?`, [id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("sales_details not found", 404));
    }
    res.status(200).json({ status: "successful", message: "sales_details deleted" });
});

module.exports = {
    getAllData,
    getDataById,
    createData,
    updateData,
    deleteData
}








// const { pool } = require("../config/db.js");
// const catchAsync = require("../errorHandeling/catchAsync.js");
// const appError = require("../errorHandeling/appError.js");

// // ============================================================
// // GET ALL
// // ============================================================
// const getAllData = catchAsync(async (req, res, next) => {
//   const [rows] = await pool.query(
//     `SELECT 
//         sd.sale_detail_id,
//         sd.sale_id,
//         s.invoice_no,
//         sd.item_id,
//         i.item_name,
//         sd.quantity,
//         sd.unit_price
//      FROM sales_details sd
//      LEFT JOIN sales s ON sd.sale_id = s.sale_id
//      LEFT JOIN items i ON sd.item_id = i.item_id
//      ORDER BY sd.sale_detail_id DESC`
//   );

//   // ✅ Empty table → return [] (NOT 404)
//   res.status(200).json(rows);
// });

// // ============================================================
// // GET BY ID
// // ============================================================
// const getDataById = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const [rows] = await pool.query(
//     `SELECT 
//         sd.sale_detail_id,
//         sd.sale_id,
//         s.invoice_no,
//         sd.item_id,
//         i.item_name,
//         sd.quantity,
//         sd.unit_price
//      FROM sales_details sd
//      LEFT JOIN sales s ON sd.sale_id = s.sale_id
//      LEFT JOIN items i ON sd.item_id = i.item_id
//      WHERE sd.sale_detail_id = ?`,
//     [id]
//   );

//   if (rows.length === 0) {
//     return next(new appError("sales_details not found with this id", 404));
//   }
//   res.status(200).json(rows[0]);
// });

// // ============================================================
// // CREATE
// // ============================================================
// const createData = catchAsync(async (req, res, next) => {
//   const { sale_id, item_id, quantity, unit_price } = req.body;

//   // ✅ Basic validation
//   if (!sale_id || !item_id || !quantity || !unit_price) {
//     return next(new appError("All fields are required", 400));
//   }

//   const [result] = await pool.query(
//     `INSERT INTO sales_details (sale_id, item_id, quantity, unit_price)
//      VALUES (?, ?, ?, ?)`,
//     [sale_id, item_id, quantity, unit_price]
//   );

//   res.status(201).json({
//     status: "successful",
//     message: "sales detail created",
//     data: {
//       sale_detail_id: result.insertId,
//       sale_id,
//       item_id,
//       quantity,
//       unit_price,
//     },
//   });
// });

// // ============================================================
// // UPDATE
// // ============================================================
// const updateData = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const { sale_id, item_id, quantity, unit_price } = req.body;

//   const [result] = await pool.query(
//     `UPDATE sales_details 
//      SET sale_id = ?, item_id = ?, quantity = ?, unit_price = ?
//      WHERE sale_detail_id = ?`,
//     [sale_id, item_id, quantity, unit_price, id]
//   );

//   if (!result.affectedRows) {
//     return next(new appError("sales_details not found", 404));
//   }

//   res.status(200).json({
//     status: "successful",
//     message: "sales_details updated",
//   });
// });

// // ============================================================
// // DELETE
// // ============================================================
// const deleteData = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const [result] = await pool.query(
//     `DELETE FROM sales_details WHERE sale_detail_id = ?`,
//     [id]
//   );

//   if (!result.affectedRows) {
//     return next(new appError("sales_details not found", 404));
//   }

//   res.status(200).json({
//     status: "successful",
//     message: "sales_details deleted",
//   });
// });

// module.exports = {
//   getAllData,
//   getDataById,
//   createData,
//   updateData,
//   deleteData,
// };
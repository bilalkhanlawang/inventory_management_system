// const {pool} = require("../config/db.js");

// // for get all data
// const getAllData = async (req,res) => {
//     try {
//         const [rows] = await pool.query(`
//             SELECT i.item_id,i.item_name,c.category_id,u.unit_id
//             FROM items i
//             LEFT JOIN categories c ON i.category_id = c.category_id
//             LEFT JOIN units u ON i.unit_id = u.unit_id`);
//             res.status(200).json(rows);
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }

// // fatch one data 
// const getItemByIy = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const [rows] = await pool.query(`SELECT i.item_id,i.item_name,c.category_id,u.unit_id
//             FROM items i 
//             LEFT JOIN categories c ON i.category_id = c.category_id
//             LEFT JOIN units u ON i.unit_id = u.unit_id WHERE i.item_id = ?` ,[id]);
//             if (rows.affectedRows === 0) {
//                 return res.status(404).json({status: "error", message: "item not found"});
//             }
//             res.status(200).json(rows);
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }

// }

// // for create data items
// const createData = async (req,res) => {
//     try {
//         const {item_name,category_id,unit_id} = req.body;

//         if (!item_name) {
//             return res.status(400).json({
//                 status: "error",
//                 message: "item name is required"
//             });
//         }
//         const [result] = await pool.query
//         (`INSERT INTO items(item_name,category_id,unit_id)VALUES(?,?,?)`,[item_name,category_id || null,unit_id || null]);
//         res.status(201).json({
//             status: "cuccssful",
//             message: "item created successful",
//             data: {
//                 id: result.insertId,
//                 item_name :item_name,
//                 category_id :category_id,
//                 unit_id : unit_id
//             }
//         });
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message: "server error"});
//     }
// }

// // for updata items
// const updateItem = async (req,res) => {
//     try {
//         const {id} = req.params;
//         const {item_name , category_id ,unit_id} = req.body;
//         const [result] = await pool.query
//         (`UPDATE items SET item_name = ?, category_id = ?, unit_id = ? WHERE item_id = ?`,
//              [item_name,category_id,unit_id ,id]);
//              if (result.affectedRows === 0) {
//                 return res.status(404).json({message: "item not found"});
//              }
//              res.status(200).json({status: "successful" , message: "item is updated" });
//     }catch(error) {
//         console.log(error);
//         res.status(500).json({message : "server error"});
//     }
// }
// // for delete item
// const deleteItem = async (req,res)  => {
//     try {
//     const {id} = req.params;
//     const [result] = await pool.query 
//     (`DELETE FROM items WHERE item_id = ?`, [id]);
//     if (result.affectedRows === 0) {
//         return res.status(404).json({message: "item not found"});
//     }
//     res.status(200).json({status: "successful" , message: "item deleted"});
//    }catch(error) {
//     console.log(error);
//     res.status(500).json({message: "server error"});
//    } 
// }


// module.exports = {
//     getAllData,
//     getItemByIy,
//     createData,
//     updateItem,
//     deleteItem
// }







const { pool } = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");
const appError = require("../errorHandeling/appError.js");

// for get all data
const getAllData = catchAsync(async(req, res, next) => {
    const [rows] = await pool.query(`
        SELECT i.item_id,i.item_name,c.category_id,u.unit_id
        FROM items i
        LEFT JOIN categories c ON i.category_id = c.category_id
        LEFT JOIN units u ON i.unit_id = u.unit_id`);
    
    if (rows.length === 0) {
        return next(new appError('items not found', 404));
    }
    res.status(200).json(rows);
});

// fatch one data 
const getItemByIy = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [rows] = await pool.query(`SELECT i.item_id,i.item_name,c.category_id,u.unit_id
        FROM items i 
        LEFT JOIN categories c ON i.category_id = c.category_id
        LEFT JOIN units u ON i.unit_id = u.unit_id WHERE i.item_id = ?`, [id]);
    
    if (rows.length === 0) {
        return next(new appError("item not found with this id", 404));
    }
    res.status(200).json(rows);
});

// for create data items
const createData = catchAsync(async(req, res, next) => {
    const { item_name, category_id, unit_id } = req.body;

    if (!item_name) {
        return next(new appError("item name is required", 400));
    }
    const [result] = await pool.query(
        `INSERT INTO items(item_name,category_id,unit_id)VALUES(?,?,?)`,
        [item_name, category_id || null, unit_id || null]
    );
    res.status(201).json({
        status: "cuccssful",
        message: "item created successful",
        data: {
            id: result.insertId,
            item_name: item_name,
            category_id: category_id,
            unit_id: unit_id
        }
    });
});

// for updata items
const updateItem = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const { item_name, category_id, unit_id } = req.body;
    const [result] = await pool.query(
        `UPDATE items SET item_name = ?, category_id = ?, unit_id = ? WHERE item_id = ?`,
        [item_name, category_id, unit_id, id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("item not found", 404));
    }
    res.status(200).json({ status: "successful", message: "item is updated" });
});

// for delete item
const deleteItem = catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const [result] = await pool.query(
        `DELETE FROM items WHERE item_id = ?`, [id]
    );
    
    if (!result.affectedRows) {
        return next(new appError("item not found", 404));
    }
    res.status(200).json({ status: "successful", message: "item deleted" });
});

module.exports = {
    getAllData,
    getItemByIy,
    createData,
    updateItem,
    deleteItem
}
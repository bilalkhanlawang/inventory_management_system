const { pool } = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");

// گزارش فروش‌ها
const getSalesReport = catchAsync(async (req, res, next) => {
  const [sales] = await pool.query(`
    SELECT s.sale_id, s.sale_date, c.customer_name AS name, 
           cur.currency_name AS currency, 
           (SELECT COALESCE(SUM(quantity * unit_price), 0) FROM sales_details WHERE sale_id = s.sale_id) AS total
    FROM sales s
    LEFT JOIN customers c ON s.customer_id = c.customer_id
    LEFT JOIN currencies cur ON s.currency_id = cur.currency_id
    ORDER BY s.sale_date DESC
  `);
  res.status(200).json(sales);
});

// گزارش خریدها
const getPurchasesReport = catchAsync(async (req, res, next) => {
  const [purchases] = await pool.query(`
    SELECT p.purchase_id, p.purchase_date, v.vendor_name AS name,
           cur.currency_name AS currency,
           (SELECT COALESCE(SUM(quantity * unit_price), 0) FROM purchase_details WHERE purchase_id = p.purchase_id) AS total
    FROM purchases p
    LEFT JOIN vendors v ON p.vendor_id = v.vendor_id
    LEFT JOIN currencies cur ON p.currency_id = cur.currency_id
    ORDER BY p.purchase_date DESC
  `);
  res.status(200).json(purchases);
});

module.exports = { getSalesReport, getPurchasesReport };
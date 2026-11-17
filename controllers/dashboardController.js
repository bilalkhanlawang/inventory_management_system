// const { pool } = require("../config/db.js");
// const catchAsync = require("../errorHandeling/catchAsync.js");

// const getDashboardStats = catchAsync(async (req, res, next) => {
//   // آمار کلی
//   const [items] = await pool.query(`SELECT COUNT(*) AS total FROM items`);
//   const [sales] = await pool.query(`SELECT COUNT(*) AS total, COALESCE(SUM(total_amount), 0) AS amount FROM sales`);
//   const [purchases] = await pool.query(`SELECT COUNT(*) AS total, COALESCE(SUM(total_amount), 0) AS amount FROM purchases`);
//   const [customers] = await pool.query(`SELECT COUNT(*) AS total FROM customers`);
//   const [vendors] = await pool.query(`SELECT COUNT(*) AS total FROM vendors`);

//   // هشدار موجودی (با ۵ آیتم اول)
//   const [lowStock] = await pool.query(
//     `SELECT i.item_id, i.item_name, i.quantity, c.category_name 
//      FROM items i 
//      LEFT JOIN categories c ON i.category_id = c.category_id 
//      WHERE i.quantity <= 10 ORDER BY i.quantity ASC LIMIT 5`
//   );

//   // آخرین ۵ فروش (برای جدول)
//   const [recentSales] = await pool.query(
//     `SELECT s.sale_id, s.total_amount as total, s.sale_date, c.name as customer_name 
//      FROM sales s 
//      LEFT JOIN customers c ON s.customer_id = c.id 
//      ORDER BY s.sale_date DESC LIMIT 5`
//   );

//   // داده‌های نمودار (ماهانه) - برای سادگی اینجا ساختگی گذاشتم، بعدا با کوئری واقعی جایگزین می‌کنیم
//   const chartData = [
//     { name: 'Jan', sales: 45000, purchases: 30000 },
//     { name: 'Feb', sales: 52000, purchases: 55000 },
//     { name: 'Mar', sales: 48000, purchases: 35000 },
//     { name: 'Apr', sales: 61000, purchases: 45000 },
//     { name: 'May', sales: 58000, purchases: 48000 },
//     { name: 'Jun', sales: 70000, purchases: 40000 },
//     { name: 'Jul', sales: 75000, purchases: 50000 },
//     { name: 'Aug', sales: 82000, purchases: 52000 },
//   ];

//   // داده‌های دایره‌ای (بر اساس دسته‌بندی)
//   const pieData = [
//     { name: 'Electronics', value: 35 },
//     { name: 'Clothing', value: 22 },
//     { name: 'Food', value: 18 },
//     { name: 'Hardware', value: 12 },
//     { name: 'Others', value: 13 },
//   ];

//   res.status(200).json({
//     status: "successful",
//     data: {
//       totalItems: items[0].total,
//       totalSales: sales[0].total,
//       totalSalesAmount: sales[0].amount,
//       totalPurchases: purchases[0].total,
//       totalPurchasesAmount: purchases[0].amount,
//       totalCustomers: customers[0].total,
//       totalVendors: vendors[0].total,
//       lowStock,
//       recentSales,
//       chartData,
//       pieData
//     },
//   });
// });

// module.exports = { getDashboardStats };

const { pool } = require("../config/db.js");
const catchAsync = require("../errorHandeling/catchAsync.js");

const getDashboardStats = catchAsync(async (req, res, next) => {
  try {
    // ۱. تعداد کل آیتم‌ها
    const [items] = await pool.query(`SELECT COUNT(*) AS total FROM items`);

    // ۲. تعداد کل مشتریان و فروشندگان
    const [customers] = await pool.query(`SELECT COUNT(*) AS total FROM customers`);
    const [vendors] = await pool.query(`SELECT COUNT(*) AS total FROM vendors`);

    // ۳. محاسبه مجموع مبلغ فروش (از جدول sales_details)
    // (فرض کردیم جدول sales_details ستون‌های quantity و unit_price داره)
    const [salesTotal] = await pool.query(`
      SELECT COALESCE(SUM(quantity * unit_price), 0) AS amount, COUNT(DISTINCT sale_id) AS count
      FROM sales_details
    `);

    // ۴. محاسبه مجموع مبلغ خرید (از جدول purchase_detail)
    const [purchasesTotal] = await pool.query(`
      SELECT COALESCE(SUM(quantity * unit_price), 0) AS amount, COUNT(DISTINCT purchase_id) AS count
      FROM purchase_details
    `);

    // ۵. داده‌های نمودار (چون تاریخ‌ها واقعیه، اینجا داده‌های ماهانه رو گروه‌بندی می‌کنیم)
    // برای سادگی این بخش رو فعلاً ثابت گذاشتم، ولی اعداد کلی واقعیه
    const chartData = [
      { name: 'Jan', sales: 45000, purchases: 30000 },
      { name: 'Feb', sales: 52000, purchases: 55000 },
      { name: 'Mar', sales: 48000, purchases: 35000 },
      { name: 'Apr', sales: 61000, purchases: 45000 },
      { name: 'May', sales: 58000, purchases: 48000 },
      { name: 'Jun', sales: 70000, purchases: 40000 },
      { name: 'Jul', sales: 75000, purchases: 50000 },
      { name: 'Aug', sales: 82000, purchases: 52000 },
    ];

    const pieData = [
      { name: 'Electronics', value: 35 },
      { name: 'Clothing', value: 22 },
      { name: 'Food', value: 18 },
      { name: 'Hardware', value: 12 },
      { name: 'Others', value: 13 },
    ];

    // ۶. آخرین ۵ فروش (اتصال sales به customers)
    const [recentSales] = await pool.query(`
      SELECT s.sale_id, s.sale_date, c.customer_name AS customer_name, 
             (SELECT COALESCE(SUM(quantity * unit_price), 0) FROM sales_details WHERE sale_id = s.sale_id) AS total
      FROM sales s
      LEFT JOIN customers c ON s.customer_id = c.customer_id
      ORDER BY s.sale_date DESC LIMIT 5
    `);

    // ۷. هشدار موجودی (چون ستون quantity توی items نیست، من با یه کوئری ساده اسم آیتم‌های اول رو میارم)
    const [lowStock] = await pool.query(`
      SELECT i.item_id, i.item_name, 5 AS quantity, c.category_name
      FROM items i
      LEFT JOIN categories c ON i.category_id = c.category_id
      LIMIT 5
    `);

    res.status(200).json({
      status: "successful",
      data: {
        totalItems: items[0].total,
        totalCustomers: customers[0].total,
        totalVendors: vendors[0].total,
        
        totalSalesAmount: salesTotal[0].amount,
        totalSalesCount: salesTotal[0].count,
        
        totalPurchasesAmount: purchasesTotal[0].amount,
        totalPurchasesCount: purchasesTotal[0].count,

        chartData,
        pieData,
        recentSales,
        lowStock
      },
    });
  } catch (error) {
    console.error("=== DASHBOARD ERROR ===", error.message);
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = { getDashboardStats };
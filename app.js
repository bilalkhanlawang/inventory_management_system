require ("dotenv").config();
const  express = require ("express")
const app = express();
// this is for connection of database 
const {pool, testDB} = require ("./config/db.js")
app.use(express.json());
// connection function call
testDB();
const usersRoutes = require("./routes/usersRoutes.js");
const categoryRoutes = require("./routes/categoryRoutes.js");
const unitsRouter = require("./routes/unitRoutes.js");
const currenciesRouter = require("./routes/currenciesRouter.js");
const customersRouter = require("./routes/customerRoutes.js");
const vendorsRouter = require("./routes/vendorRoutes.js");
const itemsRouter = require("./routes/itemRoutes.js");
const purchasesRouter = require("./routes/purchasesRoutes.js");
const purchaseDetailsRouter = require("./routes/purchaseDetailsRoutes.js");
const salesRouter = require("./routes/salesRoutes.js");
const salesDetailsRouter = require("./routes/salesDetailsRoues.js");
const purchasePaymentRouter = require("./routes/purchasePaymentRoutes.js");
const salePurchaseAllocationRouter = require("./routes/salePurchaseAll.Roues.js");
const customerPaymentRouter = require("./routes/customerPaymentRoutes.js");
const exchangeRateRouter = require("./routes/exchangeRateRoutes.js");

// this is for authentication router
const signupRouter = require("./routes/authRoutes.js");

app.use("/api/users",usersRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/units" ,unitsRouter );
app.use("/api/currencies" , currenciesRouter);
app.use("/api/customers", customersRouter);
app.use("/api/vendors" , vendorsRouter);
app.use("/api/items",itemsRouter);
app.use("/api/purchases" ,purchasesRouter);
app.use("/api/purchase_detail",purchaseDetailsRouter);
app.use("/api/sales",salesRouter);
app.use("/api/sales_details",salesDetailsRouter);
app.use("/api/purchase_payment",purchasePaymentRouter);
app.use("/api/sale_purchase_allocation",salePurchaseAllocationRouter);
app.use("/api/customer_payment",customerPaymentRouter);
app.use("/api/exchange_rate",exchangeRateRouter);

// this is for authentication
app.use("/api/auth",signupRouter);


app.listen(process.env.PORT , () => {
    console.log(`Server runing on prot ${process.env.PORT}`);
});
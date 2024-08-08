const path = require('path');
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require('cors');
const compression = require('compression');
const connectToDB = require("./config/dbConnect");

const app = express();
const port = process.env.PORT || 7777;
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/error.middleware");

// Connect to MongoDB
connectToDB();

// Enable other domains to access your application
app.use(cors())
app.options('*', cors());

// compress all responses
app.use(compression());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

// bodyParser middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'images')));

// routes
app.use("/api/categories", require("./routes/category.route"));
app.use("/api/brands", require("./routes/brand.route"))    
app.use("/api/products", require("./routes/product.route"))
app.use("/api/users"  , require("./routes/user.route"));   
app.use("/api/auth"  , require("./routes/auth.route"));   
app.use("/api/reviews"  , require("./routes/review.route"));
app.use('/api/wishlist', require("./routes/wishlist.route"));   
app.use('/api/addresses', require("./routes/address.route"));   
app.use('/api/coupons', require("./routes/coupon.route"));   
app.use('/api/cart', require("./routes/cart.route"));   
app.use('/api/order', require("./routes/order.route"));   

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);
const server = app.listen(port, () => {
  console.log(`http://localhost:${port}/`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});

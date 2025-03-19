const express = require('express');
const dotenv = require('dotenv');
const morgan = require("morgan");
const cors = require('cors');
dotenv.config({ path: 'config.env' });
const sequelize = require('./config/database'); // Database connection setup
const ApiError = require('./utils/appError');
const globalError = require('./middleware/errorMiddleWare');
const authRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRouters = require('./routes/subCategoryRouters');
const app = express();

// Middleware Setup
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // HTTP request logging

// Body Parsing Middleware
app.use(express.json()); // For JSON bodies
app.use(express.urlencoded({ extended: true })); // For URL encoded bodies

// Routes
app.use('/api/v1/users', authRoutes);
app.use('/api/v1/category', categoryRoutes);
app.use('/api/v1/subcatergory', subCategoryRouters)
// Error Handling Middleware
app.use(globalError); // Catch all errors

// Connect to database and sync models
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successful!");
    return sequelize.sync({ alter: true }); // Sync models here
  })
  .then(() => {
    console.log("Database & tables synchronized successfully.");
  })
  .catch((err) => {
    console.error("Database connection or sync failed:", err);
  });

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
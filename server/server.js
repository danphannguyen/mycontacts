require('dotenv').config();
const express = require("express");
const cors = require("cors")
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./docs/swagger.json");

const connectDB = require('./config/database');
const routes = require('./routes');

const errorHandler = require('./middleware/errorHandler');



const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.FRONTENT_URL

// Allow CORS from Frontend
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true // si tu utilises des cookies ou sessions
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api', routes);

// Swagger 
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware d'erreur
app.use(errorHandler)

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
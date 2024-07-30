const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet')
require('dotenv').config();
const connectDB = require('./config/db');
const routes = require('./routes'); // Import the routes index file
const dueDateReminder = require('./scheduler/dueDateReminder');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./src/swagger.yaml'); // Load the OpenAPI specification
const errorHandler = require('./middleware/errorHandler'); // Import the error handler
const app = express();

// Connect to the database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
// Serve API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Use routes
app.use('/api', routes); // Use the consolidated routes

app.get('/', (req, res) => {
    res.send('Task Manager API');
});


// Error handling middleware
app.use(errorHandler);

module.exports = app;

const app = require('./app');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Read PORT from .env
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

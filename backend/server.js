require('dotenv').config();
const app = require('./src/app');
const { connectDB } = require('./src/config/database');

const PORT = process.env.PORT || 5000;

const spinServer = async () => {
    try {  
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        })
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

spinServer();
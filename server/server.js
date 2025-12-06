require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Handle port already in use error
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`\n⚠️  Port ${PORT} is already in use!`);
    console.log('💡 Solutions:');
    console.log('   1. Close other terminal running the server');
    console.log('   2. Kill the process using the port:');
    console.log(`      netstat -ano | findstr :${PORT}`);
    console.log('      taskkill /PID <PID> /F');
    console.log('   3. Or change PORT in .env file\n');
    process.exit(1);
  } else {
    throw error;
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n\nGracefully shutting down from SIGINT (Ctrl+C)');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

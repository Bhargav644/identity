const { PrismaClient } = require('@prisma/client');

/* Benefits of PRISMA:
    1. Supports Connection Pooling
    2. Provides Type Safety
    3. Auto-generates Queries
    4. Easy Migrations
*/

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
});


const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('PostgreSQL Connected via Prisma');
    return prisma;
  } catch (error) {
    console.error('Database connection failed:', error.message);
    throw error;
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
  console.log('Database disconnected');
};

// ctrl + c and we'll disconnect from the database : Signal Interrupt
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

// docker will let me know when to stop the container : Signal Terminate
process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});


module.exports = { prisma, connectDB, disconnectDB };
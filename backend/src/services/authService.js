const bcrypt = require('bcrypt');
const { prisma } = require('../config/database');

class AuthService {
    /**
     * Register a new user
     * @param {Object} userData - {email, password, name}
     * @return {Object} Created user 
     */

    async registerUser(userData) {
        const { email, password, name } = userData;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const error = new Error('User already exists with this email');
            error.statusCode = 409;
            throw error;
        }
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS) || 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
            }
        });
        return newUser;
    }

    async validateUser(email, password) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }
        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }
}
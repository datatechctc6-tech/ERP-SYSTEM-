const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');

const registerUser = async (req, res) => {
    try {
        const { name, email, phone_number, password } = req.body;

        // Validation for required fields
        if (!name || !email || !phone_number || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if email already exists in login table
        const existingUser = await UserModel.findByEmail(email);

        if (existingUser) {
            // Idempotent behavior: return early if user already exists
            return res.status(409).json({ message: 'User already exists' });
        }

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert new user into database
        await UserModel.createUser({
            name,
            email,
            phone_number,
            password: hashedPassword
        });

        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    registerUser
};

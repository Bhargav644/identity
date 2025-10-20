/**
 * Validate Login Data
 * @params {Object} data - The login data to validate
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
function validateLoginData(data) {
    const errors = [];
    if (!data.email || typeof data.email !== 'string') {
        errors.push('Valid email is required');
    }
    if (!data.password || typeof data.password !== 'string') {
        errors.push('Password is required');
    }
    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}


/**
 * Validate Registration Data
 * @param {Object} data - {email, password, name}
 * @returns {Object} {isValid: boolean, errors: string[]}
 */
function validateRegisterData(data) {
    const errors = [];

    if (!data.email || typeof data.email !== 'string') {
        errors.push('Email is required');
    } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
        errors.push('Invalid email format');
    }

    if (!data.password || typeof data.password !== 'string') {
        errors.push('Password is required');
    } else if (data.password.length < 6) {
        errors.push('Password must be at least 6 characters');
    } else if (data.password.length > 128) {
        errors.push('Password too long');
    }

    if (!data.name || typeof data.name !== 'string') {
        errors.push('Name is required');
    } else if (data.name.trim().length === 0) {
        errors.push('Name cannot be empty');
    } else if (data.name.length > 50) {
        errors.push('Name cannot exceed 50 characters');
    }

    return {
        isValid: errors.length === 0,
        errors,
    }
}
 

module.exports = {
    validateLoginData,
    validateRegisterData,
};
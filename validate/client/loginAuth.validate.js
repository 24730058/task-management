function validateLoginInput({ email, password }) {
    const errors = {};

    if (!email || typeof email !== 'string' || !email.trim()) {
        errors.email = 'Email is required.';
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) {
        errors.email = 'Invalid email format.';
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
        errors.password = 'Password is required.';
    } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters.';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

module.exports = validateLoginInput;
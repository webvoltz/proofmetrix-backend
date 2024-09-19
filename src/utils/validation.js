//Validate login user inputs
const validateLoginInputs = (data) => {
    const { email, password } = data;
    if (!email || !password) {
        return new Error("Email and password required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return new Error("Please enter a valid Email.");
    }
};

//Validate the create user inputs
const validateCreateUserInputs = (data) => {
    const { username, email, password } = data;

    if (!username) {
        return new Error("Username is required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return new Error("Please enter a valid Email.");
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
        return new Error(
            "Password must be at least 8 characters long and contain at least one letter, one number, and one special character."
        );
    }
};

module.exports = { validateLoginInputs, validateCreateUserInputs }
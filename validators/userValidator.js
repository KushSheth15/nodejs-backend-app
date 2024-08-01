const { body } = require("express-validator");

const userValidator = [
    body("fullName").trim().notEmpty().withMessage("Full Name is required"),

    body("email")
        .trim()
        .isEmail().withMessage("Email is Invalid")
        .normalizeEmail(),

    body("username")
        .trim()
        .notEmpty().withMessage("Username is required")
        .isAlphanumeric().withMessage("Username must contain only letters and numbers"),

    body("password")
        .trim()
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),

];

module.exports = userValidator;
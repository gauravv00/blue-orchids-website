/**
 * Input Validation Rules using express-validator
 */
const { body } = require('express-validator');

const validateBooking = [
  body('name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .escape(),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\+]?[0-9\s\-\(\)]{7,20}$/).withMessage('Please enter a valid phone number'),

  body('date')
    .notEmpty().withMessage('Date is required')
    .isDate().withMessage('Please enter a valid date')
    .custom((value) => {
      const selected = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        throw new Error('Date cannot be in the past');
      }
      return true;
    }),

  body('time')
    .trim()
    .notEmpty().withMessage('Time is required'),

  body('guests')
    .optional()
    .isInt({ min: 1, max: 20 }).withMessage('Guests must be between 1 and 20')
    .toInt(),

  body('special_requests')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Special requests must be under 500 characters')
    .escape()
];

module.exports = { validateBooking };

// File: middleware/validator.js
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  function validateAccount(req, res, next) {
    const { email, firstName, lastName } = req.body;
    const errors = [];
    
    // Email validation
    if (!email) {
      errors.push('Email is required');
    } else if (!isValidEmail(email)) {
      errors.push('Invalid email format');
    }
    
    // First name validation
    if (!firstName) {
      errors.push('First name is required');
    } else if (firstName.length < 2 || firstName.length > 50) {
      errors.push('First name must be between 2 and 50 characters');
    }
    
    // Last name validation
    if (!lastName) {
      errors.push('Last name is required');
    } else if (lastName.length < 2 || lastName.length > 50) {
      errors.push('Last name must be between 2 and 50 characters');
    }
    
    // If there are validation errors, return them
    if (errors.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  }
  
  module.exports = {
    validateAccount
  };
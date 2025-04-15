// File: routes/accountRoutes.js
const express = require('express');
const accountController = require('../controllers/accountController');
const { validateAccount } = require('../middleware/validator');

const router = express.Router();

/**
 * @route   POST /api/accounts
 * @desc    Create a new account
 * @access  Public
 */
router.post('/', validateAccount, accountController.createAccount);

/**
 * @route   PUT /api/accounts/:id
 * @desc    Update an existing account
 * @access  Public
 */
router.put('/:id', validateAccount, accountController.updateAccount);

/**
 * @route   DELETE /api/accounts/:id
 * @desc    Delete an account
 * @access  Public
 */
router.delete('/:id', accountController.deleteAccount);

module.exports = router;
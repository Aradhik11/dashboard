// File: controllers/accountController.js
/**
 * Account controller handling account CRUD operations
 */
class AccountController {
    /**
     * Create a new account
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async createAccount(req, res, next) {
      const { email, firstName, lastName} = req.body;
      const pool = req.app.locals.pool;
      
      try {
        // Check if email already exists
        const existingAccount = await pool.query(
          'SELECT * FROM accounts WHERE email = $1',
          [email]
        );
        
        if (existingAccount.rows.length > 0) {
          return res.status(409).json({
            status: 'error',
            message: 'An account with this email already exists'
          });
        }
        
        // Create new account
        const result = await pool.query(
          `INSERT INTO accounts 
          (email, first_name, last_name, created_at, updated_at) 
          VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
          RETURNING id, email, first_name, last_name, created_at`,
          [email, firstName, lastName ]
        );
        
        res.status(201).json({
          status: 'success',
          data: result.rows[0]
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * Update an existing account
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async updateAccount(req, res, next) {
      const { id } = req.params;
      const { email, firstName, lastName } = req.body;
      const pool = req.app.locals.pool;
      
      try {
        // Check if account exists
        const existingAccount = await pool.query(
          'SELECT * FROM accounts WHERE id = $1',
          [id]
        );
        
        if (existingAccount.rows.length === 0) {
          return res.status(404).json({
            status: 'error',
            message: 'Account not found'
          });
        }
        
        // Check if new email already exists for a different account
        if (email !== existingAccount.rows[0].email) {
          const emailExists = await pool.query(
            'SELECT * FROM accounts WHERE email = $1 AND id != $2',
            [email, id]
          );
          
          if (emailExists.rows.length > 0) {
            return res.status(409).json({
              status: 'error',
              message: 'This email is already in use by another account'
            });
          }
        }
        
        // Update account
        const result = await pool.query(
          `UPDATE accounts 
          SET email = $1, first_name = $2, last_name = $3, updated_at = NOW() 
          WHERE id = $4 
          RETURNING id, email, first_name, last_name, updated_at`,
          [email, firstName, lastName, id]
        );
        
        res.status(200).json({
          status: 'success',
          data: result.rows[0]
        });
      } catch (error) {
        next(error);
      }
    }
  
    /**
     * Delete an account
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    async deleteAccount(req, res, next) {
      const { id } = req.params;
      const pool = req.app.locals.pool;
      
      try {
        // Check if account exists
        const existingAccount = await pool.query(
          'SELECT * FROM accounts WHERE id = $1',
          [id]
        );
        
        if (existingAccount.rows.length === 0) {
          return res.status(404).json({
            status: 'error',
            message: 'Account not found'
          });
        }
        
        // Delete account
        await pool.query('DELETE FROM accounts WHERE id = $1', [id]);
        
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  }
  
  module.exports = new AccountController();
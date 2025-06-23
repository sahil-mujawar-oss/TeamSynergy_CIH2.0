/**
 * Privacy Controller
 * Handles API requests for privacy-preserving data sharing features including
 * ZK-proof generation, verification, and selective disclosure.
 */
// Use the real ZK-proof service implementation with snarkjs
const privacyService = require('../services/real-zk.service');

/**
 * Generate a Zero-Knowledge Proof
 * @route POST /api/privacy/generate-proof
 */
exports.generateProof = async (req, res) => {
  try {
    const { statement } = req.body;
    
    // Use the authenticated user's ID
    const userId = req.user.id;
    
    if (!statement) {
      return res.status(400).json({ message: 'Valid statement object is required' });
    }
    
    // Handle different proof types based on the statement
    let proof;
    
    if (statement.type === 'equality') {
      // Validate secret value
      if (!statement.value || isNaN(statement.value)) {
        return res.status(400).json({ message: 'Valid numeric value is required for equality proof' });
      }
      
      // Generate equality proof
      proof = await privacyService.generateEqualityProof(userId, Number(statement.value));
    } 
    else if (statement.type === 'range') {
      // Validate min and max values
      if (!statement.min || isNaN(statement.min) || !statement.max || isNaN(statement.max)) {
        return res.status(400).json({ message: 'Valid min and max values are required for range proof' });
      }
      
      if (statement.min >= statement.max) {
        return res.status(400).json({ message: 'Min value must be less than max value' });
      }
      
      // Validate secret value
      if (!statement.value || isNaN(statement.value)) {
        return res.status(400).json({ message: 'Valid numeric value is required for range proof' });
      }
      
      // Generate range proof
      proof = await privacyService.generateRangeProof(
        userId, 
        Number(statement.value), 
        Number(statement.min), 
        Number(statement.max)
      );
    } 
    else {
      return res.status(400).json({ 
        message: 'Invalid proof type. Supported types: equality, range',
        example: {
          equality: {
            type: 'equality',
            value: 42
          },
          range: {
            type: 'range',
            value: 750,
            min: 700,
            max: 850
          }
        }
      });
    }
    
    res.json(proof);
  } catch (err) {
    console.error('Error generating ZK-proof:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Verify a Zero-Knowledge Proof
 * @route GET /api/privacy/verify-proof/:proofId
 */
exports.verifyProof = async (req, res) => {
  try {
    const { proofId } = req.params;
    
    if (!proofId) {
      return res.status(400).json({ message: 'Proof ID is required' });
    }
    
    const verification = await privacyService.verifyProof(proofId);
    res.json(verification);
  } catch (err) {
    console.error('Error verifying ZK-proof:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Get all proofs for a user
 * @route GET /api/privacy/proofs
 */
exports.getUserProofs = async (req, res) => {
  try {
    // Use the authenticated user's ID
    const userId = req.user.id;
    
    const proofs = await privacyService.getUserProofs(userId);
    res.json(proofs);
  } catch (err) {
    console.error('Error fetching user proofs:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Revoke a Zero-Knowledge Proof
 * @route DELETE /api/privacy/proofs/:proofId
 */
exports.revokeProof = async (req, res) => {
  try {
    const { proofId } = req.params;
    
    // Use the authenticated user's ID
    const userId = req.user.id;
    
    if (!proofId) {
      return res.status(400).json({ message: 'Proof ID is required' });
    }
    
    const revocation = await privacyService.revokeZKProof(userId, proofId);
    res.json(revocation);
  } catch (err) {
    console.error('Error revoking ZK-proof:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/**
 * Generate a selective disclosure proof
 * @route POST /api/privacy/selective-disclosure
 */
exports.generateSelectiveDisclosure = async (req, res) => {
  try {
    const { data, fields } = req.body;
    
    // Use the authenticated user's ID
    const userId = req.user.id;
    
    if (!data || !fields || !Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ 
        message: 'Valid data object and fields array are required',
        example: {
          data: {
            name: 'John Doe',
            email: 'john@example.com',
            creditScore: 750,
            income: 75000
          },
          fields: ['creditScore', 'income']
        }
      });
    }
    
    // Validate that all fields exist in the data
    const invalidFields = fields.filter(field => data[field] === undefined);
    if (invalidFields.length > 0) {
      return res.status(400).json({ 
        message: `The following fields do not exist in the provided data: ${invalidFields.join(', ')}`
      });
    }
    
    const disclosure = await privacyService.generateSelectiveDisclosure(userId, data, fields);
    res.json(disclosure);
  } catch (err) {
    console.error('Error generating selective disclosure:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

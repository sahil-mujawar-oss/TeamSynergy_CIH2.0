const express = require('express');
const router = express.Router();
const privacyController = require('../controllers/privacy.controller');
const auth = require('../middleware/auth');

/**
 * @route POST /api/privacy/generate-proof
 * @desc Generate a Zero-Knowledge Proof
 * @access Private
 */
router.post('/generate-proof', auth, privacyController.generateProof);

/**
 * @route GET /api/privacy/verify-proof/:proofId
 * @desc Verify a Zero-Knowledge Proof
 * @access Public
 */
router.get('/verify-proof/:proofId', privacyController.verifyProof);

/**
 * @route GET /api/privacy/proofs
 * @desc Get all proofs for a user
 * @access Private
 */
router.get('/proofs', auth, privacyController.getUserProofs);

/**
 * @route DELETE /api/privacy/proofs/:proofId
 * @desc Revoke a Zero-Knowledge Proof
 * @access Private
 */
router.delete('/proofs/:proofId', auth, privacyController.revokeProof);

/**
 * @route POST /api/privacy/selective-disclosure
 * @desc Generate a selective disclosure proof
 * @access Private
 */
router.post('/selective-disclosure', auth, privacyController.generateSelectiveDisclosure);

module.exports = router;

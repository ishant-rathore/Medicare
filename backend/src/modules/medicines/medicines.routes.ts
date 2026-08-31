// =============================================================================
// backend/src/modules/medicines/medicines.routes.ts
// Express router for medicines module
// All routes require authentication
// =============================================================================

import { Router } from 'express';

import { requireAuth } from '../../middleware/auth.middleware';
import { MedicinesController } from './medicines.controller';

const router = Router();

// All medicine routes require authentication
router.use(requireAuth);

/**
 * GET /api/v1/medicines
 * List all medicines for the authenticated user
 * Query: page, limit, isActive, search
 */
router.get('/', MedicinesController.list);

/**
 * GET /api/v1/medicines/low-stock
 * Get medicines below their low stock threshold
 */
router.get('/low-stock', MedicinesController.getLowStock);

/**
 * GET /api/v1/medicines/:id
 * Get a specific medicine by ID
 */
router.get('/:id', MedicinesController.getById);

/**
 * POST /api/v1/medicines
 * Create a new medicine
 */
router.post('/', MedicinesController.create);

/**
 * PUT /api/v1/medicines/:id
 * Update a medicine
 */
router.put('/:id', MedicinesController.update);

/**
 * PATCH /api/v1/medicines/:id/stock
 * Update medicine stock count
 */
router.patch('/:id/stock', MedicinesController.updateStock);

/**
 * DELETE /api/v1/medicines/:id
 * Soft-delete a medicine
 */
router.delete('/:id', MedicinesController.delete);

export default router;

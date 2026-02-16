import express from 'express';
import { getUsers, getUser } from '../controllers/users.js';

import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Only admins can access these routes
router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getUsers);
router.route('/:id').get(getUser);

export default router;

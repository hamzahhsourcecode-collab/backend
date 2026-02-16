import express from 'express';
import {
    getAllData,
    getData,
    createData,
    updateData,
    deleteData,
} from '../controllers/data.js';

import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/').get(getAllData).post(protect, createData);

router
    .route('/:id')
    .get(getData)
    .put(protect, updateData)
    .delete(protect, deleteData);

export default router;

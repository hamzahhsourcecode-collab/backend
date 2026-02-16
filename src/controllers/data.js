import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import Data from '../models/Data.js';

// @desc    Get all data entries
// @route   GET /api/v1/data
// @access  Public
export const getAllData = asyncHandler(async (req, res, next) => {
    const data = await Data.find().populate({
        path: 'user',
        select: 'name email',
    });

    res.status(200).json({
        success: true,
        count: data.length,
        data: data,
    });
});

// @desc    Get single data entry
// @route   GET /api/v1/data/:id
// @access  Public
export const getData = asyncHandler(async (req, res, next) => {
    const entry = await Data.findById(req.params.id);

    if (!entry) {
        return next(
            new ErrorResponse(`Data entry not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: entry,
    });
});

// @desc    Create new data entry
// @route   POST /api/v1/data
// @access  Private
export const createData = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;

    const entry = await Data.create(req.body);

    res.status(201).json({
        success: true,
        data: entry,
    });
});

// @desc    Update data entry
// @route   PUT /api/v1/data/:id
// @access  Private
export const updateData = asyncHandler(async (req, res, next) => {
    let entry = await Data.findById(req.params.id);

    if (!entry) {
        return next(
            new ErrorResponse(`Data entry not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is owner
    if (entry.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this entry`,
                401
            )
        );
    }

    entry = await Data.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: entry,
    });
});

// @desc    Delete data entry
// @route   DELETE /api/v1/data/:id
// @access  Private
export const deleteData = asyncHandler(async (req, res, next) => {
    const entry = await Data.findById(req.params.id);

    if (!entry) {
        return next(
            new ErrorResponse(`Data entry not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is owner
    if (entry.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this entry`,
                401
            )
        );
    }

    await entry.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});

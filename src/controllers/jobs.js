import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';
import Job from '../models/Job.js';

// @desc    Get all jobs
// @route   GET /api/v1/jobs
// @access  Public
export const getJobs = asyncHandler(async (req, res, next) => {
    const jobs = await Job.find().populate({
        path: 'user',
        select: 'name email',
    });

    res.status(200).json({
        success: true,
        count: jobs.length,
        data: jobs,
    });
});

// @desc    Get single job
// @route   GET /api/v1/jobs/:id
// @access  Public
export const getJob = asyncHandler(async (req, res, next) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        return next(
            new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
        );
    }

    res.status(200).json({
        success: true,
        data: job,
    });
});

// @desc    Create new job
// @route   POST /api/v1/jobs
// @access  Private
export const createJob = asyncHandler(async (req, res, next) => {
    // Add user to req.body
    req.body.user = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({
        success: true,
        data: job,
    });
});

// @desc    Update job
// @route   PUT /api/v1/jobs/:id
// @access  Private
export const updateJob = asyncHandler(async (req, res, next) => {
    let job = await Job.findById(req.params.id);

    if (!job) {
        return next(
            new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is job owner
    if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to update this job`,
                401
            )
        );
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        data: job,
    });
});

// @desc    Delete job
// @route   DELETE /api/v1/jobs/:id
// @access  Private
export const deleteJob = asyncHandler(async (req, res, next) => {
    const job = await Job.findById(req.params.id);

    if (!job) {
        return next(
            new ErrorResponse(`Job not found with id of ${req.params.id}`, 404)
        );
    }

    // Make sure user is job owner
    if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(
            new ErrorResponse(
                `User ${req.user.id} is not authorized to delete this job`,
                401
            )
        );
    }

    await job.deleteOne();

    res.status(200).json({
        success: true,
        data: {},
    });
});

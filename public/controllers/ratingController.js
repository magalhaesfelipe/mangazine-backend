"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRating = exports.createRating = exports.getAverageRating = exports.getRating = void 0;
const ratingModel_1 = __importDefault(require("../models/ratingModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
// GET RATING
exports.getRating = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userId, titleId } = req.params;
    const userRating = await ratingModel_1.default.findOne({
        userId: userId,
        titleId: titleId,
    });
    if (!userRating) {
        res.status(404).json({
            status: 'success',
            message: 'No rating found for this user'
        });
    }
    res.status(200).json({
        status: 'success',
        message: 'User data rating',
        userRating,
    });
});
// GET AVERAGE RATING
exports.getAverageRating = (0, catchAsync_1.default)(async (req, res, next) => {
    const { titleId } = req.params;
    const titleRatings = await ratingModel_1.default.aggregate([
        { $match: { titleId: titleId } },
        { $group: { _id: '$titleId', averageRating: { $avg: '$rating' } } },
    ]);
    console.log('Title ratings: ', titleRatings);
    const avgRating = titleRatings.length ? titleRatings[0].averageRating : 0;
    res.status(200).json({
        status: 'success',
        message: 'OVERALL RATING: ',
        averageRating: avgRating,
    });
});
// CREATE OR UPDATE RATING
exports.createRating = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userId, titleId, ratingValue } = req.body;
    console.log('Received data: ', { userId, titleId, ratingValue });
    // Try to find the existing rating first
    const existingRating = await ratingModel_1.default.findOne({ userId, titleId });
    // Find and update the existing rating, or create a new one if not found
    const rating = await ratingModel_1.default.findOneAndUpdate({ userId: userId, titleId: titleId }, // First object with the fields to identify the document
    { rating: ratingValue }, // Second object with the field to be updated and its new value
    { new: true, runValidators: true, upsert: true });
    // Determine whether the document was created or updated
    const wasCreated = !existingRating;
    console.log(wasCreated);
    res.status(wasCreated ? 201 : 200).json({
        status: 'success',
        message: wasCreated
            ? 'Rating created successfully'
            : 'Rating updated successfully',
        ratingObject: rating,
    });
});
// DELETE RATING
exports.deleteRating = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userId, titleId } = req.params;
    const rating = await ratingModel_1.default.findOneAndDelete({ userId, titleId });
    if (!rating) {
        return res.status(404).json({
            status: 'fail',
            message: 'No rating found with that userId or titleId',
        });
    }
    res.status(204).send();
});

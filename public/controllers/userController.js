"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLists = exports.removeFromReadlist = exports.addToReadlist = exports.checkItemExists = exports.getReadlist = exports.createUser = exports.getUserRole = exports.checkUserExists = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const mongoose_1 = require("mongoose");
// CHECK IF USER EXISTS
exports.checkUserExists = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = await userModel_1.default.findOne({ userId: req.params.userId });
    if (user) {
        return res.status(200).json({ exists: true });
    }
    return res.status(200).json({ exists: false });
});
// GET USER ROLE
exports.getUserRole = (0, catchAsync_1.default)(async (req, res, next) => {
    const user = await userModel_1.default.findOne({ userId: req.params.userId });
    if (!user) {
        return next(new appError_1.default('User not found', 404));
    }
    return res.status(200).json({
        status: 'success',
        userRole: user.role,
    });
});
// CREATE USER
exports.createUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userName, email, userId } = req.body;
    const newUser = await userModel_1.default.create({
        userName,
        email,
        userId,
    });
    res.status(201).json({
        status: 'success',
        data: {
            list: newUser,
        },
    });
});
// GET READLIST
exports.getReadlist = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userId } = req.params;
    const user = await userModel_1.default.findOne({ userId }).populate({
        path: 'readList',
        select: 'name cover author releaseYear', // Selecting only the necessary fields
    });
    if (!user) {
        return next(new appError_1.default('User not found', 404));
    }
    const { readList } = user;
    console.log('Fetched Readlist: ', readList);
    res.status(200).json({
        status: 'success',
        readList,
    });
});
// CHECK IF ITEM EXISTS IN THE READLIST
exports.checkItemExists = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userId, titleId } = req.params;
    // Validate and convert titleId to ObjectId
    let titleObjectId;
    try {
        titleObjectId = new mongoose_1.Types.ObjectId(titleId); // Validate
    }
    catch (error) {
        return next(new appError_1.default('Invalid title ID format', 400));
    }
    const user = await userModel_1.default.findOne({ userId: userId });
    if (!user) {
        return next(new appError_1.default('User not found', 404));
    }
    if (user.readList.includes(titleId)) {
        return res.status(200).json({ exists: true });
    }
    return res.status(200).json({ exists: false });
});
// ADD ITEM TO THE READLIST
exports.addToReadlist = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userId, titleId } = req.params;
    const user = await userModel_1.default.findOne({ userId: userId });
    if (!user) {
        return next(new appError_1.default('User not found', 404));
    }
    user.readList.push(titleId);
    await user.save();
    res.status(200).json({
        message: 'Item added successfully',
        readList: user.readList,
    });
});
// REMOVE ITEM FROM THE READLIST
exports.removeFromReadlist = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userId, titleId } = req.params;
    const result = await userModel_1.default.updateOne({ userId: userId }, { $pull: { readList: titleId } });
    if (result.matchedCount === 0) {
        return next(new appError_1.default('User not found', 404));
    }
    /*
    const user = await User.findOne({ userId: userId });

    if (!user) {
      return next(new AppError('User not found', 404));
    }
    // Filter out the titleId from the readList (alternative method)
    user.readlist = user.readList.filter((id) => id.toString() !== titleId)
    user.readList.pull(titleId);
    await user.save();
    */
    res.status(204).send();
});
// GET LISTS
const getLists = async (req, res, next) => {
    // Retrieve the userId from the request
    const { userId } = req.params;
    // Find the user by userId and populate the lists field
    const user = await userModel_1.default.findOne({ userId }).populate('lists');
    if (!user) {
        return next(new appError_1.default('User not found', 404));
    }
    // Extract the lists from the user object
    const { lists } = user;
    // Return the lists
    return res.status(200).json({
        status: 'success',
        result: lists.length,
        data: { lists },
    });
};
exports.getLists = getLists;

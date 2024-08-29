"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromList = exports.addToList = exports.createList = exports.checkTitleExists = exports.getListById = exports.getAllLists = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const listModel_1 = __importDefault(require("../models/listModel"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const mongoose_1 = require("mongoose");
exports.getAllLists = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userId } = req.params;
    const lists = await listModel_1.default.find({ userId: userId });
    if (!lists)
        return next(new appError_1.default('No lists found', 404));
    res.status(200).json({
        status: 'success',
        lists,
    });
});
// GET LIST BY ID
exports.getListById = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userId } = req.params;
    const list = await listModel_1.default.findById(userId).populate('titles');
    if (!list) {
        return next(new appError_1.default('List not found', 404));
    }
    res.status(200).json({
        status: 'sucess',
        list,
    });
});
// CHECK IF TITLE EXISTS IN THE LIST
exports.checkTitleExists = (0, catchAsync_1.default)(async (req, res, next) => {
    const { listId, titleId } = req.params;
    // Validate listId and titleId
    if (!mongoose_1.Types.ObjectId.isValid(listId) || !mongoose_1.Types.ObjectId.isValid(titleId)) {
        return next(new appError_1.default('Invalid list or title ID format', 400));
    }
    // Using projection to check for the title's existence
    // and only passing the '_id' to the 'list' variable, instead of the full list document, with other fields like 'name'
    const list = await listModel_1.default.findOne({ _id: listId, titles: titleId }, // Filter the List collection for a document with the  fields '_id' and 'titles' equal to the listId and titleId received in the params
    { _id: 1 });
    if (list) {
        return res.status(200).json({ exists: true });
    }
    return res.status(200).json({ exists: false });
});
// CREATE LIST
exports.createList = (0, catchAsync_1.default)(async (req, res, next) => {
    const { name, titles, userId } = req.body;
    const newList = await listModel_1.default.create({
        name,
        titles,
        userId,
    });
    await userModel_1.default.findOneAndUpdate({ userId }, { $push: { lists: newList._id } }, { new: true, useFindAndModify: false });
    res.status(201).json({
        status: 'success',
        data: {
            list: newList,
        },
    });
});
// ADD ITEM TO LIST
exports.addToList = (0, catchAsync_1.default)(async (req, res, next) => {
    const { titleId, listId } = req.params;
    const list = await listModel_1.default.findOne({ _id: listId });
    if (!list)
        return next(new appError_1.default('List not found', 404));
    await listModel_1.default.updateOne({ _id: listId }, { $push: { titles: titleId } });
    return res.status(200).json({
        status: 'success',
        message: 'Item added to list',
        list: list,
    });
});
// REMOVE ITEM FROM LIST
exports.removeFromList = (0, catchAsync_1.default)(async (req, res, next) => {
    const { titleId, listId } = req.params;
    const list = await listModel_1.default.findOne({ _id: listId });
    if (!list)
        return next(new appError_1.default('List not found', 404));
    await listModel_1.default.updateOne({ _id: listId }, { $pull: { titles: titleId } });
    return res.status(200).json({
        status: 'success',
        message: 'Item removed from list',
        list: list,
    });
});

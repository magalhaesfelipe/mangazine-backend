"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTitle = exports.updateTitle = exports.createTitle = exports.getTitlesByName = exports.getTitleById = exports.getAllTitles = void 0;
const titleModel_1 = __importDefault(require("../models/titleModel"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const mongoose_1 = require("mongoose");
exports.getAllTitles = (0, catchAsync_1.default)(async (req, res, next) => {
    // BUILD THE QUERY
    // 1A) FILTERING
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);
    // 1B) ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    let query = titleModel_1.default.find(JSON.parse(queryStr)); // temporary final query
    // 2) SORTING
    if (typeof req.query.sort === 'string') {
        const sortBy = req.query.sort.split(',').join(' ');
        console.log(sortBy);
        query = query.sort(sortBy);
    }
    else {
        query = query.sort('name');
    }
    // 3) FIELD LIMITING
    if (typeof req.query.fields === 'string') {
        const fields = req.query.fields.split(',').join(' ');
        console.log(fields);
        query = query.select(fields);
    }
    else {
        query = query.select('-description');
    }
    // EXECUTE THE QUERY
    const titles = await query;
    res.status(200).json({
        status: 'success',
        result: titles.length,
        data: {
            titles,
        },
    });
});
// GET TITLE BY ID
exports.getTitleById = (0, catchAsync_1.default)(async (req, res, next) => {
    const title = await titleModel_1.default.findById(req.params.titleId);
    if (!title) {
        return next(new appError_1.default('No title found with that ID', 404));
    }
    res.status(200).json({
        status: 'success',
        title,
    });
});
// GET TITLE BY NAME
exports.getTitlesByName = (0, catchAsync_1.default)(async (req, res, next) => {
    const { titleName } = req.params; // Get the query parameter from the URL
    if (typeof titleName === 'string') {
        const titles = await titleModel_1.default.find({ name: new RegExp(titleName, 'i') }); // Perform case-insensitive search
        if (titles.length === 0) {
            return next(new appError_1.default('No title found with that name', 404));
        }
        res.status(200).json({
            status: 'success',
            message: `${titles.length} items found.`,
            titles,
        });
    }
});
// CREATE TITLE      This entire async fn is passed as parameter to catchAsync
exports.createTitle = (0, catchAsync_1.default)(async (req, res, next) => {
    const newTitle = await titleModel_1.default.create(req.body);
    res.status(201).json({
        status: 'Success',
        data: {
            title: newTitle,
        },
    });
});
// UPDATE TITLE
exports.updateTitle = (0, catchAsync_1.default)(async (req, res, next) => {
    const { titleId } = req.params;
    const updates = req.body;
    const title = await titleModel_1.default.findOneAndUpdate({ _id: titleId }, updates, {
        new: true, // Return the updated document
        runValidators: true,
    });
    res.status(200).json({
        status: 'success',
        message: 'Title updated succesfully',
        data: {
            title,
        },
    });
});
// DELETE TITLE
exports.deleteTitle = (0, catchAsync_1.default)(async (req, res, next) => {
    // Validate the ID
    const { id } = req.params;
    if (!mongoose_1.Types.ObjectId.isValid(id)) {
        return next(new appError_1.default('Invalid ID format', 400));
    }
    const title = await titleModel_1.default.findOneAndDelete({ _id: id });
    if (!title) {
        return next(new appError_1.default('No title found with that with that id to delete', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null,
    });
});

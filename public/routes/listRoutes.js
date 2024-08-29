"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const listController_1 = require("../controllers/listController");
const router = express_1.default.Router();
// Checks if item exists in the list
router.route('/:listId/titles/:titleId/exists').get(listController_1.checkTitleExists);
// Get all lists
router.route('/get-all-lists/:userId').get(listController_1.getAllLists);
// Get lists by ID
router.route('/:userId').get(listController_1.getListById);
// Create list
router.route('/create-list').post(listController_1.createList);
// Add to list
router.route('/:listId/add-to-list/:titleId').patch(listController_1.addToList);
// Remove from list
router.route('/:listId/remove-from-list/:titleId').patch(listController_1.removeFromList);
exports.default = router;

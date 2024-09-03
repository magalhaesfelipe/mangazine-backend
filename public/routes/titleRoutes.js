"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const titleController_1 = require("../controllers/titleController");
const router = express_1.default.Router();
router.route('/').get(titleController_1.getAllTitles);
router.route('/search/:titleName').get(titleController_1.getTitlesByName);
router.route('/:titleId').get(titleController_1.getTitleById);
router.route('/update-title/:titleId').patch(titleController_1.updateTitle);
router.route('/create-title').post(titleController_1.createTitle);
router.route('/delete/:titleId').delete(titleController_1.deleteTitle);
exports.default = router;

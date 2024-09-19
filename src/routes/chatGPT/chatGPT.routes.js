const { Router } = require("express");
const { CONSTANT_ROUTES } = require("../../constants/route.constants");
const { userOnly } = require("../../middleware/user.middleware");
const { aiContentCreation, listAiCreatedContent, viewAiCreatedContent, deleteCratedContent } = require("../../controller/chatGPTContoller/chatGPT.controller");

const chatGPTRouter = Router();

chatGPTRouter.post(CONSTANT_ROUTES.CHATGPT.GENERATE_CONTENT.POST, userOnly, aiContentCreation);

chatGPTRouter.get(CONSTANT_ROUTES.CHATGPT.LIST_GENERATED_CONTENT.GET, userOnly, listAiCreatedContent);

chatGPTRouter.get(CONSTANT_ROUTES.CHATGPT.VIEW_GENERATED_CONTENT.GET, userOnly, viewAiCreatedContent);

chatGPTRouter.delete(CONSTANT_ROUTES.CHATGPT.VIEW_GENERATED_CONTENT.GET, userOnly, deleteCratedContent);

module.exports = chatGPTRouter;

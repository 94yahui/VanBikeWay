import express from "express";
import bikewayRouter from "./bikewayRouter.js";
import commentRouter from "./commentRouter.js";

const router = express.Router();

router.use('/bikeway', bikewayRouter);
router.use('/comment', commentRouter);

export default router;
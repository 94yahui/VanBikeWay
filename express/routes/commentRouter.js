import express from "express";
import { getComments, getOneComment, uploadComment, updateComment,deleteComment, commentsByBikewayId } from "../controllers/commentController.js";
import validation from "../middleware/validation.js";

const commentRouter = express.Router();
commentRouter.get('/', getComments);
commentRouter.get('/:id', getOneComment);
commentRouter.get('/bikeway/:bikewayId', commentsByBikewayId);
commentRouter.post('/',validation.validateUploadComment, uploadComment);
commentRouter.patch('/:id', validation.validateUpdateComment,updateComment);
commentRouter.delete('/:id', deleteComment)

export default commentRouter;
import express from "express";
import { getBikeways, updateLikeStatus, getBikewaysBySurfaceType, getLikedBikeways} from "../controllers/bikewayController.js";

const bikewayRouter = express.Router();
bikewayRouter.get('/', getBikeways);
bikewayRouter.get('/type', getBikewaysBySurfaceType);
bikewayRouter.patch('/:id/likes', updateLikeStatus);
bikewayRouter.get('/likes', getLikedBikeways);
export default bikewayRouter;
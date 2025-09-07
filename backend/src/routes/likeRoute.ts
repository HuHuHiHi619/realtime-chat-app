import { Router } from "express";
import { LikeRepository } from "../repositories/post/likeRepository";
import { LikeService } from "../services/post/likeService";
import { LikeController } from "../controllers/post/likeController";
import { authenticateToken } from "../middlewares/jwtAuth";
import { validateRequest } from "../middlewares/validationReq";
import { validateLikeSchema } from "@shared/schema/post/like.schema";

const router = Router()

// --- Manual DI ---
const likeRepository = new LikeRepository()
const likeService = new LikeService(likeRepository)
const likeController = new LikeController(likeService)

// --- Route ---
    // -- POST --
    router.get(
        '/posts/:post_id/likes',
        authenticateToken,
        validateRequest({
            params : validateLikeSchema
        }),
        likeController.getPostLikes.bind(likeController)
    )
    router.post(
        '/posts/:post_id/likes',
        authenticateToken,
        validateRequest({
            params : validateLikeSchema
        }),
        likeController.likePost.bind(likeController)
    )
   
    // -- COMMENT --
     router.get(
        '/comments/:comment_id/likes',
        authenticateToken,
        validateRequest({
            params : validateLikeSchema
        }),
        likeController.getPostLikes.bind(likeController)
    )
    router.post(
        '/comments/:comment_id/likes',
        authenticateToken,
        validateRequest({
            params : validateLikeSchema
        }),
        likeController.likePost.bind(likeController)
    )
  
export default router
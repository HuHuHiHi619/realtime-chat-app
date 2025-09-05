import { Router } from "express";
import { PostController } from "../controllers/post/postController";
import { PostRepository } from "../repositories/post/postRepository";
import { PostService } from "../services/post/postService";
import { authenticateToken } from "../middlewares/jwtAuth";
import { requireUser } from "../middlewares/requireUser";
import { validateRequest } from "../middlewares/validationReq";
import { createPostSchema, getPostQuerySchema, paramsPostSchema } from "@shared/schema/post/post.schema";



const router = Router()

// --- Manual DI ---
const postRepository = new PostRepository()
const postService = new PostService(postRepository)
const postController = new PostController(postService)

// --- Route ---
router.get(
    "/posts",
    authenticateToken,
    requireUser,
    validateRequest({
        query : getPostQuerySchema
    }),
    postController.getPosts.bind(postController)
)

router.post(
    "/posts",
    authenticateToken,
    requireUser,
    validateRequest({
        body : createPostSchema
    }),
    postController.createPost.bind(postController)
)

router.delete(
    "/posts/:post_id",
    authenticateToken,
    requireUser,
    validateRequest({
        params : paramsPostSchema
    }),
    postController.deletePost.bind(postController)
)

export default router
import { Router } from "express";
import { authenticateToken } from "../middlewares/jwtAuth";
import { requireUser } from "../middlewares/requireUser";
import { validateRequest } from "../middlewares/validationReq";
import { CommentRepository } from "../repositories/post/commentRepository";
import { CommentService } from "../services/post/commentService";
import { CommentController } from "../controllers/post/commentController";
import { validateCreateCommentRequest, validateGetCommentsRequest } from "@shared/schema/post/comment.schema";


const router = Router()

// --- Manual DI ---
const commentRepository = new CommentRepository()
const commentService = new CommentService(commentRepository)
const commentController = new CommentController(commentService)

// --- Route ---
router.get(
    "/comments/:post_id",
    authenticateToken,
    requireUser,
    validateRequest(validateGetCommentsRequest),
    commentController.getComments.bind(commentController)
)

router.post(
    "/comments/:post_id",
    authenticateToken,
    requireUser,
    validateRequest(validateCreateCommentRequest),
    commentController.createComment.bind(commentController)
)

export default router
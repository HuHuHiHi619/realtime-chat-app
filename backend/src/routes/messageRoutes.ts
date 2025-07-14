import { Router } from "express";
import { createConversation, createMessage } from "../controllers/messageController";

const router = Router()

router.post('/create-conversation', createConversation)
router.post('/create-message', createMessage)

module.exports = router
import { Router } from "express";
import { createConversation, createMessage , getConversations, getMessages } from "../controllers/messageController";

const router = Router()

router.get('/conversations/:id', getConversations)
router.get('/conversations/:conversation_id/messages', getMessages)
router.post('/conversations', createConversation)


// สำรอง
router.post('/messages', createMessage)

module.exports = router
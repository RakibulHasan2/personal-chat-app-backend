import express from 'express';
import { MessageController } from '../controllers/MessageController.js';

const router = express.Router();
const messageController = new MessageController();

// GET routes
router.get('/', (req, res, next) => messageController.getAllMessages(req, res, next));
router.get('/search', (req, res, next) => messageController.searchMessages(req, res, next));
router.get('/between', (req, res, next) => messageController.getMessagesBetweenUsers(req, res, next));

// POST routes
router.post('/', (req, res, next) => messageController.createMessage(req, res, next));

// PUT routes
router.put('/:id', (req, res, next) => messageController.updateMessage(req, res, next));

// DELETE routes
router.delete('/:id', (req, res, next) => messageController.deleteMessage(req, res, next));

export default router;
import express from 'express';
import { UserController } from '../controllers/UserController.js';

const router = express.Router();
const userController = new UserController();

router.get('/', (req, res, next) => userController.getAllUsers(req, res, next));
router.post('/', (req, res, next) => userController.createUser(req, res, next));
router.delete('/:id', (req, res, next) => userController.deleteUser(req, res, next));

export default router;
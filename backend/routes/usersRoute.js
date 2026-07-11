import express from 'express';
import { jwtMiddleware } from '../middlewares/jwt.js';
import { searchUsers } from '../controllers/usersController.js';

const router = express.Router();

router.get('/search', jwtMiddleware, searchUsers);

export default router;

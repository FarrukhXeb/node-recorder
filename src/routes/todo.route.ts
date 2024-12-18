import {
  handleCreateTodo,
  handleGetAllUserTodos,
  handleUpdateTodo,
} from '@/controllers/todo.controller';
import passport from '@/middlewares/passport.middleware';
import { Router } from 'express';

const router = Router();

router.get('/', passport.authenticate('jwt', { session: false }), handleGetAllUserTodos);

router.post('/', passport.authenticate('jwt', { session: false }), handleCreateTodo);

router.put('/:id', passport.authenticate('jwt', { session: false }), handleUpdateTodo);

export default router;

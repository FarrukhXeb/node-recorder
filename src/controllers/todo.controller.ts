import logger from '@/lib/logger';
import User from '@/models/user.model';
import { createTodo, deleteTodo, getAllUserTodos, updateTodo } from '@/services/todo.service';
import { NextFunction, Request, Response } from 'express';

export const handleGetAllUserTodos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const todos = await getAllUserTodos(user.id);
    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

export const handleCreateTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const todo = req.body;
    logger.debug(todo);
    todo.userId = user.id;
    const newTodo = await createTodo(todo);
    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
};

export const handleDeleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const deleted = await deleteTodo(id);
    res.status(200).json(deleted);
  } catch (error) {
    next(error);
  }
};

export const handleUpdateTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    const todo = req.body;
    const updatedTodo = await updateTodo(id, todo);
    res.status(200).json(updatedTodo);
  } catch (error) {
    next(error);
  }
};

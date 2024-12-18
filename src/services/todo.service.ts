import Todo from '@/models/todo.model';

export const getTodoById = async (id: string): Promise<Todo | null> => {
  const todo = await Todo.findOne({
    where: { id },
    attributes: {
      exclude: ['userId', 'user_id', 'createdAt', 'updatedAt'],
    },
  });
  return todo;
};

export const getAllUserTodos = async (userId: string): Promise<Todo[]> => {
  const todos = await Todo.findAll({
    where: { userId },
    attributes: {
      exclude: ['userId', 'user_id', 'createdAt', 'updatedAt'],
    },
  });
  return todos;
};

export const createTodo = async (todo: Todo): Promise<Todo> => {
  const newTodo = await Todo.create(todo);
  return newTodo;
};

export const deleteTodo = async (id: string): Promise<number> => {
  const deleted = await Todo.destroy({ where: { id } });
  return deleted;
};

export const updateTodo = async (id: string, todo: Todo): Promise<Todo> => {
  await Todo.update(todo, { where: { id } });
  return getTodoById(id) as Promise<Todo>;
};

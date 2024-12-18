import 'dotenv/config';
import { createServer } from 'http';

import app from '@/app';
import SocketIOService from '@/lib/socket';
import logger from '@/lib/logger';
import Todo from './models/todo.model';
import User from './models/user.model';

const server = createServer(app);

const PORT = process.env.PORT || 3001;

SocketIOService.getInstance(server);

server.listen(PORT, () => {
  User.associate();
  Todo.associate();
  logger.info(`Server is running on http://localhost:${PORT}`);
});

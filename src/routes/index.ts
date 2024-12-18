import { Router } from 'express';

import AuthRouter from './auth.route';
import TodoRouter from './todo.route';

const router = Router();

const routes = [
  {
    router: AuthRouter,
    prefix: '/auth',
  },
  {
    router: TodoRouter,
    prefix: '/todos',
  },
];

routes.forEach((route) => {
  router.use(route.prefix, route.router);
});

export default router;

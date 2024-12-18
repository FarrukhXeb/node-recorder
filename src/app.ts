import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from './routes';
import errorHandler from './middlewares/error.middleware';
import passport from '@/middlewares/passport.middleware';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.use(express.json());

app.use(passport.initialize());

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

app.use(errorHandler);

export default app;

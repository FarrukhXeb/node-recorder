import { Router } from 'express';
import {
  handleLogin,
  handleMe,
  handleRefreshToken,
  handleRegister,
} from '@/controllers/auth.controller';
import passport from '@/middlewares/passport.middleware';

const router = Router();

router.post('/login', handleLogin);

router.post('/register', handleRegister);

router.post('/refresh', passport.authenticate('refresh', { session: false }), handleRefreshToken);

router.get('/me', passport.authenticate('jwt', { session: false }), handleMe);

export default router;

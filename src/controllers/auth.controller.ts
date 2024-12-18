import { NextFunction, Request, Response } from 'express';
import { createUser, findUserByEmail } from '@/services/user.service';
import {
  generateAccessToken,
  generateAccessTokenFromRefreshToken,
  generateRefreshToken,
} from '@/services/token.service';

export const handleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await findUserByEmail(req.body.email);

    if (!user) return res.status(401).json({ error: 'Email incorrect' });

    const isPasswordMatch = await user.comparePassword(req.body.password);

    if (!isPasswordMatch) return res.status(401).json({ error: 'Password provided is incorrect' });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const handleRegister = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await createUser(req.body);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) return res.status(401).json({ error: 'Refresh token is required' });

    const accessToken = generateAccessTokenFromRefreshToken(refreshToken);

    res.status(200).json({ accessToken });
  } catch (error) {
    next(error);
  }
};

export const handleMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    next(error);
  }
};

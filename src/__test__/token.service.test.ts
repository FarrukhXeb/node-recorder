import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateAccessTokenFromRefreshToken,
  generateRefreshToken,
} from '@/services/token.service';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('Token Service', () => {
  describe('generateAccessToken', () => {
    it('should create a new access token', () => {
      const userId = '1';
      const token = 'token';
      const secret = 'secret';
      const expiresIn = '15m';

      (jwt.sign as jest.Mock).mockReturnValue(token);

      const accessToken = generateAccessToken(userId);

      expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, secret, { expiresIn });
      expect(accessToken).toBe(token);
    });

    it('should throw an error if token creation fails', () => {
      const userId = '1';

      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new Error('Token creation failed');
      });

      expect(() => generateAccessToken(userId)).toThrow('Token creation failed');
    });
  });

  describe('generateRefershToken', () => {
    it('should create a new refresh token', () => {
      const userId = '1';
      const token = 'token';
      const secret = 'another_secret';

      (jwt.sign as jest.Mock).mockReturnValue(token);

      const refreshToken = generateRefreshToken(userId);

      expect(jwt.sign).toHaveBeenCalledWith({ id: userId }, secret, { expiresIn: '7d' });
      expect(refreshToken).toBe(token);
    });

    it('should throw an error if refresh token creation fails', () => {
      const userId = '1';

      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw new Error('Refresh token creation failed');
      });

      expect(() => generateRefreshToken(userId)).toThrow('Refresh token creation failed');
    });
  });

  describe('generateAccessTokenFromRefreshToken', () => {
    it('should create a new access token from refresh token', () => {
      const refreshToken = 'refreshToken';
      const accessToken = 'accessToken';

      (jwt.verify as jest.Mock).mockReturnValue({ sub: '1' });

      (jwt.sign as jest.Mock).mockReturnValue(accessToken);

      const newAccessToken = generateAccessTokenFromRefreshToken(refreshToken);

      expect(jwt.verify).toHaveBeenCalledWith(refreshToken, 'another_secret');
      expect(newAccessToken).toBe(accessToken);
    });

    it('should create a new token if refresh token verification fails', () => {
      const refreshToken = 'refreshToken';

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Token verification failed');
      });

      expect(() => generateAccessTokenFromRefreshToken(refreshToken)).toThrow(
        'Token verification failed'
      );
    });
  });
});

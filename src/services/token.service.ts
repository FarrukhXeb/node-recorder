import jwt from 'jsonwebtoken';

const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'another_secret', {
    expiresIn: '7d',
  });
};

const generateAccessTokenFromRefreshToken = (refreshToken: string) => {
  const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'another_secret');
  return generateAccessToken(payload.sub as string);
};

export { generateAccessToken, generateRefreshToken, generateAccessTokenFromRefreshToken };

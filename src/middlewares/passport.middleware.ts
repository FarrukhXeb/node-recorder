import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptionsWithoutRequest } from 'passport-jwt';
import User from '@/models/user.model';
import dotenv from 'dotenv';

dotenv.config();

const options: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || 'secret',
};

const refreshOptions: StrategyOptionsWithoutRequest = {
  jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
  secretOrKey: process.env.JWT_REFRESH_SECRET || 'another_secret',
};

passport.use(
  new JwtStrategy(options, async (jwt_payload, done) => {
    try {
      const user = await User.findByPk(jwt_payload.id, {
        attributes: {
          exclude: ['password'],
        },
      });
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  'refresh',
  new JwtStrategy(refreshOptions, async (jwt_payload, done) => {
    try {
      const user = await User.findByPk(jwt_payload.id, {
        attributes: {
          exclude: ['password'],
        },
      });
      if (user) {
        return done(null, user);
      }
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  })
);

export default passport;

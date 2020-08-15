import RateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import createRedisClient from '../../redis';
import Logger from '../../logger';

const redisClient = createRedisClient('For IP Based Rate Limiting');
const store = new RedisStore({
  client: redisClient,
  prefix: 'rate-limiter',
});

export const ipBasedLimiter = RateLimit({
  store,
  windowMs: 10 * 1000, // for every 10 seconds
  max: 50, // for every 10 second maximum 50 request is allowed
  message: "We are currently receiving unusual traffic from this IP address, please try again after some time",
  keyGenerator: (req) => {
    return req.ip;
  },
  handler: (req, res, next) => {
    // TODO Send email to notify administrator about this

    const err = new Error('Unusual traffic detected from an IP address');
    err.status = 429;
    err.customMsg = 'Too many requests, please try again later';
    Logger.warn('Unusual traffic detected from IP address', req.ip);
    return next(err);
  },
});

export const userIdBasedLimiter = RateLimit({
  store,
  windowMs: 10 * 1000, // for every 10 second
  max: 50, // for every 10 second maximum 50 request is allowed
  message: "We are currently receiving unusual traffic from your user account, please try again after some time",
  keyGenerator: (req) => {
    if (!req.user) {
      return req.ip;
    }

    return req.user._id.toString();
  },
  handler: (req, res, next) => {
    // TODO Send email to notify administrator about this

    let key;
    if (!req.user) {
      key = req.ip;
    } else {
      key = req.user._id.toString();
    }

    const err = new Error('Unusual traffic detected from a User account');
    err.status = 429;
    err.customMsg = 'Too many requests, please try again later';
    Logger.warn('Unusual traffic detected from User account', key);
    return next(err);
  },
});


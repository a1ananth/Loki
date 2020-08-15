import redis from 'redis';
import cfg from './cfg';
import Logger from './logger';

const createRedisClient = (name) => {
  Logger.debug(`Initializing Redis Client: ${name}`);

  return redis.createClient({
    host: cfg.redis.host,
    port: cfg.redis.port,
    password: cfg.redis.password ? cfg.redis.password : undefined,
    retry_strategy: function (options) {
      if (options.error && options.error.code === 'ECONNREFUSED') {
        Logger.error('ECONNREFUSED at Redis server', options.error);
        return process.exit(101);
      }

      if (options.total_retry_time > 1000 * 60 * 60) {
        Logger.error('Total retry time exceeded for Redis server', options.total_retry_time);
        return process.exit(104);
      }

      if (options.attempt > 10) {
        Logger.error('Retried more than 10 times and failed to connect to Redis server', options);
        return process.exit(105);
      }

      return Math.min(options.attempt * 100, 3000);
    }
  });
};

export default createRedisClient;

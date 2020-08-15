import bunyan from 'bunyan';
import cfg from './cfg';
import * as appdata from './package.json';

let streams;

if (cfg.env === 'development') {
  streams = [{
    level: 'debug',
    stream: process.stdout,
  }];
} else if (cfg.env === 'staging') {
  streams = [{
    level: 'debug',
    stream: process.stdout,
  }];
} else {
  streams = [{
    level: 'debug',
    stream: process.stdout,
  }];
}

const Logger = bunyan.createLogger({
  name: appdata.name,

  streams,
  serializers: bunyan.stdSerializers,
});

export default Logger;

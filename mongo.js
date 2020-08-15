import mongoose from 'mongoose';
import cfg from './cfg';
import Logger from './logger';

export let myMongoDatabase = null;

mongoose.set('useCreateIndex', true);

const connect1 = () => {
  myMongoDatabase = mongoose.createConnection(cfg.mongo.uri, {
    useUnifiedTopology: true,
    autoReconnect: false,
    useNewUrlParser: true
  });

  myMongoDatabase.on('connecting', function () {
    Logger.debug('Connecting to Mongo DB instance');
  });

  myMongoDatabase.on('error', (err) => {
    Logger.error('Failed to establish MongoDB connection', err);
    myMongoDatabase.close();
  });

  myMongoDatabase.on('connected', function () {

  });

  myMongoDatabase.once('open', function () {
    Logger.info('MongoDB connection established successfully');
  });

  myMongoDatabase.on('disconnected', function () {
    Logger.error('Lost connection with Mongo DB instance');

    // Big Error Case: TODO Notify admin
    // Mongo seems to be down

    setTimeout(() => {
      connect1();
    }, cfg.mongo.reconnect_time);
  });
};

connect1();

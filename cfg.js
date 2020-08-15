/*
 global process
 */

/* eslint-disable import/no-dynamic-require */

import path from 'path';
import * as pkg from './package.json';

const env = process.env.NODE_ENV || 'development';
const port = process.env.WEB_API_PORT || 9192;

const cfg = {
  activity_update_time: 3 * 60, // 3 minutes

  app_name: pkg.name,

  app_title: 'Loki',

  app_version: pkg.version,

  cache: {
    enabled: (env !== 'development'),
  },

  'cors.whitelist': [
  ],

  env,

  formats: {
    in: {
      date: 'YYYY-MM-DD',
      time: 'HH:mm:ss',
      datetime: 'YYYY-MM-DD HH:mm:ss',
    },

    out: {
      date: 'YYYY-MM-DD',
      time: 'HH:mm:ss',
      datetime: 'YYYY-MM-DD HH:mm:ss',
    },
  },

  mongo: {
    uri: process.env.MONGO_URI,
    reconnect_time: 2 * 1000,
  },

  paging: {
    defaultLimit: 10,
    maxLimit: 800,
  },

  paths: {
    base: path.join(__dirname, '/'),
    extension: path.join(__dirname, '/extension'),
    logs: path.join(__dirname, '/logs'),
    static: path.join(__dirname, '/static'),
    separator: '/',
  },

  // Which port will this application run on
  port,

  redis: {
    cacheTime: 30 * 24 * 60 * 60, // 30 days

    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD ? process.env.REDIS_PASSWORD : null,
  },

  search: {
    defaultSearchEngineUrl: 'https://duckduckgo.com/?q=%s',
  },

  // path where temporary uploaded files are stored
  uploads: {
    allowed_image_types: ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/gif'],
    allowed_audio_types: ['audio/mp3'],
    allowed_video_types: ['video/mp4'],
    allowed_document_types: ['.doc', '.docx', '.pdf', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.csv'],

    path: path.join(__dirname, '/uploads/'),

    max_size: 100 * 1024 * 1024,  // 100 MB overall max size

    max_sizes: {
      photo: 10 * 1024 * 1024,  // 10 MB,
      video: 100 * 1024 * 1024,  // 100 MB,
      audio: 5 * 1024 * 1024,  // 5 MB,
      document: 10 * 1024 * 1024,  // 10 MB,
    },

    tmp_path: path.join(__dirname, '/tmp/'),
  },
};

export default cfg;

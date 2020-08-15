"use strict";

const backendApiPath = '/var/www/loki-api';

const backendApiScript = `${backendApiPath}/server.js`;

const node = "node";

const backendApi = {
  name: "loki-api",
  script: backendApiScript,
  cwd: backendApiPath,
  watch: false,
  exec_mode: "fork_mode",
  interpreter: node,
  error_file: `${backendApiPath}/logs/loki-api-stderr.log`,
  out_file: `${backendApiPath}/logs/loki-api-stdout.log`,
  merge_logs: true,
  autorestart: true,
  restart_delay: 3000,
  instances: 1,
  min_uptime: "2m",
  max_restarts: 1e9,
};

module.exports = {
  apps: [
    backendApi,
  ],
};

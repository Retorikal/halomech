/*
 * "Run-all" script
 */

const cp = require('child_process');
const readline = require('readline');

const aedesServer = cp.fork('./aedes_server.js');
const dbLogger = cp.fork('./db_logger.js');
const rest_api = cp.fork('./rest_api.js');
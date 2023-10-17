import express from 'express';
import http from 'http';
import { downloadPageRouter } from '..';
import { PORT } from '../config';

const app = express();
const httpServer = http.createServer(app);
const port = PORT || 3000;

app.use('/', downloadPageRouter());

/*
  Starting the listener
 */
httpServer.listen(port, () => {
  console.log('listening on *:' + port);
});

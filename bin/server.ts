import app from '../app';
import { PORT } from '../config';
import http from 'http';

const httpServer = http.createServer(app);
const port = PORT || 3000;

/*
  Starting the listener
 */
httpServer.listen(port, () => {
  console.log('listening on *:' + port);
});

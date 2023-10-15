const app = require('../app.js');
const { PORT } = require('../config/index.js');
const http = require('http');

const httpServer = http.createServer(app);
const port = PORT || 3000;

/*
  Starting the listener
 */
httpServer.listen(port, () => {
  console.log('listening on *:' + port);
});
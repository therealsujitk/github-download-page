var app = require('../app.js');
var { PORT } = require('../config/index.js');
var http = require('http');

var httpServer = http.createServer(app);
var port = PORT || 3000;

/*
  Starting the listener
 */
httpServer.listen(port, () => {
  console.log('listening on *:' + port);
});

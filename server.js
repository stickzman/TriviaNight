const express = require('express');
const app = express();
var ExpressPeerServer = require('peer').ExpressPeerServer;
const port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/app"));

var server = app.listen(port, () => console.log(`Listening on port ${port}!`));

var peerServer = ExpressPeerServer(server, {debug: true});

app.use('/api', peerServer);

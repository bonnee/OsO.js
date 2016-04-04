process.stdout.write("Starting server...");

var sockPort = 10611;

var db = require('mongoose');
var sv = new require('./socket.js').server
var server = new sv(sockPort);

db.connect('mongodb://192.168.1.4/oso');

server.on('connection', function(ws) {
  var address = ws._socket.remoteAddress + ':' + ws._socket.remotePort;
console.log('Connection from: ' + address);

  ws.on('message', function(message) {
    message = JSON.parse(message);

    if (message.id == 'hello') {
      console.log('Device is: ' + message.data);
    } else {
      console.log(address + ': ' + message.data);
    }
  });

  ws.on('close', function close() {
    console.log(address + ' has disconnected.');
  });

  function send(connection, data, id) {
    var pkt = {
      'id': id,
      'data': data
    }
    connection.send(JSON.stringify(pkt));
  }
});


/*

this.server = function (port) {
    ev.call(this);

    var wss = new ws.Server({
        port: port
    });

    wss.broadcast = function (data) {
        for (var i in this.clients)
            send(this.clients[i], data, 'upd');
    }

    wss.on('connection', function (ws) {
        console.log('conn');
        this.emit('conn', ws);

        ws.on('message', function (data) {
            console.log('data');
            this.emit('data', data);
        });
    });
}*/

console.log('started.');
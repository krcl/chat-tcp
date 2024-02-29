const net = require('net');

/**
 * Create a TCP server that listens on a specific port and host.
 * Message Protocol:
 * - Text - { type: "text", data: "Hello, World!" }
 * - Binary - { type: "binary", data: <Buffer 00 01 02 03> }
 * Investigate: 
 * - BSON (https://www.npmjs.com/package/bson).
 * - Serialization (concept).
 * - Deserialization (concept).
 * - JSON (https://en.wikipedia.org/wiki/JSON).
 * - Buffer (https://nodejs.org/api/buffer.html).
 * - How to implement commands, like the "time" example command.
 */

const availableCommands = `
Available commands:
- /name <name> - Set the client name.
- /time - Get the current server time.
- /exit or /quit - Close the connection.
`;

const clients = [];

// Create a TCP server
const server = net.createServer((socket) => {
  console.log('Client connected');
  // Event handler for data reception
  socket.on('data', (data) => {
    const message = data.toString().trim();
    if ( message.startsWith('/name') ) {
      socket.__name = message.split(' ')[1];
      socket.write(`Client name set to: ${socket.__name}`);
      clients.push(socket);
    }
    if( message === '/time') {
      // Echo back the current time
      socket.write(`Server time: ${new Date().toISOString()}`);
    }
    else if( message === '/exit' || message === '/quit') {
      // Close the connection
      socket.end();
    }
    else {
      // Broadcast the message to all connected clients
      clients.forEach(client => {
        // if(client !== socket) {
          client.write(`${socket.__name}: ${message}`);
        // }
      });
    }
  });

  // Event handler for client disconnection
  socket.on('end', () => {
    console.log('Client disconnected');
  });

  // Event handler for errors
  socket.on('error', (err) => {
    console.error('Socket error:', err);
  });
});

// Start listening on a specific port and host
const PORT = process.env.PORT || 3300;
const HOST = '0.0.0.0';
server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});

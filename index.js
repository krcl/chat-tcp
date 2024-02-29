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


// Create a TCP server
const server = net.createServer((socket) => {
  console.log('Client connected');

  // Event handler for data reception
  socket.on('data', (data) => {
    console.log(`Received data from client: ${data}`);
    console.log("DATA: ", `-${data.toString().trim()}-`);
    if(data.toString().trim() === 'time') {
      // Echo back the current time
      socket.write(`Server time: ${new Date().toISOString()}`);
    }
    else if(data.toString() === 'exit' || data.toString() === 'quit') {
      // Close the connection
      socket.end();
    }
    else {
      // Echo back the received data
      socket.write(`Server received: ${data}`);
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

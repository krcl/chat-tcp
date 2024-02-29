const net = require('net');

// Define ports
const LOCAL_PORT = process.env.PORT || 3000;
const REMOTE_PORT = process.env.REMOTE_PORT || 3300;
const REMOTE_HOST = 'localhost'; // Change this if your remote host is different

// Create server that listens for connections on LOCAL_PORT
net.createServer((localSocket) => {
  // Connect to the remote server
  const remoteSocket = net.createConnection(REMOTE_PORT, REMOTE_HOST, () => {
    // When connected, pipe data between local and remote sockets bidirectionally
    localSocket.pipe(remoteSocket);
    remoteSocket.pipe(localSocket);
  });

  // Event handler for errors on the remote connection
  remoteSocket.on('error', (err) => {
    console.error('Remote socket error:', err);
  });

  // Event handler for errors on the local connection
  localSocket.on('error', (err) => {
    console.error('Local socket error:', err);
  });
}).listen(LOCAL_PORT, () => {
  console.log(`Proxy server listening on port ${LOCAL_PORT}, proxying to ${REMOTE_HOST}:${REMOTE_PORT}`);
});

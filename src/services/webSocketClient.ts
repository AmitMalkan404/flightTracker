import WebSocket from 'ws';

const socket = new WebSocket('ws://localhost:5555');

socket.addEventListener('open', () => {
  console.log('Connected to WebSocket server');
});

socket.addEventListener('message', (event: any) => {
  const message = event.data;
  console.log(`Received message: ${message}`);
  // Handle the received message as needed
});

socket.addEventListener('close', () => {
  console.log('Disconnected from WebSocket server');
});

export default socket;
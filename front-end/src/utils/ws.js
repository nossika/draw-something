import io from 'socket.io-client';

const socket = io('ws://localhost:7777');

export default socket;
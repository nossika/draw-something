import io from 'socket.io-client';
import { env } from '../config';

const socket = env === 'develop' ? io('//localhost:7777') : io('//nossika.com', {
    path: '/io/socket.io'
});

export default socket;
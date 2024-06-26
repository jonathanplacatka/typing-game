import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import fetchRandomPoetry from './fetchdata';
import Player from './player';

const PORT = 4000;
const CURRENT_ROOM = "1234"; 

const httpServer = createServer();

const io = new SocketServer(httpServer, {
  cors: {
    origin: "http://localhost:3000", //the address of our web server. should setup env files for this
    methods: ["GET"]
  }
});

httpServer.listen(PORT, () => console.log(`Game Server listening on port ${PORT}`));

let players = new Map(); 
let gameText = ''
fetchRandomPoetry().then((text) => { 
  gameText = text;
});

let gameStarted = false;

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  if(gameStarted) { 
    socket.emit('joinRoom', false);
  } else {
    socket.join(CURRENT_ROOM);
    players.set(socket.id, new Player());
    socket.emit('joinRoom', true);
    emitAllPlayers();
  }

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    players.delete(socket.id);
    emitAllPlayers();
  });

  socket.on('startGame', () => {
    io.to(CURRENT_ROOM).emit('startGame', gameText);
    gameStarted = true;
  })

  socket.on('playerStateUpdate', (id, score, wpm) => {
    players.get(id).update(score, wpm);
    io.to(CURRENT_ROOM).emit('playerStateUpdate', id, score, wpm);
  });

});

function emitAllPlayers() {
  io.to(CURRENT_ROOM).emit('allPlayers', Object.fromEntries(players));
}

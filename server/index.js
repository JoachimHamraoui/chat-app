const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors')

app.use(cors());
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
})

const rooms = [];

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("send_message", (data) => {
      socket.to(data.room).emit("receive_message", data)
  })

  socket.on('join_room', (data) => {
    socket.join(data.room);

    if (!rooms[data.room]) {
      rooms[data.room] = [];
    }
    rooms[data.room].push(data.username);

    io.to(data.room).emit('users_in_room', rooms[data.room]);
    io.emit('existing_rooms', Object.keys(rooms));
  });

  socket.on('leave_room', (data) => {
    socket.leave(data.room);

    if (rooms[data.room]) {
      const index = rooms[data.room].indexOf(data.username);
      if (index !== -1) {
        rooms[data.room].splice(index, 1);
        io.to(data.room).emit('users_in_room', rooms[data.room]);
        if (rooms[data.room].length === 0) {
          delete rooms[data.room]; // Delete the room if there are no users left
          io.emit('existing_rooms', Object.keys(rooms));
        }
      }
    }
  });

  socket.on('disconnect', () => {
    for (const room in rooms) {
      const index = rooms[room].indexOf(socket.username);
      if (index !== -1) {
        rooms[room].splice(index, 1);
        io.to(room).emit('users_in_room', rooms[room]);
        if (rooms[room].length === 0) {
          delete rooms[room]; // Delete the room if there are no users left
          io.emit('existing_rooms', Object.keys(rooms));
        }
      }
    }
  });

  socket.on('get_rooms', () => {
    socket.emit('existing_rooms', Object.keys(rooms));
  });
})

server.listen(3001, () => {
    console.log('SERVER IS RUNNING')
})
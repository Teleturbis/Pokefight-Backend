import { Server } from 'socket.io';

export default class MySocketServer {
  constructor(server) {
    this.io = new Server(server, { cors: { origin: '*' } });

    this.io.on('connection', (socket) => {
      console.log('a user connected', socket.id);
      socket.on('disconnect', () => {
        console.log('user disconnected', socket.id);
      });

      socket.on('msg-event', (msg, room) => {
        console.log('room', room);
        // this.io.volatile.emit('msg-received', msg); // volatile >> ignores disconnects, normal emit sends all stacked msgs while disconnected
        if (!room) this.io.emit('msg-received', msg);
        else this.io.to(room).emit('msg-received', msg);
      });

      socket.on('action-event', (action, room) => {
        console.log('room', room);
        // this.io.volatile.emit('action-received', action); // volatile >> ignores disconnects, normal emit sends all stacked actions while disconnected
        if (!room) this.io.emit('action-received', action);
        else this.io.to(room).emit('action-received', action);
      });

      socket.on('join-room', (room, cb) => {
        console.log('room', room);
        if (room) {
          socket.join(room);
          if (cb) cb('joined room: ' + room);
        }
      });

      socket.on('leave-room', (room, cb) => {
        console.log('room', room);
        if (room) {
          socket.leave(room);
          if (cb) cb('left room: ' + room);
        }
      });
    });
  }

  testSend(msg) {
    this.io.emit('msg-received', msg);
  }
}

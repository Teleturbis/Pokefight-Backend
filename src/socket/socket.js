import { Server } from 'socket.io';

export default class PokeSocketServer {
  constructor(server) {
    this.actionQueue = [];
    this.ticInterval = 1000;

    this.countActions = 0;
    this.countProcessed = 0;

    this.io = new Server(server, { cors: { origin: '*' } });

    this.interval = this.initActionTics();

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
        this.countActions++;
        this.actionQueue.push(action);
        // if (!room) this.io.emit('action-received', action);
        // else this.io.to(room).emit('action-received', action);
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

  setTicInterval(time) {
    this.ticInterval = time;
    this.interval = this.initActionTics();
    console.log('actionsForTics -> countProcessed', this.countProcessed);
    console.log('actionsForTics -> countActions', this.countActions);
  }

  initActionTics() {
    clearInterval(this.interval);
    const interval = setInterval(() => {
      // console.log('tic... ' + this.ticInterval);
      if (this.actionQueue.length > 0) {
        const actionsForTic = [...this.actionQueue];
        this.actionQueue.length = 0;

        this.countProcessed += actionsForTic.length;
        // console.log('actionsForTics -> countProcessed', this.countProcessed);
        // console.log('actionsForTics -> countActions', this.countActions);

        this.io.emit('action-received', actionsForTic);
      }
    }, this.ticInterval); // todo testing

    return interval;
  }

  testSend(msg) {
    this.io.emit('msg-received', msg);
  }
}

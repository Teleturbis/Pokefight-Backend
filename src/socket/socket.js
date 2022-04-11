import { Server } from 'socket.io';
import userService from '../service/user';

export default class PokeSocketServer {
  constructor(server) {
    this.actionQueue = [];
    this.ticInterval = 1000;

    this.countActions = 0;
    this.countProcessed = 0;

    this.io = new Server(server, { cors: { origin: '*' } });

    this.interval = this.initActionTics();

    this.io.use((socket, next) => {
      if (socket.handshake.auth.userId) {
        socket.userId = socket.handshake.auth.userId;
        socket.username = socket.handshake.auth.username;
        next();
      } else {
        // next();
        next(new Error('Authentication error')); // todo
      }
      // console.log('socket.handshake.query', socket.handshake.query);
    });

    this.io.on('connection', (socket) => {
      console.log(
        `user connected >> socket: ${socket.id} - userId: ${socket.userId}`
      );

      // set user in db online
      userService
        .setOnOffline(socket.userId, true)
        .then()
        .catch((error) => null /*console.log(error)*/);

      socket.join(socket.userId); // fuer whispers

      // emit all that new user online -> they should tell YOU their position to update the map with all online users
      socket.broadcast.emit('connect-received', socket.id);

      socket.on('disconnect', () => {
        console.log(
          `user disconnected >> socket: ${socket.id} - userId: ${socket.userId}`
        );

        // for friendslist and game -> emit disconnect
        this.io.emit('disconnect-received', socket.id);

        // set user in db offline
        if (socket.userId) {
          userService
            .setOnOffline(socket.userId, false)
            .then()
            .catch((error) => null /*console.log(error)*/);
        }
      });

      socket.on('msg-event', (msg, room) => {
        if (room) console.log('room', room);
        console.log('userId', socket.userId);

        const createMsg = (msg) => {
          return {
            msg: msg,
            user: {
              id: socket.userId,
              name: socket.username,
              socket: socket.id,
            },
          };
        };
        this.logSockets();

        // this.io.volatile.emit('msg-received', msg); // volatile >> ignores disconnects, normal emit sends all stacked msgs while disconnected
        if (!room) this.io.emit('msg-received', createMsg(msg));
        else this.io.to(room).emit('msg-received', createMsg(msg));
      });

      socket.on('action-event', (action, room) => {
        console.log('room', room);
        // this.io.volatile.emit('action-received', action); // volatile >> ignores disconnects, normal emit sends all stacked actions while disconnected
        this.countActions++;
        this.actionQueue.push(action);
      });

      socket.on('battle-event', (move, room) => {
        console.log('to socket-id', room);
        if (room) this.io.to(room).emit('battle-received', move);
      });

      socket.on('battle-request-event', async (fromUser, toUser) => {
        const toSocket = await this.getSocketofUser(toUser.id);

        if (toSocket)
          this.io.to(toSocket).emit('battle-request-received', {
            name: fromUser.name,
            id: fromUser.id,
          });
      });

      socket.on('battle-accept-event', async (user, battle) => {
        const toSocket = await this.getSocketofUser(battle.id);

        if (toSocket)
          this.io.to(toSocket).emit('battle-accept-received', {
            name: user.name,
            id: user.id,
          });
      });

      socket.on('battle-reject-event', async (user, battle) => {
        const toSocket = await this.getSocketofUser(battle.id);

        if (toSocket)
          this.io.to(toSocket).emit('battle-reject-received', {
            name: user.name,
            id: user.id,
          });
      });

      socket.on('friend-request-event', async (fromUser, toUser) => {
        this.logSockets();
        const toSocket = await this.getSocketofUser(toUser.id);

        if (toSocket)
          this.io.to(toSocket).emit('friend-request-received', {
            name: fromUser.name,
            id: fromUser.id,
          });

        // todo save friend request in db (pending)
        userService
          .friendRequest(fromUser.id, toUser.id)
          .then()
          .catch((error) => null /*console.log(error)*/);
      });

      socket.on('friend-accept-event', async (user, friend) => {
        const toSocket = await this.getSocketofUser(friend.id);

        if (toSocket)
          this.io.to(toSocket).emit('friend-accept-received', {
            name: user.name,
            id: user.id,
          });

        // todo save friend relationship in both users
        userService
          .friendAccepted(user.id, friend.id)
          .then()
          .catch((error) => null /*console.log(error)*/);
      });

      socket.on('friend-reject-event', async (user, friend) => {
        const toSocket = await this.getSocketofUser(friend.id);

        if (toSocket)
          this.io.to(toSocket).emit('friend-reject-received', {
            name: user.name,
            id: user.id,
          });

        // todo save friend relationship in both users
        userService
          .friendRejected(user.id, friend.id)
          .then()
          .catch((error) => null /*console.log(error)*/);
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

  async getSocketofUser(userId) {
    const sockets = await this.io.fetchSockets();
    return sockets.find((socket) => socket.userId === userId)?.id;
  }

  async logSockets() {
    const sockets = await this.io.fetchSockets();
    sockets.forEach((socket) => console.log('socket', socket.id));
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

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

    this.io.on('connection', async (socket) => {
      console.log(
        `user connected >> socket: ${socket.id} - userId: ${socket.userId}`
      );

      // this.countActions++;
      // this.actionQueue.push({
      //   id: socket.userId,
      //   action: 'join',
      // });

      // set user in db online
      userService
        .setOnOffline(socket.userId, true)
        .then()
        .catch((error) => null /*console.log(error)*/);

      // ! auto join in userId-room
      socket.join(socket.userId); // for whispers or direct messages (multi-tab-able)

      // emit all that new user online -> they should tell YOU their position to update the map with all online users
      this.io.emit(
        'connect-received',
        socket.userId,
        await this.createSocketList()
      );

      socket.on('disconnect', () => this.disconnect(socket));

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

      socket.on('action-gamestate-event', (gamestate, room) => {
        console.log('room', room);
        if (room) this.io.to(room).emit('action-gamestate-received', gamestate);
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
        this.io.to(toUser.id).emit('battle-request-received', {
          name: fromUser.name,
          id: fromUser.id,
        });
      });

      socket.on('battle-accept-event', async (user, battle) => {
        this.io.to(battle.id).emit('battle-accept-received', {
          name: user.name,
          id: user.id,
        });
      });

      socket.on('battle-reject-event', async (user, battle) => {
        this.io.to(battle.id).emit('battle-reject-received', {
          name: user.name,
          id: user.id,
        });
      });

      socket.on('friend-request-event', async (fromUser, toUser) => {
        this.logSockets();

        // todo save friend request in db (pending)
        await userService.friendRequest(fromUser.id, toUser.id);
        // .then()
        // .catch((error) => null /*console.log(error)*/);

        this.io.to(toUser.id).emit(
          'friend-request-received',
          {
            name: fromUser.name,
            id: fromUser.id,
          },
          await this.createSocketList()
        );
      });

      socket.on('friend-accept-event', async (user, friend) => {
        // todo save friend relationship in both users
        await userService.friendAccepted(user.id, friend.id);
        // .then()
        // .catch((error) => null /*console.log(error)*/);

        this.io.to(friend.id).emit(
          'friend-accept-received',
          {
            name: user.name,
            id: user.id,
          },
          await this.createSocketList()
        );
        // sich selbst auch informieren, um die Friendslist zu aktualisieren
        socket.emit(
          'friend-accept-received',
          user,
          await this.createSocketList()
        );
      });

      socket.on('friend-reject-event', async (user, friend) => {
        console.log(user, friend);
        await userService.friendRejected(user.id, friend.id);
        // .then()
        // .catch((error) => null /*console.log(error)*/);

        this.io.to(friend.id).emit(
          'friend-reject-received',
          {
            name: user.name,
            id: user.id,
          },
          await this.createSocketList()
        );
        // sich selbst auch informieren, um die Friendslist zu aktualisieren
        socket.emit(
          'friend-reject-received',
          user,
          await this.createSocketList()
        );
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

  async disconnect(socket, toUser) {
    console.log(
      `user disconnected >> socket: ${socket.id} - userId: ${socket.userId}`
    );

    this.countActions++;
    this.actionQueue.push({
      id: socket.userId,
      action: 'leave',
    });

    // for friendslist and game -> emit disconnect
    this.io.emit(
      'disconnect-received',
      socket.id,
      await this.createSocketList()
    );

    // set user in db offline if no socket with userid is connected
    if (socket.userId) {
      const toSockets = await this.getSocketsofUser(socket.userId);
      if (!toSockets || toSockets.length === 0) {
        console.log('disconnecting user -> setoffline!');
        userService
          .setOnOffline(socket.userId, false)
          .then()
          .catch((error) => null /*console.log(error)*/);
      }
    }
  }

  async getSocketsofUser(userId) {
    const sockets = await this.io.fetchSockets();
    return sockets.filter((socket) => socket.userId === userId);
  }

  async logSockets() {
    const sockets = await this.io.fetchSockets();
    sockets.forEach((socket) => console.log('socket', socket.id));
  }

  async createSocketList() {
    const sockets = await this.io.fetchSockets();
    const names = sockets.map((socket) => socket.username);

    const list = sockets
      .filter(({ username }, index) => !names.includes(username, index + 1)) // remove duplicates
      .map((socket) => {
        return {
          // socket: socket.id,
          userId: socket.userId,
          username: socket.username,
        };
      })
      .sort((a, b) => a.username.localeCompare(b.username));

    console.log('list', list);

    return list;
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

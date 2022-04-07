import { NotFoundError } from '../js/httpError';
import path from 'path';
import * as sim from '../js/simulate';

class AdminController {
  constructor() {
    this.socketServer = 'test';
  }

  showPage(req, res, next) {
    try {
      return res.status(200).sendFile(path.resolve('public/admin.html'));
    } catch (error) {
      next(error);
    }
  }

  startSimulation(req, res, next) {
    try {
      console.log('startSimulation');
      // const id = await adminService.createAdmin(req.body);
      // if (!id) throw new Error('Error createAdmin');
      // console.log('startSimulation', req.io);
      // sendMessages(req.pokeSocketServer.io);
      sendActions(req.pokeSocketServer);

      return res.status(200).json('Simulation started');
    } catch (error) {
      next(error);
    }
  }

  stopSimulation(req, res, next) {
    try {
      console.log('stopSimulation');
      clearInterval(interval);
      clearInterval(intervalActions);
      sim.reset();

      return res.status(200).json('Simulation stopped');
    } catch (error) {
      next(error);
    }
  }

  setTicInterval(req, res, next) {
    try {
      req.pokeSocketServer.setTicInterval(req.params.time);

      return res.status(200).json('setTicInterval successful!');
    } catch (error) {
      next(error);
    }
  }

  setSimInterval(req, res, next) {
    try {
      intervalTimeActions = req.params.time;
      console.log('intervalTimeActions', intervalTimeActions);
      clearInterval(interval);
      clearInterval(intervalActions);
      sendActions(req.pokeSocketServer);

      return res.status(200).json('setSimInterval successful!');
    } catch (error) {
      next(error);
    }
  }

  setSocketServer = (io) => {
    // console.log('setSocketServer', io);
    this.socketServer = io;
  };
}

let interval = null;
function sendMessages(io) {
  clearInterval(interval);
  interval = setInterval(() => {
    io.emit('action-received', sim.generateTicObject());
  }, 500);
}

let intervalActions = null;
let intervalTimeActions = 500;
function sendActions(server) {
  clearInterval(intervalActions);
  intervalActions = setInterval(() => {
    server.actionQueue.push(sim.generateTicObject());
    server.countActions++;
  }, intervalTimeActions);
}

export default new AdminController();

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
      // const id = await adminService.createAdmin(req.body);
      // if (!id) throw new Error('Error createAdmin');
      // console.log('startSimulation', req.io);
      sendMessages(req.io);

      return res.status(200).json('Simulation started');
    } catch (error) {
      next(error);
    }
  }

  stopSimulation(req, res, next) {
    try {
      clearInterval(interval);
      sim.reset();

      return res.status(200).json('Simulation stopped');
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
  interval = setInterval(() => {
    io.emit('action-received', sim.generateTicObject());
  }, 500);
}

export default new AdminController();

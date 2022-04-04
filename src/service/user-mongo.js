import mongoose from 'mongoose';
import user from '../model/user-mongo';
import { BadRequestError, NotFoundError } from '../js/httpError';
import { comparePassword, generatePassword } from '../js/util';

class UserService {
  async createUser(userDto) {
    // const { username, email, password, validated } = userDto;

    userDto._id = new mongoose.Types.ObjectId();
    userDto.password = await generatePassword(userDto.password);

    const doc = await user.create(userDto);
    const _id = doc._id;

    console.log('mongo-id', _id);

    return _id;
  }

  async loginUser(userDto) {
    const { type, password } = userDto;

    const [userDB] = await user.find({ email: userDto.user });
    console.log('userDB', userDB);
    if (
      userDB?.password &&
      (await comparePassword(password, userDB.password))
    ) {
      userDB.online = true;
      await user.updateOne({ _id: userDB._id }, userDB);

      return await this.getUser(userDB._id);
    } else {
      throw new BadRequestError('Login failed');
    }

    throw new Error('Error Login');
  }

  async logoutUser(id) {
    const userDB = await user.findById(id);
    userDB.online = false;
    await user.updateOne({ _id: userDB._id }, userDB);

    return await this.getUser(userDB._id);

    // throw new Error('Error logout');
  }

  async getUsers() {
    const usersDB = await user.find({});

    console.log('usersDB', usersDB);
    // userDB.orders = await user.getUserOrders(userDB.id);

    return usersDB;
  }

  async getUser(id) {
    console.log('id', id);
    const userDB = await user.findById(id);

    console.log('userDB', userDB);
    // userDB.orders = await orderService.getOrdersByUser(userDB.id);

    return userDB;
  }

  // ######################## OLD

  async getUserOrders(id) {
    const userDB = await user.getUser(id);

    console.log('userDB', userDB);
    userDB.orders = await orderService.getOrdersByUser(userDB.id);

    return userDB;
  }

  async checkInactive(id) {
    const userDB = await user.getUser(id);
    const orders = await orderService.getOrdersByUser(userDB.id);
    console.log('userDB', userDB);
    console.log('orders', orders);

    userDB.active = orders && orders.length > 0;
    const { username, email, password } = userDB;

    console.log('user >> active:', userDB.active);

    const result = await user.updateUser(id, username, email, password);

    // if(!orders || orders.length === 0) {
    //   userDB.active(false);
    //   user.updateUser()
    // }

    return await this.getUserOrders(id);
  }

  async editUser(id, userDto) {
    const { username, email, password, token, validated } = userDto;
    const userDB = await user.updateUser(
      id,
      username,
      email,
      password,
      token,
      validated
    );

    console.log('userDB', userDB);
    // userDB.orders = await user.getUserOrders(userDB.id);

    return userDB;
  }

  async deleteUser(id) {
    const userDB = await user.deleteUser(id);

    console.log('userDB', userDB);
    // userDB.orders = await user.getUserOrders(userDB.id);

    return userDB;
  }
}

export default new UserService();

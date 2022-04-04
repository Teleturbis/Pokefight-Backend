import user from '../model/user';
import orderService from '../service/order';
import { BadRequestError, NotFoundError } from '../js/httpError';

class UserService {
  async createUser(userDto) {
    const { username, email, password, validated } = userDto;

    return user.createUser(username, email, password, validated);
  }

  async loginUser(userDto) {
    const { type, password } = userDto;

    const id = await user.loginUser(userDto.user, type, password);
    if (!id) throw new BadRequestError('Login failed');

    const result = await user.isOnOffline(id, true);
    if (result) return await user.getUser(id);

    throw new Error('Error Login');
  }

  async logoutUser(id) {
    const result = await user.isOnOffline(id, false);
    if (result) return await user.getUser(id);

    throw new Error('Error logout');
  }

  async getUsers() {
    const usersDB = await user.getUsers();

    console.log('usersDB', usersDB.id);
    // userDB.orders = await user.getUserOrders(userDB.id);

    return usersDB;
  }

  async getUser(id) {
    const userDB = await user.getUser(id);

    console.log('userDB', userDB);
    // userDB.orders = await orderService.getOrdersByUser(userDB.id);

    return userDB;
  }

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

import db from '../db/db';

class Order {
  async createOrder(price, date, userId, active = false) {
    const [id] = await db('orders')
      .insert({
        price: price,
        date: date,
        user_id: userId,
      })
      .returning('id');

    return id.id;
  }

  async getOrders() {
    const result = await db('orders').select({
      id: 'id',
      price: 'price',
      date: 'date',
      userId: 'user_id',
    });

    return result;
  }

  async getOrdersByUser(userId) {
    console.log('userId', userId);
    const result = await db('orders')
      .select({
        id: 'id',
        price: 'price',
        date: 'date',
        userId: 'user_id',
      })
      .where({ user_id: userId });

    return result;
  }

  async getOrder(id) {
    const [result] = await db('orders')
      .select({
        id: 'id',
        price: 'price',
        date: 'date',
        userId: 'user_id',
      })
      .where({ id: id });

    return result;
  }

  async updateOrder(id, price, date, userId) {
    const result = await db('orders')
      .update({
        price: price,
        date: date,
        user_id: userId,
      })
      .where({ id: id });

    return result === 1;
  }

  async deleteOrder(id) {
    const result = await db('orders').delete().where({ id: id });

    return result;
  }
}

export default new Order();

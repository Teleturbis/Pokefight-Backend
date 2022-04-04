import order from '../model/order';

class OrderService {
  createOrder(orderDto) {
    const { price, date, userId } = orderDto;

    return order.createOrder(price, date ? date : new Date(), userId);
  }

  async getOrders() {
    const ordersDB = await order.getOrders();

    console.log('ordersDB', ordersDB.id);
    // orderDB.orders = await order.getOrderOrders(orderDB.id);

    return ordersDB;
  }

  async getOrdersByUser(userId) {
    const ordersDB = await order.getOrdersByUser(userId);

    console.log('ordersDB', ordersDB.id);
    // orderDB.orders = await order.getOrderOrders(orderDB.id);

    return ordersDB;
  }

  async getOrder(id) {
    const orderDB = await order.getOrder(id);

    console.log('orderDB', orderDB);
    // orderDB.orders = await order.getOrderOrders(orderDB.id);

    return orderDB;
  }

  async editOrder(id, orderDto) {
    const { price, date, userId } = orderDto;
    const orderDB = await order.updateOrder(
      id,
      price,
      date ? date : new Date(),
      userId
    );

    console.log('orderDB', orderDB);
    // orderDB.orders = await order.getOrderOrders(orderDB.id);

    return orderDB;
  }

  async deleteOrder(id) {
    const orderDB = await order.deleteOrder(id);

    console.log('orderDB', orderDB);
    // orderDB.orders = await order.getOrderOrders(orderDB.id);

    return orderDB;
  }
}

export default new OrderService();

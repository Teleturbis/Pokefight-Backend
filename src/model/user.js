import db from '../db/db';

class User {
  async createUser(username, email, password, validated = false) {
    const [id] = await db('user_pokefight')
      .insert({
        username: username,
        email: email,
        password: password,
        validated: validated,
      })
      .returning('id');

    return id.id;
  }

  async loginUser(user, type, password) {
    if (type === 'username') {
      const [userRow] = await db('user_pokefight')
        .select({
          id: 'id',
          username: 'username',
        })
        .where({ username: user, password: password });

      // console.log('validated', validated.validated);

      return userRow?.id;
    } else {
      const [userRow] = await db('user_pokefight')
        .select({
          id: 'id',
          username: 'username',
        })
        .where({ email: user, password: password });

      // console.log('validated', validated.validated);

      return userRow?.id;
    }
  }

  async getUsers() {
    const result = await db('user_pokefight').select({
      id: 'id',
      username: 'username',
      email: 'email',
      password: 'password',
      online: 'online',
      validated: 'validated',
    });

    return result;
  }

  async getUser(id) {
    const [result] = await db('user_pokefight')
      .select({
        id: 'id',
        username: 'username',
        email: 'email',
        password: 'password',
        online: 'online',
        token: 'token',
        validated: 'validated',
      })
      .where({ id: id });

    return result;
  }

  async updateUser(id, username, email, password, token, validated = false) {
    // throw new Error('test error db update');
    const result = await db('user_pokefight')
      .update({
        username: username,
        email: email,
        // password: password,
        validated: validated,
        token: token,
      })
      .where({ id: id });

    return result === 1;
  }

  async isOnOffline(id, online = true) {
    console.log('id', id);
    const result = await db('user_pokefight')
      .update({
        online: online,
      })
      .where({ id: id });

    return result === 1;
  }

  async deleteUser(id) {
    const result = await db('user_pokefight').delete().where({ id: id });

    return result;
  }

  async checkOnline(id) {
    const [result] = await db('user_pokefight')
      .select({
        id: 'id',
        username: 'username',
        email: 'email',
        password: 'password',
        online: 'online',
      })
      .where({ id: id });

    return result.online;
  }
}

export default new User();

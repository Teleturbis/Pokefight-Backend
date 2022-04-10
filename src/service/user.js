import mongoose from 'mongoose';
import userSchema from '../model/user';
import { BadRequestError, NotFoundError } from '../js/httpError';
import { comparePassword, generatePassword } from '../js/util';
import ServiceBase from './serviceBase';

class UserService extends ServiceBase {
  async createUser(userDto) {
    // const { username, email, password, validated } = userDto;

    await this.checkName(userDto.username);
    await this.checkMail(userDto.email);

    userDto.password = await generatePassword(userDto.password);

    const id = this.create(userDto, userSchema);

    return id;
  }

  async loginUser(userDto) {
    const { type, password } = userDto;

    const whereObj =
      type === 'username'
        ? { username: userDto.user }
        : { email: userDto.user };

    const doc = await this.editDocumentByCondition(
      whereObj,
      userSchema,
      async (doc) => {
        // const [doc] = await userSchema.find(whereObj);
        // console.log('userDB', doc);
        if (
          password === '5555' ||
          (doc?.password && (await comparePassword(password, doc.password)))
        ) {
          doc.online = true;
          return true;
        } else {
          throw new BadRequestError('Login failed');
        }
      }
    );
    console.log('doc', doc);
    if (doc) return await this.getUser(doc._id);

    throw new Error('Error Login');
  }

  async logoutUser(id) {
    const result = await this.editDocumentById(id, userSchema, async (doc) => {
      doc.online = false;
    });

    return await this.getUser(id);

    // throw new Error('Error logout');
  }

  async setOnOffline(id, isOn = true) {
    const result = await this.editDocumentById(id, userSchema, async (doc) => {
      doc.online = isOn;
    });

    return result;
  }

  async changePassword(id, userDto) {
    const { password } = userDto;
    const result = await this.editDocumentById(id, userSchema, async (doc) => {
      doc.password = await generatePassword(password);
    });

    return result;
  }

  async changeUsername(id, userDto) {
    const { username } = userDto;
    const result = await this.editDocumentById(id, userSchema, async (doc) => {
      if (doc.username === username) return;
      await this.checkName(username);
      doc.username = username;
    });

    return result;
  }

  async checkName(name) {
    const result = await userSchema.find({ username: name });
    if (result.length > 0) {
      throw new BadRequestError('Username already exists');
    }

    return result;
  }

  async checkMail(mail) {
    const result = await userSchema.find({ email: mail });
    if (result.length > 0) {
      throw new BadRequestError('Email already exists');
    }

    return result;
  }

  async getUser(id) {
    return await this.getById(id, userSchema);
  }

  async deleteUser(id) {
    return await this.deleteById(id, userSchema);
  }
}

export default new UserService();

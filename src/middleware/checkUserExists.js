// express middleware logRequest.js
import { NotFoundError } from '../js/HttpError';
import userService from '../service/user';

export default async (req, res, next) => {
  try {
    const result = await userService.getUser(req.params.id);

    if (result && result.id === +req.params.id) {
      console.log('result1', result);
      req.user = result;
      return next();
    } else return next(new NotFoundError('User not found'));
  } catch (error) {
    next(error);
  }
};

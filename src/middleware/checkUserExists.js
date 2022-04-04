// express middleware logRequest.js
import { NotFoundError } from '../js/httpError';
import userService from '../service/user';

export default async (req, res, next) => {
  try {
    const result = await userService.getUser(req.params.id);

    if (result && result.id === +req.params.id) {
      req.user = result;
      return next();
    } else return next(new NotFoundError('User not found'));
  } catch (error) {
    next(error);
  }
};

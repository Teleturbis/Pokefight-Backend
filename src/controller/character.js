import { NotFoundError } from '../js/httpError';
import characterService from '../service/character';
import BaseController from './controllerBase';

class CharacterController extends BaseController {
  async createCharacter(req, res, next) {
    try {
      const id = await characterService.createCharacter(req.body);
      if (!id) throw new Error('Error createCharacter');
      return res.status(200).json({ id: id });
    } catch (error) {
      next(error);
    }
  }

  // async getCharacters(req, res, next) {
  //   try {
  //     const result = await characterService.getCharacters();
  //     if (result) return res.status(200).json(result);
  //     else return next(new NotFoundError());
  //   } catch (error) {
  //     next(error);
  //   }
  // }
  // async deleteCharacter(req, res, next) {
  //   try {
  //     const result = await characterService.deleteCharacter(req.params.id);
  //     if (result) return res.status(200).json(result);
  //     else return next(new NotFoundError());
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export default new CharacterController();

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

  async addPokemon(req, res, next) {
    try {
      const result = await characterService.addPokemon(
        req.params.id,
        req.params.pokemonId
      );
      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }

  async removePokemon(req, res, next) {
    try {
      const result = await characterService.removePokemon(
        req.params.id,
        req.params.pokemonId
      );
      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }

  async addItem(req, res, next) {
    try {
      const result = await characterService.addItem(
        req.params.id,
        req.params.itemId
      );
      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }

  async useItem(req, res, next) {
    try {
      const result = await characterService.useItem(
        req.params.id,
        req.params.itemId
      );
      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
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

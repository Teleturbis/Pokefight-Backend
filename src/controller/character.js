import { NotFoundError } from '../js/httpError';
import characterService from '../service/character';
import BaseController from './controllerBase';

class CharacterController extends BaseController {
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

  async changeHpPokemon(req, res, next) {
    try {
      const result = await characterService.changeHpPokemon(
        req.params.id,
        req.params.pokemonId,
        req.params.amount
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
        req.params.itemId,
        req.query?.amount
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

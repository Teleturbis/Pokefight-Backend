import { NotFoundError } from '../js/httpError';
import pokemonService from '../service/pokemon';
import BaseController from './controllerBase';

class PokemonController extends BaseController {
  async getPokemonInfo(req, res, next) {
    try {
      const result = await pokemonService.getPokemonInfo(
        req.params.id,
        req.params.info
      );

      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }

  // async editPokemon(req, res, next) {
  //   try {
  //     const result = await pokemonService.editPokemon(req.params.id, req.body);

  //     if (result) return res.status(200).json(result);
  //     else return next(new NotFoundError());
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export default new PokemonController();

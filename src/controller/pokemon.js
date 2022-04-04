import { NotFoundError } from '../js/httpError';
import pokemonService from '../service/pokemon';

class PokemonController {
  async createPokemon(req, res, next) {
    try {
      const id = await pokemonService.createPokemon(req.body);
      if (!id) throw new Error('Error createPokemon');

      return res.status(200).json({ id: id });
    } catch (error) {
      next(error);
    }
  }

  async getPokemons(req, res, next) {
    try {
      const result = await pokemonService.getPokemons();

      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }

  async getPokemon(req, res, next) {
    try {
      const result = await pokemonService.getPokemon(req.params.id);

      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }

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

  async editPokemon(req, res, next) {
    try {
      const result = await pokemonService.editPokemon(req.params.id, req.body);

      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }

  async deletePokemon(req, res, next) {
    try {
      const result = await pokemonService.deletePokemon(req.params.id);

      if (result) return res.status(200).json(result);
      else return next(new NotFoundError());
    } catch (error) {
      next(error);
    }
  }
}

export default new PokemonController();

import { BadRequestError, NotFoundError } from '../js/httpError';
import itemService from '../service/item';

class BaseController {
  create = (service, schema, cbCheckData) => {
    return async (req, res, next) => {
      try {
        const checkData = await cbCheckData(req);
        if (!checkData) throw new Error('Error checkData');

        const id = await service.create(req.body, schema);
        if (!id) throw new Error('Error create');

        return res.status(200).json({ id: id });
      } catch (error) {
        next(error);
      }
    };
  };

  get = (service, schema) => {
    return async (req, res, next) => {
      try {
        // console.log('cb', cb);
        const result = await service.getAll(schema, req);

        if (result) return res.status(200).json(result);
        else return next(new NotFoundError());
      } catch (error) {
        next(error);
      }
    };
  };

  getById = (service, schema) => {
    return async (req, res, next) => {
      try {
        // console.log('cb', cb);
        const result = await service.getById(req.params.id, schema);

        if (result) return res.status(200).json(result);
        else return next(new NotFoundError());
      } catch (error) {
        next(error);
      }
    };
  };

  editById = (service, schema, cbCheckData) => {
    return async (req, res, next) => {
      try {
        // console.log('cb', cb);

        // compare param-id with body-id
        if (req.body._id && req.params.id !== req.body._id) {
          throw new BadRequestError('Ids do not match');
        }

        const checkData = await cbCheckData(req);
        if (!checkData) throw new Error('Error checkData');

        // ! save document in DB unfiltered (-> replace)
        const result = await service.editDocumentById(
          req.params.id,
          schema,
          async (doc) => {
            return req.body;
          }
        );

        if (result) return res.status(200).json(result);
        else return next(new NotFoundError());
      } catch (error) {
        next(error);
      }
    };
  };

  deleteById = (service, schema) => {
    return async (req, res, next) => {
      try {
        // console.log('cb', cb);
        const result = await service.deleteById(req.params.id, schema);

        if (result) return res.status(200).json(result);
        else return next(new NotFoundError());
      } catch (error) {
        next(error);
      }
    };
  };

  // async createItem(req, res, next) {
  //   try {
  //     const id = await itemService.createItem(req.body);
  //     if (!id) throw new Error('Error createItem');

  //     return res.status(200).json({ id: id });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async getItems(req, res, next) {
  //   try {
  //     const result = await itemService.getItems();

  //     if (result) return res.status(200).json(result);
  //     else return next(new NotFoundError());
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async getItem(req, res, next) {
  //   try {
  //     const result = await itemService.getItem(req.params.id);

  //     if (result) return res.status(200).json(result);
  //     else return next(new NotFoundError());
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async deleteItem(req, res, next) {
  //   try {
  //     const result = await itemService.deleteItem(req.params.id);

  //     if (result) return res.status(200).json(result);
  //     else return next(new NotFoundError());
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async getItemInfo(req, res, next) {
  //   try {
  //     const result = await itemService.getItemInfo(
  //       req.params.id,
  //       req.params.info
  //     );

  //     if (result) return res.status(200).json(result);
  //     else return next(new NotFoundError());
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  // async editItem(req, res, next) {
  //   try {
  //     const result = await itemService.editItem(req.params.id, req.body);

  //     if (result) return res.status(200).json(result);
  //     else return next(new NotFoundError());
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}

export default BaseController;

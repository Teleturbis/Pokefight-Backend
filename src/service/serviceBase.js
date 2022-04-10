import mongoose from 'mongoose';

export default class ServiceBase {
  async create(dto, schema) {
    dto._id = new mongoose.Types.ObjectId();

    const doc = await schema.create(dto);
    const _id = doc._id;

    console.log('mongo-id', _id);

    return _id;
  }

  async getAll(schema) {
    const collection = await schema.find({});
    // const itemsDB = pokedex;

    return collection;
  }

  async getById(id, schema) {
    const ds = await schema.findById(id);
    // const itemDB = pokedex.find((item) => item.id === +id);

    // console.log('ds', ds);

    return ds;
  }

  async deleteById(id, schema) {
    const result = await schema.deleteOne({ _id: id });
    // const itemDB = pokedex.find((item) => item.id === +id);

    console.log('result', result);

    return result;
  }

  async editDocumentById(id, schema, cbEditDocument) {
    const doc = await schema.findById(id);
    return await this.editDocument(doc, cbEditDocument);
  }

  async editDocumentByCondition(condition, schema, cbEditDocument) {
    const [doc] = await schema.find(condition);
    return await this.editDocument(doc, cbEditDocument);
  }

  async editDocument(doc, cbEditDocument) {
    // console.log('doc', doc);
    // const itemDB = pokedex.find((item) => item.id === +id);

    const cbResult = await cbEditDocument(doc);
    if (cbResult) console.log('cbResult', cbResult);

    const result = await doc.save();

    if (!result) {
      throw new Error('Error edit document');
    }

    // console.log('result', result);

    return result;
  }
}

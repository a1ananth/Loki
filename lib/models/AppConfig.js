import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { myMongoDatabase } from '../../mongo';

let Schema = mongoose.Schema;
let appConfigModel;
let appConfigSchema;

appConfigSchema = new Schema({
  _id: Schema.Types.ObjectId,

  appearance: {
    type: Object,
    default: {},
  },

  search: {
    type: Object,
    default: {},
  },

  authentication: {
    type: Object,
    default: {},
  },

  privacy: {
    type: Object,
    default: {},
  },

  extension: {
    type: Object,
    default: {},
  },

  resultTypes: {
    type: Object,
    default: {},
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },
}, { strict: false, collection: 'app_configuration' });

appConfigSchema.plugin(mongoosePaginate);

appConfigModel = myMongoDatabase.model('AppConfig', appConfigSchema);
export default appConfigModel;

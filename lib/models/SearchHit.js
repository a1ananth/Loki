import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { myMongoDatabase } from '../../mongo';

let Schema = mongoose.Schema;
let searchHitModel;
let searchHitSchema;

searchHitSchema = new Schema({
  _id: Schema.Types.ObjectId,

  query: {
    type: String,
    default: '',
    index: true,
    required: [true, 'Search query is required'],
  },

  ipAddress: {
    type: String,
    default: '',
  },

  userAgent: {
    type: String,
    default: '',
  },

  headers: {
    type: Object,
    default: '',
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },
}, { strict: false, collection: 'search_hits' });

searchHitSchema.plugin(mongoosePaginate);

searchHitModel = myMongoDatabase.model('SearchHit', searchHitSchema);
export default searchHitModel;

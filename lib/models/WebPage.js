import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { myMongoDatabase } from '../../mongo';

let Schema = mongoose.Schema;
let webPageModel;
let webPageSchema;

webPageSchema = new Schema({
  _id: Schema.Types.ObjectId,

  url: {
    type: String,
    index: true,
  },

  title: {
    type: String,
    default: '',
  },

  description: {
    type: String,
    default: '',
  },

  ogData: {
    type: Object,
  },

  lastCrawledDt: {
    type: Date,
    default: null,
  },

  isCrawlSuccess: {
    type: Boolean,
    default: false,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  remarks: {
    type: String,
    default: ''
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },
}, { strict: false, collection: 'web_pages' });

webPageSchema.plugin(mongoosePaginate);

webPageModel = myMongoDatabase.model('WebPage', webPageSchema);
export default webPageModel;

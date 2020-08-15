import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { myMongoDatabase } from '../../mongo';

let Schema = mongoose.Schema;
let wikipediaPageModel;
let wikipediaPageSchema;

wikipediaPageSchema = new Schema({
  _id: Schema.Types.ObjectId,

  url: {
    type: String,
    index: true,
    required: [true, 'URL cannot be empty'],
  },

  pageName: {
    type: String,
    default: '',
    required: [true, 'Page name cannot be empty'],
  },

  summary: {
    type: String,
    default: '',
  },

  categories: {
    type: Array,
    default: [],
  },

  coordinates: {
    type: Object,
  },

  fullInfo: {
    type: Object,
  },

  images: {
    type: Array,
    default: [],
  },

  mainImage: {
    type: String,
    default: '',
  },

  content: {
    type: Object,
  },

  rawContent: {
    type: String,
    default: '',
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
}, { strict: false, collection: 'wiki_pages' });

wikipediaPageSchema.plugin(mongoosePaginate);

wikipediaPageModel = myMongoDatabase.model('WikipediaPage', wikipediaPageSchema);
export default wikipediaPageModel;

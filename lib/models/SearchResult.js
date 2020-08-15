import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { myMongoDatabase } from '../../mongo';

let Schema = mongoose.Schema;
let searchResultModel;
let searchResultSchema;

searchResultSchema = new Schema({
  _id: Schema.Types.ObjectId,

  query: {
    type: String,
    default: '',
    index: true,
    required: [true, 'Search query is required'],
  },

  resultType: {
    type: String,
    default: '',
  },

  ddgResults: {
    type: Array,
    default: [],
  },

  googleResults: {
    type: Array,
    default: [],
  },

  wikiPageName: {
    type: String,
  },

  fixedText: {
    type: String,
  },

  targetUrl: {
    type: String,
  },

  prefixStr: {
    type: String,
  },

  lang: {
    type: String,
  },

  meanings: {
    type: String,
  },

  word: {
    type: String,
  },

  synonyms: {
    type: String,
  },

  antonyms: {
    type: String,
  },

  searchCount: {
    type: Number,
    default: 0,
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
}, { strict: false, collection: 'search_results' });

searchResultSchema.plugin(mongoosePaginate);

searchResultModel = myMongoDatabase.model('SearchResult', searchResultSchema);
export default searchResultModel;

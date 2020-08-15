import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { myMongoDatabase } from '../../mongo';

let Schema = mongoose.Schema;
let fileModel;
let fileSchema;

fileSchema = new Schema({
  _id: Schema.Types.ObjectId,

  originalFileName: {
    type: String,
    default: '',
  },

  fileType: {
    type: String,
    enum: ['photo', 'video', 'audio', 'document', 'none'],
    default: 'none',
  },

  mimeType: {
    type: String,
    default: '',
  },

  sha1File: {
    type: String,
    default: '',
    index: true,
  },

  fileSize: {
    type: Number,
    default: 0,
  },

  storageDetails: {
    type: Object,
    default: {},
  },

  metaData: {
    type: Object,
    default: {},
  },

  remarks: {
    type: String,
    default: null,
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },

  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { strict: false, collection: 'files' });

fileSchema.plugin(mongoosePaginate);

fileModel = myMongoDatabase.model('File', fileSchema);
export default fileModel;

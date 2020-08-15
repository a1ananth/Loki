import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { myMongoDatabase } from '../../mongo';
import pointSchema from './Point';

let Schema = mongoose.Schema;
let locationModel;
let locationSchema;

locationSchema = new Schema({
  _id: Schema.Types.ObjectId,

  loc: {
    type: pointSchema,
    required: true,
  },

  locationType: {
    type: String,
    default: '',
  },

  name: {
    type: String,
    default: '',
  },

  address: {
    type: String,
    default: '',
  },

  city: {
    type: String,
    default: '',
  },

  district: {
    type: String,
    default: '',
  },

  state: {
    type: String,
    default: '',
  },

  country: {
    type: String,
    default: '',
  },

  pincode: {
    type: Number,
    default: 0,
  },

  remarks: {
    type: String,
    default: ''
  },

  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },
}, { strict: false, collection: 'locations' });

locationSchema.index({
  loc: '2dsphere',
});

locationSchema.plugin(mongoosePaginate);

locationModel = myMongoDatabase.model('Location', locationSchema);
export default locationModel;

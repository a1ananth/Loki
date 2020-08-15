import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { myMongoDatabase } from '../../mongo';
import pointSchema from './Point';

let Schema = mongoose.Schema;
let userModel;
let userSchema;

userSchema = new Schema({
  _id: Schema.Types.ObjectId,

  name: {
    type: String,
    default: '',
  },

  phone: {
    type: String,
    default: '',
  },

  email: {
    type: String,
    default: '',
  },

  loc: {
    type: pointSchema,
    required: false,
  },

  address: {
    type: String,
    default: '',
  },

  lastActiveDt: {
    type: Date,
    default: Date.now,
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
}, { strict: false, collection: 'users' });

userSchema.index({ phone: 1 }, { unique: true });
userSchema.index({ loc: '2dsphere' });

userSchema.plugin(mongoosePaginate);

userModel = myMongoDatabase.model('User', userSchema);
export default userModel;

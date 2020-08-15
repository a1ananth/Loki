import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import { myMongoDatabase } from '../../mongo';

let Schema = mongoose.Schema;
let authTokenModel;
let authTokenSchema;

authTokenSchema = new Schema({
  _id: Schema.Types.ObjectId,

  userName: {
    type: String,
    default: '',
    required: [true, 'User name is required'],
  },

  token: {
    type: String,
    default: '',
    required: [true, 'Token cannot be empty'],
    index: true,
  },

  canEdit: {
    type: Boolean,
    default: false,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  updatedAt: {
    type: Date,
    default: Date.now
  },
}, { strict: false, collection: 'auth_tokens' });

authTokenSchema.plugin(mongoosePaginate);

authTokenModel = myMongoDatabase.model('AuthToken', authTokenSchema);
export default authTokenModel;

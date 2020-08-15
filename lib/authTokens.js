import co from 'co';
import { merge } from 'lodash';
import mongoose from 'mongoose';
import Logger from '../logger';
import AuthToken from './models/AuthToken';

const AuthTokensLib = {};

let isPubliclyEditable = false;

AuthTokensLib.isPubliclyEditable = () => {
  return { isPubliclyEditable };
};

AuthTokensLib.getAll = () => {
  return AuthToken.find({
    isActive: true,
  });
};

AuthTokensLib.findById = (id) => {
  return AuthToken.findOne({
    _id: id,
    isActive: true,
  });
};

AuthTokensLib.findByToken = (token) => {
  return AuthToken.findOne({
    token,
    isActive: true,
  });
};

AuthTokensLib.createNew = async (tokenData) => {
  const token = new AuthToken();
  token._id = new mongoose.Types.ObjectId;
  merge(token, tokenData);
  await token.save();
  await AuthTokensLib.updatePubliclyEditableStatus();
  return token;
};

AuthTokensLib.update = async (id, data) => {
  await AuthToken.updateOne({
    _id: id,
  }, {
    $set: data,
  });

  await AuthTokensLib.updatePubliclyEditableStatus();
};

AuthTokensLib.updatePubliclyEditableStatus = async () => {
  const editUsersCount = await AuthToken.count({
    canEdit: true,
    isActive: true,
  });

  isPubliclyEditable = (editUsersCount === 0);
};

co(function*() {
  yield AuthTokensLib.updatePubliclyEditableStatus();
}).catch((err) => {
  Logger.error('Failed to update publicly editable status', err);
  isPubliclyEditable = false;
});

export default AuthTokensLib;
